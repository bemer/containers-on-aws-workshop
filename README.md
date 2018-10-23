![workshop logo](https://github.com/bemer/containers-on-aws-workshop/blob/master/images/containers-on-aws-worshop-logo.jpg)

# Welcome to the Containers On AWS Workshop

Hello and welcome to the Containers On AWS Workshop! Please, read the instructions bellow carefully.

## 1. It's all about containers!

We will walk you through the very basics of containers: from installing and configuring Docker, running containers locally, deploying them on AWS container services like Elastic Container Services (ECS), till implementing a Continuous Delivery pipeline for your container and help you configure Auto Scaling for your containerized app.

## 2. If you are using a Windows machine

We strongly recommend you spinning up a Cloud9 enviroment. Optionally, you can spin up an EC2 instance with Amazon Linux.

If you choose Cloud9, all you have to do is jump to [01-SetupEnvironment](https://github.com/bemer/containers-on-aws-workshop/tree/master/01-SetupEnvironment).

If you want to run on a EC2 instance, the following links will guide you through the instance creation process and how to access it:

* [Creating a Linux EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)
* [Accessing a Linux EC2 instance from a Windows machine](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

## 3. We strongly recommend you running this workshop in the following order:

* [1. Setup Environments](/01-SetupEnvironment)
* [2. Creating Your Docker Image](/02-CreatingDockerImage)
* [3. Deploying An ECS Cluster](/03-DeployEcsCluster)
* [4. Deploying An Application with AWS Fargate](/04-DeployFargate)
* [5. Creating a Continuous Delivery Pipeline with Code services and Amazon ECS](/05-ContinuousDelivery)
* [6. Configuring Service Auto Scaling on Amazon ECS](/06-AutoScaling)

## 4. Enough of jibber jabber...

You can start the Containers on AWS workshop by clicking in the following link:

[![start workshop](/images/start_workshop.png)][start_workshop]

[start_workshop]: /01-SetupEnvironment
