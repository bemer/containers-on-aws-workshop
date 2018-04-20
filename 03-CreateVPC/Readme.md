# The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> NOTE: If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting some VPC limits for your AWS account, like number of VPCs per region and number of Elastic IPs per region.

![VPC structure](https://github.com/bemer/containers-on-aws-workshop/blob/master/03-CreateVPC/images/containers-on-aws-workshop-vpc.png)

# VPC Setup

1. To make things easier, we will deploy our VPC using CloudFormation. In the [Management Console](https://console.aws.amazon.com/console/home?region=us-east-1#), in the search field, type `CloudFormation` and select **CloudFormation**;

2. Select `Specify an Amazon S3 template URL`;

3. Insert the following URL on the field: `https://s3.us-east-2.amazonaws.com/containers-on-aws-workshop-vpc-template/vpc_pub_priv.yaml`;

4. Click **Next**;

5. For *Stack name*, type a name like `MyWorkshopVPC`. For *EnvironmentName*, type a name like MyVPC. For everything else leave with the default values. Click **Next**;

6. Leave everything as the default values and click **Next**;

7. Click **Create**;