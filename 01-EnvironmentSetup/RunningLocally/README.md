# Running the Workshop Locally

![environment setup](/01-EnvironmentSetup/images/environment_setup.png)

This section describes the hardware and software needed for this workshop, and how to configure them. This workshop is designed for a BYOL (Brying Your Own Laptop) style hands-on-lab.

**Quick jump:**

* [1. Running on your own computer](/01-EnvironmentSetup/RunningLocally#1-running-on-your-own-computer)
* [2. Hardware & Software](/01-EnvironmentSetup/RunningLocally#2-hardware--software)
* [3. Install Docker](01-EnvironmentSetup/RunningLocally#3-install-docker)
* [4. Install AWS CLI](01-EnvironmentSetup/RunningLocally#4-install-aws-cli)
* [5. Install git](01-EnvironmentSetup/RunningLocally#5-install-git)
* [6. Creating the VPC](01-EnvironmentSetup/RunningLocally#6-creating-the-vpc)
* [7. Cloning the workshop repository](01-EnvironmentSetup/RunningLocally#7-cloning-the-workshop-repository)
* [8. Setting up the IAM roles](01-EnvironmentSetup/RunningLocally#8-setting-up-the-iam-roles)
* [9. Configuring the AWS CLI](01-EnvironmentSetup/RunningLocally#9-configuring-the-aws-cli)


## 1. Running on your own computer

We strongly recommend you to run this workshop using the Cloud9 provided interface, but it is also possible to run this workshop using your own computer instead of Cloud9 environment.

The following steps are needed if you want to run this workshop in your own computer.

>NOTE: If you will be using the Cloud9 interface and have done the steps above, please go to the next chapter.

### 2. Hardware & Software

- Memory: At least 4 GB+, strongly preferred 8 GB
- Operating System: Mac OS X (10.10.3+), Windows 10 Pro+ 64-bit, Ubuntu 12+, CentOS 7+.

> NOTE: An older version of the operating system may be used. The installation instructions would differ slightly in that case and are explained in the next section.

### 3. Install Docker

Docker runs natively on Mac, Windows and Linux. This lab will use [Docker Community Edition - CE](https://www.docker.com/community-edition). This documentation will cover the Docker CE install process in an EC2 instance running `Amazon Linux`. If you want to use it in your own desktop, please follow the sptes in the [Docker CE official downloads page](https://www.docker.com/community-edition#/download).

> NOTE: Docker CE requires a fairly recent operating system version. If your machine does not meet the requirements, then you need to install https://www.docker.com/products/docker-toolbox (Docker Toolbox).

### 4. Install AWS CLI

During this workshop we will interact with some AWS API's. Having the latest version of the AWS CLI in your computer is appropriated.

Instructions to install the AWS CLI are available here: http://docs.aws.amazon.com/cli/latest/userguide/installing.html


### 4.1. Installing Docker on an EC2 instance running Amazon Linux

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


### 5. Install git

To better execute the workshop, you will need to clone this repository and having `git` installed is needed to perform this action.

Download and install here: https://git-scm.com/downloads
You can have more information about git here: https://git-scm.com/book/en/v1/Getting-Started



### 6. Creating the VPC

After completing the setup of your computer, you must create the VPC infrastrutcture in order to execute your containers. You can do this by using one of the templates below, according to the region you are using:

| Deploy | Region |
|:---:|:---:|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-east-1-without-cloud9] | US East (N. Virginia)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-east-2-without-cloud9] | US East (Ohio)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-west-2-without-cloud9] | US West (Oregon)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][eu-west-1-without-cloud9] | EU (Ireland)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][ap-southeast-1-without-cloud9] | Asia Pacific (Singapore)|


### 7. Cloning the workshop repository

In order to clone this repository, you can use the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

After cloning the repository, you will see that a new folder called `containers-on-aws-workshop` will be created. All the content will be available inside this folder.

<br>


## 8. Setting up the IAM roles

In order to work with the AWS CLI, you'll need an IAM role with the proper permissions set up.  To do this, we'll create both an IAM Group, and an IAM user.

To create the group, navigate to the [IAM console](https://console.aws.amazon.com/iam/home?region=us-east-1#/home), and select **Groups** > **Create New Group**.  Name the group "**containers-workshop-group**".  From the list of managed policies, add the following policies:

* AmazonEC2ContainerRegistryFullAccess
* AmazonEC2ContainerServiceFullAccess

This is how your group permissions should like after the creation:

![IAM group permissions](/02-CreatingDockerImage/images/iam_group_permissions.png)

Once you've created your group, you need to create a new user and attach this new user to this group. In order to do so, on the IAM console, click in **Users** on the left side of the screen, and them click in the button **Add user**.

The user name will be **containers-workshop-user**. Don't forget to select the **Programmatic access** and the **AWS Management Console access** in the `Access type` just like in the following picture:

![creating user](/02-CreatingDockerImage/images/creating_user.png)

Now, click in **Next: permissions** and in the **Add user to group** screen, select the group `containers-workshop-group` that we created before:

![add user to group](/02-CreatingDockerImage/images/add_user_to_group.png)

>NOTE: If you already have more groups created in your account, you can use the `Search` on the IAM console to find the group that you created before, just like in the picture.

Click in **Next: Review** and check if is everything fine with your user creation. The screen should be similar to this one:

![review user creation](/02-CreatingDockerImage/images/review_user_creation.png)

In this screen, click in **Create user**.

When the wizard finishes, make sure to download and save your access key and secret key.  You'll need them in the next step.

>NOTE: The Secret access key is presented only once, during the user creation. If you loose this information, you will need to create a new Access and Secret keys in order to authenticate with this user.

## 9. Configuring the AWS CLI

If you've never configured the AWS CLI, the easiest way is by running the command:

    $ aws configure

This should drop you into a setup wizard. In this wizard, complete each field with the informations generated in the user creation step:

    $ aws configure
    AWS Access Key ID [****************K2JA]:
    AWS Secret Access Key [****************Oqx+]:
    Default region name [us-east-1]:
    Default output format [json]:

If you already have a profile setup with the AWS CLI, you can also add a new profile to your credentials file. In order to add another profile, edit your credentials (usually located in *~/.aws/credentials*) and add a new profile called "**containers-workshop**". After adding this new profile, your credentials file will be like this:

    [default]
    aws_access_key_id = AKIABCDMYKEYEXAMPLE1
    aws_secret_access_key = CAFESECRETACCESSKEYEXAMPLE001

    [containers-workshop]
    aws_access_key_id = AKIABCDMYKEYEXAMPLE2
    aws_secret_access_key = CAFESECRETACCESSKEYEXAMPLE002


You can test that your IAM user has the correct permissions, and that your CLI is setup to connect to your AWS account by running the command to obtain an ECR authentication token.  This will allow us to pull the Docker image to our repository in the next step:

    $ aws ecr get-login --region YOUR_REGION_HERE --no-include-email

This should output something like:

    $ docker login -u AWS -p AQECAHhwm0YaISJeRtJm5n1G6uqeekXuoXXPe5UFce9Rq8/14wAAAy0wggMpBgkqhkiG9w0BBwagggMaM
    IIDFgIBADCCAw8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM+76slnFaYrrZwLJyAgEQgIIC4LJKIDmvEDtJyr7jO661//6sX6cb2je
    D/RP0IA03wh62YxFKqwRMk8gjOAc89ICxlNxQ6+cvwjewi+8/W+9xbv5+PPWfwGSAXQJSHx3IWfrbca4WSLXQf2BDq0CTtDc0+payiDdsX
    dR8gzvyM7YWIcKzgcRVjkcjfLJpXemQ9liPWe4HKp+D57zCcBvgUk131xCiwPzbmGTZ+xtE1GPK0tgNH3t9N5+XA2BYYhXQzkTGISVGGL6
    Wo1tiERz+WA2aRKE+Sb+FQ7YDDRDtOGj4MwZakdMnOZDcwu3uUfrURXdJVddTEdS3jfo3d7yVWhmXPet+3qwkISstIxG+V6IIzQyhtq3BX
    W/I7pwZB9ln/mDNlJVRh9Ps2jqoXUXg/j/shZxBPm33LV+MvUqiEBhkXa9cz3AaqIpc2gXyXYN3xgJUV7OupLVq2wrGQZWPVoBvHPwrt/D
    KsNs28oJ67L4kTiRoufye1KjZQAi3FIPtMLcUGjFf+ytxzEPuTvUk4Xfoc4A29qp9v2j98090Qx0CHD4ZKyj7bIL53jSpeeFDh9EXubeqp
    XQTXdMzBZoBcC1Y99Kk4/nKprty2IeBvxPg+NRzg+1e0lkkqUu31oZ/AgdUcD8Db3qFjhXz4QhIZMGFogiJcmo=
    https://XXXXXXXXX.dkr.ecr.us-east-1.amazonaws.com


> The '-e' option has been deprecated in the `docker login` command and was removed in docker version 17.06 and later. You must specify --no-include-email if you're using docker version 17.06 or later. The default behavior is to include the '-e' flag in the 'docker login' output.

>NOTE: If you already had the credentials file and just added a new profile in it, don't forget to use the `--profile container-workshop` in the end of the command. This is needed because every time that you run a command using the awscli, it is going to use the `default` profile, so if we want to use a different one, we need to specify when running the command.


[![back to menu](/images/back_to_menu.png)][back-to-menu]  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   [![continue workshop](/images/continue_workshop.png)][continue-workshop]




[back-to-menu]: https://github.com/bemer/containers-on-aws-workshop
[continue-workshop]: /02-CreatingFrontendDockerImage

[us-east-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[us-east-2-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[us-west-2-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[eu-west-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
[ap-southeast-1-without-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-without-cloud9.yaml
