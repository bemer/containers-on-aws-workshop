# Deploying an application with AWS Fargate

![aws fargate logo](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/aws_fargate_logo.png)


**Quick jump:**

* [1. Tutorial overview](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#1-tutorial-overview)
* [2. Provisioning the infrastructure](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#2-provisioning-the-infrastructure)
* [3. Building the Docker images](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#3-building-the-docker-images)
* [4. Pushing the images to ECR](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#4-pushing-the-images-to-ecr)
* [5. Creating the Cluster](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#5-creating-the-cluster)
* [6. Creating the Task Definition](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#6-creating-the-task-definition)
* [7. Deploying the application](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#7-deploying-the-application)
* [8. Acessing the application](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#8-acessing-the-application)
* [9. Conclusion](https://github.com/bemer/lts-workshop/tree/master/04-DeployFargate#9-conclusion)


## 1. Tutorial overview

This tutorial will walk you through a web application deployment using AWS Fargate. The application is called Scorekeep, which is a RESTful web API. It's written in Java and uses Spring to provide a HTTP interface for creation, users and game sessions management. It consists in two parts: the Scorekeep API and a front-end web app that consumes it.

> We are not the owners of this application. If you want to get more information about it, you can see the original repository at: https://github.com/awslabs/eb-java-scorekeep/.

After concluding this tutorial, you will have a serverless application running in AWS Fargate.

## 2. Provisioning the infrastructure

The **Scorekeep** application primarily interacts with two AWS services: Amazon DynamoDB and Amazon SNS. Basically a few DynamoDB tables and single SNS Topic. Since the goal of this tutorial is to walk you through AWS Fargate, we have a CloudFormation template that will provision all the DynamoDB tables and the SNS topic in your account.

In the project folder, go to the `cloudformation` directory and run the following command to start a deployment of a new CloudFormation stack in your account:

    aws cloudformation create-stack              \
        --stack-name lts-scorekeep               \
        --template-body file://cf-resources.yaml \
        --capabilities "CAPABILITY_NAMED_IAM"    \
        --region us-east-1

You can check the lts-scorekeep status in the CloudFormation service screen:

![cloudformation provisioning](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/cloudformation_creation.png)

After the stack status changes to CREATE_COMPLETE, you should have: 5 DynamoDB tables (game, move, session, state and user), a CloudWatch LogGroup and a SNS topic created.

We still need to create a new IAM Policy and apply it to a new IAM Role. This role will allow the Fargate Task (and all containers in it) to interact with the DynamoDB service.

Go to the IAM console, select **Policies** and click in **Create policy**. Select **JSON** and add the following Policy document (remember to replace your account ID):

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "SNSRole",
                "Effect": "Allow",
                "Action": "SNS:*",
                "Resource": "arn:aws:sns:us-east-1:996278879643:scorekeep-notifications"
            },
            {
                "Sid": "DynamoDbRole",
                "Effect": "Allow",
                "Action": "dynamodb:*",
                "Resource": [
                    "arn:aws:dynamodb:us-east-1:996278879643:table/scorekeep-game*",
                    "arn:aws:dynamodb:us-east-1:996278879643:table/scorekeep-move*",
                    "arn:aws:dynamodb:us-east-1:996278879643:table/scorekeep-session*",
                    "arn:aws:dynamodb:us-east-1:996278879643:table/scorekeep-state*",
                    "arn:aws:dynamodb:us-east-1:996278879643:table/scorekeep-user*"
                ]
            }
        ]
    }

![create taks policy](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_policy_creation.png)


Click in **Review policy**, name your policy `lts-scorekeep-policy` and click in **Create policy**:

![finish policy creation ](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/finish_policy_creation.png)

Now, go to the IAM console, select **Roles** in the left corner of the page and click in **Create role**. In this screen, select **EC2 Container Service** and under **use case** select **EC2 Container Service Task** and click in **Next: Permissions**:

![create taks role](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_role_creation.png)

In the permissions screen, select the recently created `lts-scorekeep-policy` and click in **Next: Review**

![associate role policy](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/associate_role_policy.png)

Name your Role `lts-scorekeep-role` and click in **Create role**:

![role creation](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/role_creation.png)



## 3. Building the Docker images

Now that we have the infrastructure, let's create the Scorekeep Docker images. As mentioned earlier, this application has a frontend and an API (backend). Each one of these will run at a separated container, therefore, we will create 2 containers. Let's start with the API container.

Go to the `scorekeep-api` folder and run the following command to build your image:

    docker build -t scorekeep-api .

Take a minute to look at the `Dockerfile` used to build this image. Note that it is using a base image called `openjdk:alpine`. The `alpine linux` is a minimal Docker image based on Alpine Linux with a complete package index and only 5 MB in size.

Right after, we are adding the `scorekeep-api-1.0.0.jar` to our container. The source code of this file is available under the original repository, but we already builded it for your convenience.

We are then setting a few environment variables, exposing the port 5000 and informing the entrypoint for this container.

Let's now create our frontend image. Go to the `scorekeep-frontend` directory and run the following command:

    docker build -t scorekeep-frontend .

After the image is built, you can test locally. In order to execute this test, use the following command:

    docker run -p 80:8080 scorekeep-frontend

Then, using your browser, access the url http://localhost. You will see the scorekeep frontend interface:

![scorekeep front local](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/scorekeep-frontend-local.png)


## 4. Pushing the images to ECR

After creating your images, go to the ECS console, under **Repositories**, and create a new repository called `scorekeep-api`:

![scorekeep api repository](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/scorekeep-api-repository.png)

Use the `aws-ecr` api call to get your repository credentials and execute your authentication, running the command (don't forget the apostrophes):

    `aws ecr get-login --no-include-email --region us-east-1`

You should get the following result:

    WARNING! Using --password via the CLI is insecure. Use --password-stdin.
    Login Succeeded

Now that your repository is created, tag your Docker image using the command:

    docker tag scorekeep-api:latest <account_id>.dkr.ecr.us-east-1.amazonaws.com/scorekeep-api:latest

And then push your image using the command:

    docker push <account_id>.dkr.ecr.us-east-1.amazonaws.com/scorekeep-api:latest

This will start uploading your image to ECR. You should see something similar to this in your terminal:

    $ docker push 996278879643.dkr.ecr.us-east-1.amazonaws.com/scorekeep-api:latest
    The push refers to a repository [996278879643.dkr.ecr.us-east-1.amazonaws.com/scorekeep-api]
    4e2b459f47ea: Pushing [==============================>                    ]  12.62MB/20.91MB
    69cc5717c281: Pushing [==========>                                        ]  20.35MB/97.4MB
    5b1e27e74327: Pushed
    04a094fe844e: Pushed

When completed, it should look similar to this:

    The push refers to a repository [996278879643.dkr.ecr.us-east-1.amazonaws.com/scorekeep-api]
    4e2b459f47ea: Pushed
    69cc5717c281: Pushed
    5b1e27e74327: Pushed
    04a094fe844e: Pushed
    latest: digest: sha256:9caa0d1508ea59ed1e13eb52ea90fd988c1dd5e0fec46ebda34c4eddc3679120 size: 1159

Now, follow these same steps to your `scorekeep-frontend` image, creating a new repository `scorekeep-frontend`, tagging it as `scorekeep-frontend:latest` and uploading the image with `/scorekeep-frontend:latest` at the end of the ECR repository URL.

## 5. Creating the Cluster

Let's create a new cluster to deploy our containers. In your AWS account dashboard, navigate to the [ECS console](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters).

Click in the button **Create cluster** and in the following screen select the **Networking only (Powered by AWS Fargate)** cluster template:

![cluster template](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/cluster_template.png)

In the **Cluster configuration** screen, add the name `lts-scorekeep-app` and click in create:

![cluster configuration](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/cluster_configuration.png)

## 6. Creating the Task Definition


To create a Task Definition, choose **Task Definitions** at left side of the ECS console menu. Choose **Create new Task Definition**. Select `FARGATE` as the *Launch type compatibility*:

![type compatibility](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_compatibility.png)

Click in **Next Step** and name your task **lts-scorekeep-app**. In the **Task Role**, select the `lts-scorekeep-role` role that we created before and in the **Task execution role** select `ecsTaskExecutionRole`:

![task configuration](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_configuration.png)

In **Task size** select `2GB` for **Task memory (GB)** and `1vCPU` for **Task CPU (vCPU)** and click in the **Add container** button:

![task size](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_size.png)

Let's first add our API container. In **Container name** insert `scorekeep-api` and add the URL for the scorekeep-api from your ECR registry with the tag `latest`. Set the memory **Soft limit** to `512` and `5000` for the **Port mappings**:

![scorekeep-api standard configurations](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/api_standard_configurations.png)

Under **Advanced container configuration** add `768` for **CPU Units** and create a new environment variable called `NOTIFICATION_TOPIC` where the value must be the ARN of the SNS Topic created by the CloudFormation template:

![scorekeep-api advanced configurations](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/api_advanced_configurations.png)

We still need to add the frontend container to this task. Click again in **Add container** to add the scorekeep-frontend container.

In **Container name** insert `scorekeep-frontend`, in **Image** paste the URL of your scorekeep-frontend ECR respoitory with the tag `:latest` and set `512` for **Soft limit**. This container exposes the port `8080`, so add it to the **Port mappings** field. Under **Advanced container configuration** add `256` for **CPU Units** and click in **Add**:

![scorekeep-frontend configurations](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/frontend_configurations.png)

After adding both containers, click in **Create**:

![creating task](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/creating_task.png)

## 7. Deploying the application

In the ECS console, click in **Clusters** and them click in the **lts-scorekeep-app** cluster that we created earlier. Under the **Services** tab, click in **Create**:

![service create](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/service_create.png)

Select **FARGATE** as the **Launch type** and select the **Task definition** `lts-scorekeep-app:1` that we just created. Under **Platform version** select `LATEST`. Note that the cluster `lts-scorekeep-app` will be automatically selected under **Cluster**. Don't change it. Add `lts-scorekeep-app` in **Service name** and set the number of tasks to `1`, then click in **Next step**:

![configure service](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/configure_service.png)

Select the VPC where you want to run your containers and the public subnets that you want to use. Click in **Edit** to edit your security group rules and select `ENABLED` for Auto-assign public IP::

![configure network](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/configure_network.png)

Change the type of the rule to `Custom TCP` and add `8080` in **Port range**. This is because the frontend container is going to expose the port 8080 instead of 80. Click in **Save**:

![configure security group](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/configure_security_group.png)

In the **Set Auto Scaling (optional)** screen, just click in **Next step** and finally, click in **Create service** on the **Review** screen:

![service review](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/service_review.png)

## 8. Acessing the application

After creating your service, an ENI will be provisioned. Usually this step takes about 30s to 1min to be completed. Click in Service and then click in the task. If everything goes as planned, you should see both of your containers with status as Provisioning, then it should change to Pending till finally reach the Running status. When finished, you will be able to see the number of running tasks in the `lts-scorekeep-app` Cluster screen:

![running tasks](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/running_tasks.png)

Click in **Tasks** and them click in the Task ID. You will be redirected to a screen that shows all the infomation about your running task:

![task information](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/task_information.png)

In this screen, click in the **ENI Id**. You will be redirected to the ENI screen. Here, get the **IPv4 Public IP**. This is the IP Address of your application:

![eni information](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/eni_information.png)

Open a Firefox browser and access http://YOURPUBLICIP:8080. You should be able to access and interact with your application:

![application access](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/application_access.png)

> This application was tested in Firefox and Google Chrome browsers. Unfortunately, at this moment, we were able to make it work only for Firefox. CORS issues!

Click in **Create** and then give a name to your game. Select **Tic Tac Toe** under **Rules** and then click in **Create**. A new button **Play** button will appear. Click in it and enjoy your game:

![game creation](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/game_creation.png)

After starting your game and making a few movements in it, you should be able to see some information your DynamoDB tables.

![gameplay](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/gameplay.png)

![dynamodb items](https://github.com/bemer/lts-workshop/blob/master/04-DeployFargate/images/dynamodb_items.png)

## 9. Conclusion

This is it! You have successfully deployed an application with AWS Fargate and Docker containers completelty infrastructureless.

Now, take a moment to spend some time navigating in the AWS Fargate. Here is a list of a few thing that you can try:

* Finding the container logs;
* Deploying a new version of this application;
* Adding an Application Load-Balancer to your task definition;
* Deploying other containers using AWS Fargate (you can use the container you created on the previous tutorial).
