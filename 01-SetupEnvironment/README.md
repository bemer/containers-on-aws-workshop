# Setup Environments

This section describes the hardware and software needed for this workshop, and how to configure them. This workshop is designed for a BYOL (Brying Your Own Laptop) style hands-on-lab.

**Quick jump:**

* [1. First Notes](/01-SetupEnvironment#1-first-notes)
* [2. The VPC Structure](/01-SetupEnvironment#2-the-vpc-structure)
* [3. Infrastructure Setup (with Cloud9)](/01-SetupEnvironment#3-infrastructure-setup-with-cloud9)
* [4. Understanding the Cloud9 Interface](/01-SetupEnvironment#4-understanding-the-cloud9-interface)
* [5. Cloning the workshop repository](/01-SetupEnvironment#5-cloning-the-workshop-repository)
* [6. Running on your own computer](/01-SetupEnvironment#6-running-on-your-own-computer)


## 1. First Notes

This workshop can be executed both on a Cloud9 environment or in your own computer. Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. This environment already comes with Git, Docker, AWS CLI and all the necessary tools that you'll need to run this lab.

If you still want to run this lab using your own computer instead of using the Cloud9 interface, jump to the step [6. Running on your own computer](/01-SetupEnvironment#6-running-on-your-own-computer), otherwise, continue with the following steps.


## 2. The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> NOTE: If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting some VPC limits for your AWS account, like number of VPCs per region and number of Elastic IPs per region.

![VPC structure](/01-SetupEnvironment/images/containers-on-aws-workshop-vpc.png)

## 3. Infrastructure Setup (with Cloud9)

In order to deploy the infrastructure to your account, you can use one of the following links according to the region you with to use. These are the regions that currently support Fargate and Clou9.

Deploy | Region |
:---: |

[🚀][us-east-1-with-cloud9] | US East (N. Virginia)

[🚀][us-east-2-with-cloud9] | US East (Ohio)

[🚀][us-west-2-with-cloud9] | US West (Oregon)

[🚀][eu-west-1-with-cloud9] | EU (Ireland)

[🚀][ap-southeast-1-with-cloud9] | Asia Pacific (Singapore)

In the ClouFormation screen, add you name under the resource naming. This is going to add your name in front of the names to all the resources created, so in case you are running the workshop with someone else in the same account, you will be able to know your resources.

The the status of the stack be changed to `CREATE_COMPLETE`, click in the **Outputs** tab and take note of all the values in the **Value** colunm. If you are using the template that provisions a Cloud9 instance, you will have the `Cloud9URL` option. You can click in this URL to access your Cloud9 instance:

![CloudFormation Output](/01-SetupEnvironment/images/cloudformation_output.png)

## 4. Understanding the Cloud9 Interface

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. During this workshop, we will be using Cloud9 to interact with the application code and Docker containers. Since Cloud9 has everything that we need to run the workshop, let's now take a moment to understand where we will be running our commands and executing the steps.

This is the main interface presented by Cloud9 and the first thing you will see when clicking in the CloudFormation output URL:

![Cloud9 Main Screen](/01-SetupEnvironment/images/cloud9_main_screen.png)

All the commands presented in the workshop, such as `docker build`, `aws ecr get-login` and so on, should be executed in the terminal window:

![Cloud9 Terminal](/01-SetupEnvironment/images/cloud9_terminal.png)

>NOTE: You can arrange the size of the windows inside the Cloud9 interface.

On the left side of the screen, you will have a list of all files:

![Cloud9 Files](/01-SetupEnvironment/images/cloud9_files.png)

On the top window, you have a text editor, where you can make all the changes in the files. If you just click twice in any file on the *files** menu, you will be able to edit it:

![Cloud9 Editor](/01-SetupEnvironment/images/cloud9_editor.png)

## 5. Cloning the workshop repository

In order to clone this repository, you can use the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

After cloning the repository, you will see that a new folder called `containers-on-aws-workshop` will be created. All the content will be available inside this folder.



## 6. Running on your own computer

We strongly recommend you to run this workshop using the Cloud9 provided interface, but it is also possible to run this workshop using your own computer instead of Cloud9 environment.

The following steps are needed if you want to run this workshop in your own computer.

>NOTE: If you will be using the Cloud9 interface and have done the steps above, please go to the next chapter.

### 6.1 Hardware & Software

- Memory: At least 4 GB+, strongly preferred 8 GB
- Operating System: Mac OS X (10.10.3+), Windows 10 Pro+ 64-bit, Ubuntu 12+, CentOS 7+.

> NOTE: An older version of the operating system may be used. The installation instructions would differ slightly in that case and are explained in the next section.

### 6.2 Install Docker

Docker runs natively on Mac, Windows and Linux. This lab will use [Docker Community Edition - CE](https://www.docker.com/community-edition). This documentation will cover the Docker CE install process in an EC2 instance running `Amazon Linux`. If you want to use it in your own desktop, please follow the sptes in the [Docker CE official downloads page](https://www.docker.com/community-edition#/download).

> NOTE: Docker CE requires a fairly recent operating system version. If your machine does not meet the requirements, then you need to install https://www.docker.com/products/docker-toolbox (Docker Toolbox).

### 6.3 Install AWS CLI

During this workshop we will interact with some AWS API's. Having the latest version of the AWS CLI in your computer is appropriated.

Instructions to install the AWS CLI are available here: http://docs.aws.amazon.com/cli/latest/userguide/installing.html


### 6.4 Install git

To better execute the workshop, you will need to clone this repository and having `git` installed is needed to perform this action.

Download and install here: https://git-scm.com/downloads
You can have more information about git here: https://git-scm.com/book/en/v1/Getting-Started


### 6.5 Installing Docker on an EC2 instance running Amazon Linux

If you don't want to use a Cloud9 environment and don't have a Linux computer, you can also use an EC2 instance to run the steps in this workshop.

After launching and accessing your EC2 instance, you will need to install the Docker components in order to interact with the Docker daemon to create, run and push your images. On your EC2 instance, run the following commands:

    $ sudo yum update -y
    $ sudo yum install -y docker

This will install the Docker on your instance. Now, to check if your installation was successfully completed, run the following command:

    $ docker -v

The output should look like:

    Docker version 17.12.0-ce, build 3dfb8343b139d6342acfd9975d7f1068b5b1c3d3

Now, you need to start the Docker service. You can do this by running the command:

    $ sudo service docker start

The next step is add your linux user to the `docker` users group, so you will be able to run all the Docker commands without being root. Run the following command:

    $ sudo usermod -a -G docker $USER

After running this command, you will need to log out and log in again in your instance. When logging in again, run the following command to see if you are able to run a Docker container:

    $ docker run hello-world

The output should look like:

    Hello from Docker!
    This message shows that your installation appears to be working correctly.

    To generate this message, Docker took the following steps:
     1. The Docker client contacted the Docker daemon.
     2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
        (amd64)
     3. The Docker daemon created a new container from that image which runs the
        executable that produces the output you are currently reading.
     4. The Docker daemon streamed that output to the Docker client, which sent it
        to your terminal.

    To try something more ambitious, you can run an Ubuntu container with:
     $ docker run -it ubuntu bash

    Share images, automate workflows, and more with a free Docker ID:
     https://cloud.docker.com/

    For more examples and ideas, visit:mM
     https://docs.docker.com/engine/userguide/

### 6.6 Creating the VPC

After completing the setup of your computer, you must create the VPC infrastrutcture in order to execute your containers. You can do this by using one of the templates below, according to the region you are using:

Deploy | Region |
:---: |
[🚀][us-east-1-without-cloud9] | US East (N. Virginia)
[🚀][us-east-2-without-cloud9] | US East (Ohio)
[🚀][us-west-2-without-cloud9] | US West (Oregon)
[🚀][eu-west-1-without-cloud9] | EU (Ireland)
[🚀][ap-southeast-1-without-cloud9] | Asia Pacific (Singapore)


### 6.7 Cloning the workshop repository

In order to clone this repository, you can use the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

After cloning the repository, you will see that a new folder called `containers-on-aws-workshop` will be created. All the content will be available inside this folder.


[us-east-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[us-east-2-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[us-west-2-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[eu-west-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[ap-southeast-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[us-east-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[us-east-2-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[us-west-2-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[eu-west-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[ap-southeast-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
