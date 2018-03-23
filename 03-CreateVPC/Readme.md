# The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting VPC limits for the AWS account.

![VPC structure](https://github.com/bemer/containers-on-aws-workshop/blob/master/03-CreateVPC/images/containers-on-aws-workshop-vpc.png)

# VPC Setup

Go to the [VPC Console](https://console.aws.amazon.com/vpc/home?region=us-east-1#) in N. Virignia region and click *Start VPC Wizard*.

> NOTE: An older version of the operating system may be used. The installation instructions would differ slightly in that case and are explained in the next section.