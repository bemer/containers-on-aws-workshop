# Creating the Frontend Docker image

![container](/02-CreatingFrontendDockerImage/images/container.png)


## Quick jump:

* [1. Tutorial overview](/02-CreatingFrontendDockerImage#1-tutorial-overview)
* [2. Creating the frontend Docker image](/02-CreatingFrontendDockerImage#2-creating-your-first-image)
* [3. Creating the image repository with ECR](/02-CreatingFrontendDockerImage#3-creating-the-image-repository-with-ecr)
* [4. Pushing our tested images to ECR](/02-CreatingFrontendDockerImage#4-pushing-our-tested-images-to-ecr)

## 1. Tutorial overview

This tutorial is going to drive you through the process of creating your first Docker image, running this image locally and pushing it to a image repository. If you are going to execute this lab in the Cloud9 environment, you can jump to [2. Creating your first image](/02-CreatingFrontendDockerImage#2-creating-your-first-image).

>This Docker image will have a very simple web application that you can find in the `00-Application/app` directory.

In this tutorial, we assume that you completed the [Setup Environment tutorial](/01-EnvironmentSetup) and:

* [Have a working AWS account](<https://aws.amazon.com>)
* [Have a working Github account](<https://www.github.com>)
* [Have the AWS CLI installed](<http://docs.aws.amazon.com/cli/latest/userguide/installing.html>)

To check if you have the AWS CLI installed and configured:

    $ aws --version

This should return something like:

    $ aws --version
    aws-cli/1.15.83 Python/2.7.14 Linux/4.14.72-68.55.amzn1.x86_64 botocore/1.10.82

> Note that to run this tutorial, you need to have the most recent version of AWS CLI installed.

To check if you have Docker installed:

    $  docker -v

This should return something like:

    Docker version 18.06.1-ce, build e68fc7a215d7133c34aa18e3b72b4a21fd0c6136

>If you after running the `docker -v` command you don't get this output, please follow the install instructions in [this link](/01-SetupEnvironment).

If you have completed these steps, you are good to go!

## 2. Creating the frontend Docker image

The following steps should be executed on your own computer or Cloud9 instance, if you chose it.

If you haven't executed the `git clone` command present in the [Setup Environment](/01-SetupEnvironment) chapter, do it now using the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

Now we are going to build an image and test it locally. If you've never worked with Docker before, there are a few basic commands that we'll use in this workshop, but you can find a more thorough list in the [Docker "Getting Started" documentation](https://docs.docker.com/engine/getstarted/).

In this step, we are going to build a *Docker image* with the frontend of our application. The application that we will be using is available on the directory `00-Application/frontend` inside the project folder. Lets's navigate to the `00-Application/frontend` directory:

    $ cd containers-on-aws-workshop/00-Application/frontend

Take a look on the contents of this directory. You will see that there is a directory called `code/` and also a file named `Dockerfile`. We will be using this `Dockerfile` to package our web application. In order to do that, run the following command inside the `frontend` directory:

    $ docker build -t containers-workshop-frontend .

This should output steps that look something like this:

    Sending build context to Docker daemon  6.875MB
    Step 1/12 : FROM node:11.1.0 as build-deps
    ---> e893e87c6b5c
    Step 2/12 : RUN mkdir /usr/src/app
    ---> Running in 23713e0f15cc
    Removing intermediate container 23713e0f15cc
    ---> 920862581cb3
    Step 3/12 : WORKDIR /usr/src/app
    ---> Running in 25d3a7a96c09
    Removing intermediate container 25d3a7a96c09
    ---> 70b34d8d8b35
    Step 4/12 : ENV PATH /usr/src/app/node_modules/.bin:$PATH
    ---> Running in 6be3942d1d4a

If the container builds successfully, the output should end with something like this:

  Successfully built 1612d3ffdb32
  Successfully tagged containers-workshop-frontend:latest

>NOTE: For this build process, we are using the multi-stage build approach. This consists in using one container to generate you application and then copy the generated app to another image, in order to make it smaller. You can get more information about multi-stage builds in [this link](https://docs.docker.com/develop/develop-images/multistage-build/).

Now that you created your docker image, you can use the following command to run the *containers-workshop-frontend* container:

     $  docker run -d -p 8080:80 containers-workshop-frontend

To check if your container is running, use the following command:

     $ docker ps

This should return a list of all the currently running containers.  In this example,  it should just return a single container, the one that we just started:

    CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS                  NAMES
    1c0511ee397d        containers-workshop-frontend   "nginx -g 'daemon of…"   13 seconds ago      Up 12 seconds       0.0.0.0:8080->80/tcp   musing_leakey


To test the application, you can use the Cloud9 `Preview Running Application` feature. In Cloud9, click in `Preview` > `Preview Running Application`

![Preview Running Application](/02-CreatingFrontendDockerImage/images/preview_application.png)

If everything went fine, you should see your web application:

![Web Application](/02-CreatingFrontendDockerImage/images/web_application.png)



## 3. Creating the image repository with ECR

Before we can build and push our images, we need somewhere to push them to.  In this case, we're going to create just one repository in [ECR](https://aws.amazon.com/ecr/).

To create a repository, navigate to the [ECS console](https://console.aws.amazon.com/ecs/home?region=us-east-1), and select **Repositories**.  From there, click in the **Get Started**.

Name your first repository **containers-workshop-frontend**:

![create ecr repository](/02-CreatingFrontendDockerImage/images/creating_repository.png)

Once you've created the repository, it will display a list of commands that you will need to use to push your Docker images. These commands will be like this:

![push commands](/02-CreatingFrontendDockerImage/images/push_commands.png)

## 4. Pushing our tested images to ECR

Now that we've tested our images locally, we need to tag them again, and push them to ECR.  This will allow us to use them in `Task definitions` that can be deployed to an ECS cluster.  

You'll need your push commands that you saw during registry creation.  If you've misplaced your push commands, you can find them again by going back to the repository (**ECS Console** > **Repositories** > Select the repository you want to see the commands for > **View Push Commands**.

The first thing that we need to do, is authenticate our Docker client to the ECR. To do this, we need get the `docker login` command with the repository informations. To get this informations, run the following command:

    $ aws ecr get-login --no-include-email --region us-east-1

The output of this command is the `docker login` command that we wil need to run. It is going to be similar to:

    docker login -u AWS -p eyJwYXlsb2FkIjoiQXowb3lmSVNpa2dCeUF0UCt3UjRyN3JqZ2w0ZVFqbjMwQXBFY2szVkRQRUx6KzRMb3REUHhLTlowYk9ncWZYelhwclhXdW1vWm5GVzJPVi9LSDhaRlVsTUtxaGVPMWU2RzV6Njg2QlAraXVDSklPMXdZVTNpNTBLVkR2dnUyaVZ2SkRZUEdmM3BLR0IvSG9WQWFFZmJJVFRJNkZPODVOQWRvcEpHYnJhYmNGQXYvckVGQ0FLa1pkQ1k1NkNNTmcwNFlOek1lanpKLzQyUjZwMlV2ZjgxUVBaTm1ubWZYZE11VHA0MHQ2OGRJdDBuQi9acXZZVkN6MXVzSlJBVFUwK1A4UlNSOXlyL0N3T3lvQWlkUlFDdDlUc3Z1SHVwZGhOeHNkTHVNc1RRcDZvYS9obzFWVXhiN0RJYmhrcWEwdlVIREhtS2t0OTFpUnFGcFV5aVBhYk80eTVGaXlzOU15NkN5QlIzZlI4U2lOUDlmaW9tb2hvMklYYkdZeHpsYXNKK0FvTGFkU2xhYUFxRkRzeGpPaEJRL1ZlTWlNL2Z3bHhDYytuMUdrK29LT1lsZm5LTS9RdUdNcVdXTkJpN1VxUncyN3p4VjJCR3NPT05NaXVMemlQUlhyWXhucVpxTDh6b2JpN25KQy96UXFsRERqdExPTW9UMGdiSmo1bWloTXVqdm4vWWZYRDVqQnAxWTRSNW5YcCtwQ2Q4Z0NSQKSJFXlKT0hUZUJuM21VZFR0N2EzdmhxNWoyL0RtdFJxYVpPNUpSMm9GWjY5UmJYUUFUSStLMDBVZ1lMMFpZVHcycXorbGVZYlh0YzlxK2FTM3krSm53L2FNZVNiUGtoOWJuU01CZDQvSFcvemcxUElsRlhvOEZpTG1ZakppNEpRcHJIa2czemk0ektOOS9NL3pOaXVXSXp1a3Ezb05QZjMrUndZSmptdy9mbFd3OEJGLzJoejJJVXVhbENkWkYzdldRaUhRNEt3YjBYNVFidXdvZTVZOWwyNEJZcVBMdEh4V0xrUUFuS2NVUkEvVTNVSlpLaEVVZXlMV28vSFBYWmxUSK820WUVMU25hNTVUWTJqa0VCcXBhaTEyQTJyTGwwM0tjUjY1VzNyZU05RUVUMmswTmJhZVNWZmNkQ28rUE95dUxCSHJTS2RIVHozbzNuVzE2SlhtaTdOWlRSMlBjMkFCOEExQTNXN01zaGJGcjRqbUs1a1UySWI2cnRjeWcrU2g2Zm0xYWhpQlRueXJrbzlpZGhGanVWbU1GOHppL29jZ3JBTG80TjExOGlvejZwNkxSWmhdVMmdmUWI5UnFGRkXKSjJRVXdFcHBqWXhtSzRLQ0RwTWF4NVhGM1czT1c1MjM1ejV3emR1ZGxwclg5TWdGbmY2Q3ljdjA2YlFEa25LeVZVK2VOQXZqUkZlWndhZGJKeTZtMzdRYkI4MllNN25VVmREVmhtOXpKV0dEUlNQVWpGSzYrLCJkYXRha2V5IjoiQVFFQkFIaHdtMFlhSVNKZVJ0Sm01bjFHNnVxZWVrWHVvWFhQZTVVRmNlOVJxOC8xNHdBQUFINHdmQVlKS29aSWh2Y05BUWNHb0c4d2JRSUJBREJvQmdrcWhraUc5dzBCQndFd0hnWUpZSVpJQVdVREJBRXVNQkVFREtQbEE5b1VnVUpyY3JkOFFRSUJFSUE3MHJETXcwMFJUc0R4eDBCOEN2NXJTK25waW5iUEw4WG9UeUpubmxnbWhGTFkwcGo3WGg4ZEpxMHlkSXpNWGhYT2xxb2ZFUFU4UVk4UkZkRT0iLCJ2ZXJzaW9uIjoiMiIsInR5cGUiOiJEQVRBX0tFWSIsImV4cGlyYXRpb24iOjE1MjE4ODIxOTZ9 https://XXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com

To login to ECR, copy this output and execute it as a linux command. The output will be the following:

    WARNING! Using --password via the CLI is insecure. Use --password-stdin.
    Login Succeeded


>NOTE: If you are running it in a linux terminal, you can just run the command like this `$(aws ecr get-login --no-include-email)` which will tell your shell to execute the output of the first command.  

If you are unable to login to ECR, check your IAM user group permissions.

Now, let's tag our image locally and them push our image to the ECR repository. Use the following commands:

    $ docker tag containers-workshop-frontend:latest XXXXXXXXX.dkr.ecr.<aws-region>.amazonaws.com/containers-workshop-frontend:latest
    $ docker push XXXXXXXXX.dkr.ecr.<aws-region>.amazonaws.com/containers-workshop-frontend:latest

>NOTE: Remember to replace the `XXXXXXXXX` with your account ID and `<aws-region>` with your region information. This information will be presented to you in the ECR screen with the Docker push commands.

> Why `:latest`?  This is the actual image tag.  In most production environments, you'd tag images for different schemes:  for example, you might tag the most up-to-date image with `:latest`, and all other versions of the same container with a commit SHA from a CI job.  If you push an image without a specific tag, it will default to `:latest`, and untag the previous image with that tag.  For more information on Docker tags, see the Docker [documentation](https://docs.docker.com/engine/getstarted/step_six/).


This step will take some minutes. When the command finishes, you should see something like this:

    The push refers to a repository [XXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com/containers-workshop-frontend]
    9ef5219507db: Pushed
    b3d18e8f520f: Pushed
    a83b4d2ff3a0: Pushed
    2f5b0990636a: Pushed
    c9748fbf541d: Pushed
    b3968bc26fbd: Pushed
    aa4e47c45116: Pushed
    788ce2310e2f: Pushed
    latest: digest: sha256:38588bb240b57d123522ab3d23cec642907a99f1379445fbea27dafc58608 size: 1364


You can see your pushed images by viewing the repository in the AWS Console.  Alternatively, you can use the CLI:

    $ aws ecr list-images --repository-name=containers-workshop-frontend
    {
        "imageIds": [
            {
                "imageTag": "latest",
                "imageDigest": "sha256:858b195919d9fd98dbf9ac9a4e80d4f3452ff4499ac2a1927f903f"
            }
        ]
    }

<br>

[![back to menu](/images/back_to_menu.png)][back-to-menu]  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   [![continue workshop](/images/continue_workshop.png)][continue-workshop]

[back-to-menu]: https://github.com/bemer/containers-on-aws-workshop
[continue-workshop]: /03-DeployEcsCluster
