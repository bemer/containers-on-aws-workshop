# Creating your Docker image

![container](https://github.com/bemer/lts-workshop/blob/master/02-CreatingDockerImage/images/container.png)


**Quick jump:**

* [1. Tutorial overview](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#tutorial-overview)
* [2. Creating your first image](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#creating-your-first-image)
* [3. Setting up the IAM Roles](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#setting-up-the-iam-roles)
* [4. Configuring the AWS CLI](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#configuring-the-aws-cli)
* [5. Creating the Container registries with ECR](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#creating-the-container-registries-with-ecr)
* [6. Pushing our tested images to ECR](https://github.com/bemer/lts-workshop/tree/master/02-CreatingDockerImage#pushing-our-tested-images-to-ecr)

## 1. Tutorial overview

This tutorial is going to drive you through the process of creating your first Docker image, running a Docker image locally and pushing it to a image repository.

In this tutorial, we assume that you completed the "[Setup Environment](https://github.com/bemer/lts-workshop/tree/master/01-SetupEnvironment)" tutorial and:

* [Have a working AWS account](<https://aws.amazon.com>)
* [Have a working Github account](<https://www.github.com>)
* [Have the AWS CLI installed](<http://docs.aws.amazon.com/cli/latest/userguide/installing.html>)

To check if you have the AWS CLI installed and configured:

    $ aws --version

This should return something like:

    $ aws --version
    aws-cli/1.14.7 Python/2.7.12 Darwin/15.6.0 botocore/1.8.11

> Note that to run this tutorial, you need to have the most recent version of AWS CLI installed.

To check if you have Docker installed:

    $  which docker

This should return something like:

    $ which docker
    /usr/bin/docker

If you have completed these steps, you are good to go!

## 2. Creating your first image

Clone this repository:

    $ git clone https://github.com/bemer/lts-workshop.git

Now we are going to build and test our containers locally.  If you've never worked with Docker before, there are a few basic commands that we'll use in this workshop, but you can find a more thorough list in the [Docker "Getting Started" documentation](https://docs.docker.com/engine/getstarted/).

To start your first container, go to the `app` directory in the project:

    $ cd <path/to/project>/02-CreatingDockerImage/app

And run the following command to build your image:

    $ docker build -t lts-demo-app .

This should output steps that look something like this:

    $ docker build -t lts-demo-app .
    Sending build context to Docker daemon  4.608kB
    Step 1/9 : FROM ubuntu:latest
     ---> 20c44cd7596f
    Step 2/9 : MAINTAINER brunemer@amazon.com
     ---> Running in 2d3745e79c4f
     ---> 06781c0980fb
    Removing intermediate container 2d3745e79c4f
    Step 3/9 : RUN apt-get update -y && apt-get install -y python-pip python-dev build-essential
     ---> Running in 7e3bf79f03a2

If the container builds successfully, the output should end with something like this:

     Removing intermediate container d2cd523c946a
     Successfully built ec59b8b825de

To run your container:

     $  docker run -d -p 3000:3000 lts-demo-app

To check if your container is running:

     $ docker ps

This should return a list of all the currently running containers.  In this example,  it should just return a single container, the one that we just started:

    CONTAINER ID        IMAGE                 COMMAND             CREATED              STATUS              PORTS                              NAMES
    fa922a2376d5        lts-demo-app:latest   "python app.py"     About a minute ago   Up About a minute   3000/tcp,    0.0.0.0:3000->3000/tcp   clever_shockley   

To test the actual container output, access the following URL in your web browser:

     http://localhost:3000/app


## 3. Setting up the IAM roles

In order to work with the AWS CLI, you'll need an IAM role with the proper permissions set up.  To do this, we'll create both an IAM Group, and an IAM user.

To create the group, navigate to the IAM console, and select **Groups** > **Create New Group**.  Name the group "**lts-workshop**".  From the list of managed policies, add the following policies:

![add IAM group](https://github.com/bemer/lts-workshop/blob/master/02-CreatingDockerImage/images/iam-group-permissions.png)

Once you've created your group, you need to attach it to a user.  If you already have an existing user, you can add it to the lts-workshop group.  If you don't have a user, or need to create a new one, you can do so by going to **Users** > **Add User**.

If you are creating a new user, name it to something like "**lts-workshop-user**", so it is going to be easy delete all the assets used in this lab later. In the wizard, add your user to the "**lts-workshop**" group that we created in the previous step:

![add user to group](https://github.com/bemer/lts-workshop/blob/master/02-CreatingDockerImage/images/add_user_to_group.png)


When the wizard finishes, make sure to copy or download your access key and secret key.  You'll need them in the next step.

## 4. Configuring the AWS CLI

If you've never configured the AWS CLI, the easiest way is by running:

    $ aws configure

This should drop you into a setup wizard:

    $ aws configure
    AWS Access Key ID [****************K2JA]:
    AWS Secret Access Key [****************Oqx+]:
    Default region name [us-east-1]:
    Default output format [json]:

If you already have a profile setup with the AWS CLI, you can also add a new profile to your credentials file. In order to add another profile, edit your credentials (usually located in *~/.aws/credentials*) and add a new profile called "**lts-workshop**". After adding this new profile, your credentials file will be like this:

    [default]
    aws_access_key_id = AKIABCDMYKEYEXAMPLE1
    aws_secret_access_key = CAFESECRETACCESSKEYEXAMPLE001

    [lts-workshop]
    aws_access_key_id = AKIABCDMYKEYEXAMPLE2
    aws_secret_access_key = CAFESECRETACCESSKEYEXAMPLE002


You can test that your IAM user has the correct permissions, and that your CLI is setup to connect to your AWS account by running the command to obtain an ECR authentication token.  This will allow us to pull our registries in the next step:

    $ aws ecr get-login --region us-east-1 --no-include-email --profile lts-workshop

This should output something like:

    $ docker login -u AWS -p AQECAHhwm0YaISJeRtJm5n1G6uqeekXuoXXPe5UFce9Rq8/14wAAAy0wggMpBgkqhkiG9w0BBwagggMaM
    IIDFgIBADCCAw8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM+76slnFaYrrZwLJyAgEQgIIC4LJKIDmvEDtJyr7jO661//6sX6cb2je
    D/RP0IA03wh62YxFKqwRMk8gjOAc89ICxlNxQ6+cvwjewi+8/W+9xbv5+PPWfwGSAXQJSHx3IWfrbca4WSLXQf2BDq0CTtDc0+payiDdsX
    dR8gzvyM7YWIcKzgcRVjOjjoLJpXemQ9liPWe4HKp+D57zCcBvgUk131xCiwPzbmGTZ+xtE1GPK0tgNH3t9N5+XA2BYYhXQzkTGISVGGL6
    Wo1tiERz+WA2aRKE+Sb+FQ7YDDRDtOGj4MwZ3/uMnOZDcwu3uUfrURXdJVddTEdS3jfo3d7yVWhmXPet+3qwkISstIxG+V6IIzQyhtq3BX
    W/I7pwZB9ln/mDNlJVRh9Ps2jqoXUXg/j/shZxBPm33LV+MvUqiEBhkXa9cz3AaqIpc2gXyXYN3xgJUV7OupLVq2wrGQZWPVoBvHPwrt/D
    KsNs28oJ67L4kTiRoufye1KjZQAi3FIPtMLcUGjFf+ytxzEPuTvUk4Xfoc4A29qp9v2j98090Qx0CHD4ZKyj7bIL53jSpeeFDh9EXubeqp
    XQTXdMzBZoBcC1Y99Kk4/nKprty2IeBvxPg+NRzg+1e0lkkqUu31oZ/AgdUcD8Db3qFjhXz4QhIZMGFogiJcmo=
    https://<account_id>.dkr.ecr.us-east-1.amazonaws.com


> Specify if the '-e' flag should be included in the 'docker login' command. The '-e' option has been deprecated and is removed in docker version 17.06 and later. You must specify --no-include-email if you're using docker version 17.06 or later. The default behavior is to include the '-e' flag in the 'docker login' output.


To login to ECR, copy and paste that output or just run `` `aws ecr get-login --region us-east-1 --no-include-email --profile lts-workshop` `` which will tell your shell to execute the output of that command.  That should return something like:

    WARNING! Using --password via the CLI is insecure. Use --password-stdin.
    Login Succeeded

Note:  if you are running Ubuntu, it is possible that you will need to preface your Docker commands with `sudo`.  For more information on this, see the [Docker documentation](https://docs.docker.com/engine/installation/linux/ubuntu/).

If you are unable to login to ECR, check your IAM user group permissions.

## 5. Creating the container registries with ECR

Before we can build and push our images, we need somewhere to push them to.  In this case, we're going to create two repositories in [ECR](https://aws.amazon.com/ecr/).

To create a repository, navigate to the ECS console, and select **Repositories**.  From there, choose **Create repository**.

Name your first repository **lts-demo-app**:

![create ecr repository](https://github.com/bemer/lts-workshop/blob/master/02-CreatingDockerImage/images/creating_repository.png)

Once you've created the repository, it will display the push commands.  Take note of these, as you'll need them in the next step.  The push commands should like something like this:

![push commands](https://github.com/bemer/lts-workshop/blob/master/02-CreatingDockerImage/images/push_commands.png)

## 6. Pushing our tested images to ECR

Now that we've tested our images locally, we need to tag them again, and push them to ECR.  This will allow us to use them in TaskDefinitions that can be deployed to an ECS cluster.  

You'll need your push commands that you saw during registry creation.  If you've misplaced your push commands, you can find them again by going back to the repository (**ECS Console** > **Repositories** > Select the Repository you want to see the commands for > **View Push Commands**.

To tag and push the web repository:

    $ docker tag lts-demo-app:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/lts-demo-app:latest
    $ docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/lts-demo-app:latest

> Why `:latest`?  This is the actual image tag.  In most production environments, you'd tag images for different schemes:  for example, you might tag the most up-to-date image with `:latest`, and all other versions of the same container with a commit SHA from a CI job.  If you push an image without a specific tag, it will default to `:latest`, and untag the previous image with that tag.  For more information on Docker tags, see the Docker [documentation](https://docs.docker.com/engine/getstarted/step_six/).


This step will take some minutes. When the command finishes, you should see something like this:

    The push refers to a repository [<account_id>.dkr.ecr.us-east-1.amazonaws.com/lts-demo-app]
    9ef5219507db: Pushed
    b3d18e8f520f: Pushed
    a83b4d2ff3a0: Pushed
    2f5b0990636a: Pushed
    c9748fbf541d: Pushed
    b3968bc26fbd: Pushed
    aa4e47c45116: Pushed
    788ce2310e2f: Pushed
    latest: digest: sha256:38588bb240b57d123522ab3d23107cec642907a99f1379445fbea27dafc58608 size: 1988


You can see your pushed images by viewing the repository in the AWS Console.  Alternatively, you can use the CLI:

    $ aws ecr list-images --repository-name=lts-demo-app --region us-east-1 --profile lts-workshop
    {
        "imageIds": [
            {
                "imageTag": "latest",
                "imageDigest": "sha256:38588bb240b57d123522ab3d23107cec642907a99f1379445fbea27dafc58608"
            }
        ]
    }
