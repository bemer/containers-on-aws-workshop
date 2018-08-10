## Quick jump:

* [1. Tutorial overview](/06-CDECS#1-tutorial-overview)
* [2. Creating a Source stage](/06-CDECS#2-creating-a-source-stage)
* [3. Creating a Build stage](/06-CDECS#3-creating-a-build-stage)
* [4. Configuring a Continous Delivery pipeline](/06-CDECS#4-configuring-a-continous-delivery-pipeline)
* [5. Testing our pipeline](/06-CDECS#5-testing-our-pipeline)

## 1. Tutorial overview

So far we've been deploying our containers into ECS manually. On a production enviroment, changes that happens on code or on the container image itself should be builded, tested and deployed, all automatically. This process is commonly known as Continous Delievey (CD).

To support us on this task, we must create a Continous Delivery pipeline that will orchestrate different stages of our pipeline. For this workshop our pipeline will have three stages:

**a) a Source stage**: the Git repository branch where all the changes should be promoted to a production enviroment. We will use AWS CodeCommit as the Git repository;

**b) a Build stage**: automatically pulls the content from the Git repository, builds and tags the Docker image, and pushes the new version to Amazon ECR. We will use AWS CodeBuild for this job;

**c) a Deployment stage**: automatically deploys the new version of our application that is on Amazon ECR into Amazon ECS. The Amazon ECS itself will be responsible for deploying it without any downtime;

Since we already have the Deployment stage working, we only need to create the Source stage and the Build stage, and later, figure out how to connect all those stages to finally form an actual Continous Delivery pipeline. 

Let's begin with the Source stage.

## 2. Creating a Source stage

In the AWS Console Management, type on the search field `Commit` and select **CodeCommit** from the drop down list.

![CodeCommit](/06-CDECS/images/codecommit.png)

If this is your first time using CodeCommit, click in **Get started**.

![Get started with CodeCommit](/06-CDECS/images/codecommit_get_started.png)

Otherwise click **Create repository**.

![CodeCommit create repository](/06-CDECS/images/codecommit_create_repository.png)

In **Respoitory name** type a name for your respository. For exmaple: `containers-workshop-repository`. Leave **Description** blank and click in **Create repository**.

![CodeCommit create repository](/06-CDECS/images/codecommit_create_repository_II.png)

In **Configure email notifications** just click in **Skip**.

Now follow the steps that appear in **Steps to clone your repository** 

![CodeCommit clone respository](/06-CDECS/images/codecommit_clone_repository.png)

    $ git config --global credential.helper '!aws codecommit credential-helper $@'
    $ git config --global credential.UseHttpPath true
    $ git clone https://git-codecommit.us-east-2.amazonaws.com/v1/repos/containers-workshop-repository

The output should be something like:

    $ Cloning into 'containers-workshop-repository'...
    $ warning: You appear to have cloned an empty repository.
    $ Admin:~/environment $

Aditionally you'll also need to type the following commands with your email and a username. This is just to identity who commited a new change to the repository:

    $ git config --global user.email "YOUREMAIL@HERE.COM"
    $ git config --global user.name "USERNAME"

Now we need to copy our application to the CodeCommit repository. First, go to the folder where your application resides

    $ cd /home/ec2-user/environment/containers-on-aws-workshop/00-Application/

Copy everything to the folder that was created when you cloned the empty repository from CodeCommit

    $ cp -r * /home/ec2-user/environment/containers-workshop-repository/

Go to the folder where we will synchronize with the CodeCommit repository

    $ cd /home/ec2-user/environment/containers-workshop-repository/

Now let's push our application to the repository

    $ git add .
    $ git commit -m "My first commit"

The output should be somoething like:

    $ [master 4956fb4] My first commit
    $ 62 files changed, 20787 insertions(+)
    $ create mode 100644 Dockerfile
    $ create mode 100644 app/LICENSE
    $ create mode 100644 app/css/coming-soon.css
    $ create mode 100644 app/gulpfile.js
    $ create mode 100644 app/img/AWS_logo_RGB_REV.png
    $ create mode 100644 app/img/bg-mobile-fallback.png
    $ ...

Finally

    $ git push origin master

The output should be something like:

    $ Counting objects: 77, done.
    $ Compressing objects: 100% (73/73), done.
    $ Writing objects: 100% (77/77), 4.27 MiB | 7.42 MiB/s, done.
    $ Total 77 (delta 5), reused 0 (delta 0)
    $ To https://git-codecommit.us-east-2.amazonaws.com/v1/repos/containers-workshop-repository
    $ * [new branch]      master -> master

We can also list the files through the CodeCommit interface:

![CodeCommit list files](/06-CDECS/images/codecommit_list_files.png)

## 3. Creating a Build stage

Before we create our CodeBuild environment, we need to upload the YAML file with all the build commands and specifications. This file will be read by the CodeBuild everytime a new build must be done.

In Clou9, click in **File > New File**

![Cloud9 new file](/06-CDECS/images/cloud9_new_file.png)

Paste the following code in the new file, and change the `REPOSITORY_URI` with the URI of your ECR repository

```
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - $(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
      - REPOSITORY_URI=XXXXXXXXXXXX.dkr.ecr.us-east-2.amazonaws.com/containers-workshop-app
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...          
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
      - echo Writing image definitions file...
      - printf '[{"name":"cicd-test","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```

Save the file by selecting **File > Save** in Cloud9. Name it as `buildspec.yml` in the `containers-workshop-repository` folder

![Save the buildspec.yml file](/06-CDECS/images/buildspec_save.png)

In the AWS Management Console, click in Services, type in the search field `Build` and then select **CodeBuild** from the drop down list

![CodeBuild](/06-CDECS/images/codebuild.png)

If this is your first time using CodeBuild, click in **Get started**

![CodeBuild get started](/06-CDECS/images/codebuild_get_started.png)

Otherwise, click in **Create project**

![CodeBuild create project](/06-CDECS/images/codebuild_create_project.png)

Change only what's defined below:

**Project name**: `containers-workshop-build`

**Source provider**: `AWS CodeCommit`

**Repository**: `containers-workshop-repository`

**Operating system**: `Ubuntu`

**Runtime**: `Docker`

**Runtime version**: `aws/codebuild/docker:17.09.0`

