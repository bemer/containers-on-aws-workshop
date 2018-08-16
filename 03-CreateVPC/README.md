# The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> NOTE: If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting some VPC limits for your AWS account, like number of VPCs per region and number of Elastic IPs per region.

![VPC structure](/03-CreateVPC/images/containers-on-aws-workshop-vpc.png)

# VPC Setup

1. To make things easier, we will deploy our VPC using CloudFormation. In the [Management Console](https://console.aws.amazon.com/console/home?region=us-east-1#), in the search field, type `CloudFormation` and select **CloudFormation**;

2. Click **Create Stack**;

3. Select `Specify an Amazon S3 template URL`;

4. Insert the following URL on the field:

`https://s3.amazonaws.com/containers-on-aws-workshop-vpc/vpc_pub_priv.yaml`;

5. Click **Next**;

6. For *Stack name*, use the name `containers-workshop-insfrastructure`. For everything else leave with the default values. Click **Next**;

7. Leave everything as the default values and click **Next**;

8. Click **Create**;

9. Wait for the **Status** to be *CREATE_COMPLETE*. This process may take 5 to 10 minutes to be completed;

10. Click in the **Outputs** tab and take note of all the values in the **Value** colunm. If you are using the template that provisions a Cloud9 instance, you will have the `Cloud9URL` option. You can click in this URL to access your Cloud9 instance:

![CloudFormation Output](/03-CreateVPC/images/cloudformation_output.png)

## 3. Understanding the Cloud9 Interface

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. During this workshop, we will be using Cloud9 to interact with the application code and Docker containers. Since Cloud9 has everything that we need to run the workshop, let's now take a moment to understand where we will be running our commands and executing the steps.

This is the main interface presented by Cloud9 and the first thing you will see when clicking in the CloudFormation output URL:

![Cloud9 Main Screen](/03-CreateVPC/images/cloud9_main_screen.png)

All the commands presented in the workshop, such as `docker build`, `aws ecr get-login` and so on, should be executed in the terminal window:

![Cloud9 Terminal](/03-CreateVPC/images/cloud9_terminal.png)

>NOTE: You can arrange the size of the windows inside the Cloud9 interface.

On the left side of the screen, you will have a list of all files:

![Cloud9 Files](/03-CreateVPC/images/cloud9_files.png)

On the top window, you have a text editor, where you can make all the changes in the files. If you just click twice in any file on the *files** menu, you will be able to edit it:

![Cloud9 Editor](/03-CreateVPC/images/cloud9_editor.png)
