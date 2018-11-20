# Environment Setup

![environment setup](/01-EnvironmentSetup/images/environment_setup.png)

This section describes the hardware and software needed for this workshop, and how to configure them. This workshop is designed for a BYOL (Brying Your Own Laptop) style hands-on-lab.


**Quick jump:**

* [1. First Notes](/01-EnvironmentSetup#1-first-notes)
* [2. The VPC Structure](/01-EnvironmentSetup#2-the-vpc-structure)

## 1. First Notes

This workshop can be executed both on a Cloud9 environment or in your own computer. Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. This environment already comes with Git, Docker, AWS CLI and all the necessary tools that you'll need to run this lab.

If you want, you can also run this lab using your own computer instead of using the Cloud9 interface. To do so, you will need to configure your computer installing a few programs and configuring it. All of these configuration steps will be provided.


## 2. The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> NOTE: If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting some VPC limits for your AWS account, like number of VPCs per region and number of Elastic IPs per region.

![VPC structure](/01-EnvironmentSetup/images/containers-on-aws-workshop-vpc.png)
