## Quick jump:

* [1. Tutorial overview](/05-ContinousDelivery#1-tutorial-overview)
* [2. Creating a Source stage](/05-ContinousDelivery#2-creating-a-source-stage)
* [3. Creating a Build stage](/05-ContinousDelivery#3-creating-a-build-stage)
* [4. Configuring a Continous Delivery pipeline](/05-ContinousDelivery#4-configuring-a-continous-delivery-pipeline)
* [5. Testing our pipeline](/05-ContinousDelivery#5-testing-our-pipeline)

## 1. Tutorial overview

So far we've been deploying our containers into ECS manually. On a production environment, changes that happens on code or on the container image itself should be builded, tested and deployed, all automatically. This process is commonly known as Continous Delivery (CD).

To support us on this task, we must create a Continous Delivery pipeline that will orchestrate different stages of our pipeline. For this workshop our pipeline will have three stages:

**a) a Source stage**: the Git repository branch where all the changes should be promoted to a production environment. We will use AWS CodeCommit as the Git repository;

**b) a Build stage**: automatically pulls the content from the Git repository, builds and tags the Docker image, and pushes the new version to Amazon ECR. We will use AWS CodeBuild for this job;

**c) a Deployment stage**: automatically deploys the new version of our application that is on Amazon ECR into Amazon ECS. The Amazon ECS itself will be responsible for deploying it without any downtime;

Since we already have the Deployment stage working, we only need to create the Source stage and the Build stage, and later, figure out how to connect all those stages to finally form an actual Continous Delivery pipeline.

Let's begin with the Source stage.

## 2. Creating a Source stage

In the AWS Console Management, type on the search field `Commit` and select **CodeCommit** from the drop down list.

![CodeCommit](/05-ContinousDelivery/images/codecommit.png)

If this is your first time using CodeCommit, click in **Get started**.

![Get started with CodeCommit](/05-ContinousDelivery/images/codecommit_get_started.png)

Otherwise click **Create repository**.

![CodeCommit create repository](/05-ContinousDelivery/images/codecommit_create_repository.png)

In **Respoitory name** type `containers-workshop-repository`. Leave **Description** blank and click in **Create repository**.

![CodeCommit create repository](/05-ContinousDelivery/images/codecommit_create_repository_II.png)

In **Configure email notifications** just click in **Skip**.

Now follow the steps that appear in **Steps to clone your repository**

![CodeCommit clone respository](/05-ContinousDelivery/images/codecommit_clone_repository.png)

    $ git config --global credential.helper '!aws codecommit credential-helper $@'
    $ git config --global credential.UseHttpPath true
    $ git clone https://git-codecommit.us-east-2.amazonaws.com/v1/repos/containers-workshop-repository

The output should be something like:

    $ Cloning into 'containers-workshop-repository'...
    $ warning: You appear to have cloned an empty repository.
    $ Admin:~/environment $

Aditionally you'll also need to type the following commands with your email and a username. This is just to identify who commited a new change to the repository:

    $ git config --global user.email "YOUREMAIL@HERE.COM"
    $ git config --global user.name "USERNAME"

At this point, you should have two folders: `containers-on-aws-workshop` and `containers-workshop-repository`. Now we need to copy our application to the CodeCommit repository. First, go to the folder where your application resides

    $ cd /home/ec2-user/environment/containers-on-aws-workshop/00-Application/

Copy everything to the folder that was created when you cloned the empty repository from CodeCommit

    $ cp -r * /home/ec2-user/environment/containers-workshop-repository/

Go to the folder where we will synchronize (push) with the CodeCommit repository

    $ cd /home/ec2-user/environment/containers-workshop-repository/

Now let's push our application to the repository

    $ git add .
    $ git commit -m "My first commit"

The output should be something like:

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

![CodeCommit list files](/05-ContinousDelivery/images/codecommit_list_files.png)

## 3. Creating a Build stage

Before we create our CodeBuild environment, we need to upload the YAML file with all the build commands and specifications. This file will be read by CodeBuild everytime a new build must be done.

In Clou9, click in **File > New File**

![Cloud9 new file](/05-ContinousDelivery/images/cloud9_new_file.png)

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
      - printf '[{"name":"containers-workshop-app","imageUri":"%s"}]' $REPOSITORY_URI:$IMAGE_TAG > imagedefinitions.json
artifacts:
    files: imagedefinitions.json
```

Save the file by selecting **File > Save** in Cloud9. Name it as `buildspec.yml` in the `containers-workshop-repository` folder

![Save the buildspec.yml file](/05-ContinousDelivery/images/buildspec_save.png)

At this point, your repository folder should contain an `app` folder, a `buildspec.yml` file and a `Dockerfile` file. Let's push to our repository

    $ git add buildspec.yml
    $ git commit -m "Adding the build specifications file"
    $ git push origin master

The `buildpsec.yml` shoudld be listed now

![List buildspec](/05-ContinousDelivery/images/buildspec_list.png)

Now we have everything that we need to create our Build environment. In the AWS Management Console, click in **Services**, type in the search field `Build` and then select **CodeBuild** from the drop down list

![CodeBuild](/05-ContinousDelivery/images/codebuild.png)

If this is your first time using CodeBuild, click in **Get started**

![CodeBuild get started](/05-ContinousDelivery/images/codebuild_get_started.png)

Otherwise, click in **Create project**

![CodeBuild create project](/05-ContinousDelivery/images/codebuild_create_project.png)

Change only what's defined below:

**Project name**: `containers-workshop-build`

**Source provider**: `AWS CodeCommit`

**Repository**: `containers-workshop-repository`

**Operating system**: `Ubuntu`

**Runtime**: `Docker`

**Runtime version**: `aws/codebuild/docker:17.09.0`

Expand **Show advanced settings**

**Environment variables**: let's create two env vars: 

In `Name` type `REPOSITORY_URI`, in `Value` type your ECR URI. 
In `Name` type `AWS_DEFAULT_REGION`, in `Value` type the region code where your ECR repository resides (e.g. `us-east-1` for N. Virginia, `us-east-2` for Ohio...).

Click **Continue** and then click in **Save**. Your build project should be listed now:

![CodeBuild list project](/05-ContinousDelivery/images/codebuild_list_project.png)

If we try and test our build now, it will fail. There are two reasons for that:

1) The service CodeBuild doesn't have permissions to read anything from our CodeCommit repository;

2) The IAM role associated with the CodeBuild environment has only permissions to input logs in the CloudWatch logs (that's the default permissions created by the CodeBuild service role).

Let's fix these.

First, let's change de ECR repository permisions. In the AWS Management Console, click in **Services** > in the search field type `ecs` and select **Elastic Container Service** from the drop down list

![select ECS](/05-ContinousDelivery/images/ecs_select.png)

On the left side menu, click in **Repositories** and then click in the ECR repository that we are using (`containers-workshop-app`)

Click in the tab **Permissions** and click in **Add**

![ECR add permissions](/05-ContinousDelivery/images/ecr_add_permissions.png)

For **Sid** type `Codebuild permission`

For **Principal** type `codebuild.amazonaws.com`

For **Action** select the following actions: `ecr:GetDownloadUrlForLayer`, `ecr:PutImage`, `ecr:CompleteLayerUpload`, `ecr:BatchGetImage`, `ecr:InitiateLayerUpload`, `ecr:BatchCheckLayerAvailability`, `ecr:UploadLayerPart`

![ECR actions](/05-ContinousDelivery/images/ecr_actions.png)

Click in **Save all**

Next step, we need to change de IAM role associated with our CodeBuild environment. In the AWS Management Console, go to **Services** > in the search field type `iam` and select **IAM** from the drop down list

![Select IAM](/05-ContinousDelivery/images/iam.png)

On the left side menu, click in **Roles**. This will list all the roles in your account. We need to find what is the role associated with our CodeBuild.

Go to your CodeBuild project and click in **Edit project**. Scroll down until you find **Service role**. In **Role name** you can find the role associated (e.g.: `codebuild-containers-workshop-build-service-role`)

![Find the IAM role](/05-ContinousDelivery/images/codebuild_find_iam_role.png)

Go back to the IAM roles list and type the role name in the search field. Click in the IAM role that appears.

![IAM filter role](/05-ContinousDelivery/images/iam_filter_role.png)

In the **Permissions** tab click in **Attach policies**

![Find the IAM role](/05-ContinousDelivery/images/iam_attach_policies.png)

In the serch field type `registry` and select `AmazonEC2ContainerRegistryPowerUser`. Click in **Attach policy**

![Attach ECR Power User](/05-ContinousDelivery/images/iam_registry_policy.png)

Your permissions should look like this:

![Permissions list](/05-ContinousDelivery/images/iam_permissions_list.png)

Now let's go ahead and configure our test build.

On the AWS Management Console, click in **Services** > in the search field type `build` and select **CodeBuild** from the drop down list.

In **CodeBuild**, on the left side, click in **Build projects**. Select your project by clicking in the radio button and then click in **Start build**

For **Branch** select `master`. Leave everything else with the default configuration and click in **Start build**

![CodeBuild list project](/05-ContinousDelivery/images/codebuild_test_project.png)

The build phase might take a while to finish. Once its completed, you should see all the **Phase details** as `Succeeded`.

![CodeBuild Status Succeeded](/05-ContinousDelivery/images/codebuild_succeeded.png)

## 4. Configuring a Continous Delivery pipeline

Now that our Source (CodeCommit), Build (CodeBuild) and Deploy (ECS) stages are done, we need a tool to orchestrate and connect all of them. To achieve this we will use AWS CodePipeline.

AWS CodePipeline already has the concepts of Stages (Source, Build, Test, Deploy, Approval, Invoke). All we need to do is to create a pipeline, and for each stage, choose the correlated service. For example, when configuring the Source stage, we will choose our CodeCommit respository. And so on...

Le'ts start with the Source Stage:

On the AWS Management Console, click in **Services** > in search field type `pipeline` and select **CodePipeline** from the drop down list.

![CodePipeline](/05-ContinousDelivery/images/codepipeline.png)

If this is your first time using CodePipeline, click in **Get started**.

![CodePipeline Get started](/05-ContinousDelivery/images/codepipeline_get_started.png)

Otherwise click in **Create pipeline**

![CodePipeline create](/05-ContinousDelivery/images/codepipeline_create.png)

In **Pipeline name** type `containers-workshop-pipeline` and click in **Next step**

![CodePipeline Next Step](/05-ContinousDelivery/images/codepipeline_next.png)

For **Source provider** select **CodeCommit**

![CodePipeline Source Stage](/05-ContinousDelivery/images/codepipeline_source.png)

For **Repository name** select the respository created for this workshop `containers-workshop-repository`

For **Branch name** select `master`

Click in **Next step**

![CodePipeline Source Stage](/05-ContinousDelivery/images/codepipeline_repository_ii.png)

We are now configuring the Buid Stage:

For **Build provider** select **CodeBuild** and click in **Next step**

![CodePipeline Build Stage](/05-ContinousDelivery/images/codepipeline_create_build.png)

In **Configure your project** choose the option **Select an existing build project**.

For **Project name** select `containers-workshop-build` and click in **Next step**

![CodePipeline Build Stage](/05-ContinousDelivery/images/codepipeline_create_build_ii.png)

Finally, it's time to configure the last stage of our pipeline: the Deploy Stage.

For **Deployment provider** select **Amazon ECS**

![CodePipeline Deploy Stage](/05-ContinousDelivery/images/codepipeline_deploy.png)

For **Cluster name** select `containers-workshop-ecs-cluster`

For **Service name** select `containers-workshop-ecs-service`

For **Image filename** type `imagedefinitions.json`

Click in **Next step**

![CodePipeline Deploy Stage](/05-ContinousDelivery/images/codepipeline_deploy_ii.png)

In **AWS Service Role**, for **Role name**. You will be redirected to another page. Click in **Allow**

![CodePipeline Deploy Stage](/05-ContinousDelivery/images/codepipeline_iam.png)

Click in **Next step**

Click in **Create pipeline**.

You should see now that AWS CodePiepline will automatically start the pipeline.

![CodePipeline Running](/05-ContinousDelivery/images/codepipeline_running.png)

Thow whole process should take around 10 minutes. All three stages should be completed as `Succeeded`.


![CodePipeline Finished](/05-ContinousDelivery/images/codepipeline_succeeded.png)


If you go to the URL of your app you won't see any changes beucase we didn't change anything. So now, let's do exactly that. Let's change something on our app to see the modification being deployed automatically.

## 5. Testing our pipeline

Go to your Cloud9 enviroment. On the left side menu, expand `MyCloud9Instance > containers-workshop-repository > app`

Right click in the `index.html` > Open

![Test your pipeline](/05-ContinousDelivery/images/cloud9_open_index.png)

A new tab will open. In line 37, before `This application is running inside a container!`, add the following text: `This is the version 2!`. Should look like this:

![Test your pipeline](/05-ContinousDelivery/images/cloud9_edit_html.png)

Save it (Ctrl+S or Command+S)

Now let's commit our change to the CodeCommit repository. Go to the Terminal tab and type

    $ cd /home/ec2-user/environment/containers-workshop-repository/app
    $ git add index.html
    $ git commit -m "Changing the text"
    $ git push


Watch the CodePipeline being executed. You will see in a minute or so, the Source stage changing to `In Progress`. Wait until the Staging source is done.


![CodePipeline final run](/05-ContinousDelivery/images/codepipeline_final_test.png)


Go to your app URL and see the new text!