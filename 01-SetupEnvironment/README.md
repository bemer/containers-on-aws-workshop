# Setup Environments

This section describes the hardware and software needed for this workshop, and how to configure them. This workshop is designed for a BYOL (Brying Your Own Laptop) style hands-on-lab.

## Hardware & Software

- Memory: At least 4 GB+, strongly preferred 8 GB
- Operating System: Mac OS X (10.10.3+), Windows 10 Pro+ 64-bit, Ubuntu 12+, CentOS 7+.

> NOTE: An older version of the operating system may be used. The installation instructions would differ slightly in that case and are explained in the next section.

## Install Docker

Docker runs natively on Mac, Windows and Linux. This lab will use https://www.docker.com/community-edition [Docker Community Edition - CE](https://www.docker.com/community-edition). This documentation will cover the Docker CE install process in an EC2 instance running `Amazon Linux`. If you want to use it in your own desktop, please follow the sptes in the [Docker CE official downloads page](https://www.docker.com/community-edition#/download).

> NOTE: Docker CE requires a fairly recent operating system version. If your machine does not meet the requirements, then you need to install https://www.docker.com/products/docker-toolbox (Docker Toolbox).

### Installing Docker on an EC2 instance running Amazon Linux

After accessing your EC2 instance, you will need to install the Docker components in order to interact with the Docker daemon to create, run and push your images. On your instance, run the following commands:

    $ sudo yum update -y
    $ sudo yum install -y docker

This will install the Docker on your instance. Now, to check if your installation was successfully completed, run the following command:

    $ docker -v

It will output something like:

    Docker version 17.12.0-ce, build 3dfb8343b139d6342acfd9975d7f1068b5b1c3d3

Now, you need to start the Docker service. You can do this by running the command:

    $ sudo service docker start

The next step is add your linux user to the `docker` users group, so you will be able to run all the Docker commands without being root. Run the following command:

    $ sudo usermod -a -G docker $USER

After running this command, you will need to log out and log in again in your instance. When logging in again, run the following command to see if you are able to run a Docker container:

    $ docker run hello-world

It will output something like:

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

    For more examples and ideas, visit:
     https://docs.docker.com/engine/userguide/

If so, you are good to go.

## Install and configure AWS CLI

During this workshop we will interact with some AWS API's. Having the latest version of the AWS CLI in your computer is appropriated.

Instructions to install the AWS CLI are available here: http://docs.aws.amazon.com/cli/latest/userguide/installing.html

After installing the AWS CLI, please don't forget to configure it. You will find all the steps in this URL: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration

## Install git

Sometimes will be easier if you just clone this repo, instead of copying the files. Having the git installed is not a mandatory requisite, but it may help you.

Download and install here: https://git-scm.com/downloads
You can have more information about git here: https://git-scm.com/book/en/v1/Getting-Started

In order to clone this repository, you can use the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

After cloning the repository, you will see that a new folder called `containers-on-aws-workshop` will be created. All the content will be available inside this folder.
