![workshop logo](https://github.com/bemer/containers-on-aws-workshop/blob/master/images/containers-on-aws-worshop-logo.jpg)

# Welcome to the Containers On AWS Workshop

Hello and welcome to the Containers On AWS Workshop! Please, read the instructions bellow carefully.

## 1) It's all about containers!

We will walk you through the very basics of containers: from installing and configuring Docker in your own machine, running containers locally, till finally deploying them on AWS container services like Elastic Container Services (ECS).

## 2) If you are using a Windows machine

We are working on a content for running this workshop using a Windows machine. Meanwhile, please, we strongly recommend you spinning up an EC2 instance running Amazon Linux. The following links will guide you through the instance creation process and how to access it:

* [Creating a Linux EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)
* [Accessing a Linux EC2 instance from a Windows machine](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html)

## 3) We strongly recommend you running this workshop in the following order:

* [1. Setup Environments](https://github.com/bemer/containers-on-aws-workshop/tree/master/01-SetupEnvironment)

* [2. Creating Your Docker Image](https://github.com/bemer/containers-on-aws-workshop/tree/master/02-CreatingDockerImage)

* [3. Creating A VPC for the Workshop](https://github.com/bemer/containers-on-aws-workshop/tree/master/03-CreateVPC)

* [4. Running An ECS Cluster](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster)

* [5. Deploying An Application with AWS Fargate](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate)