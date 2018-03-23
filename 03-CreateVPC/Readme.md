# The VPC Structure

For this workshop, we are going to use a VPC with public and private subnets. All EC2 instances and Fargate tasks should run on private subnets. All Load Balancers should run on public subnets.

> NOTE: If you are running this workshop on a large group of people, you can optionally create just one VPC for the entire workshop, instead of one VPC per workshop participant. This is just to prevent you hitting VPC limits for the AWS account.

![VPC structure](https://github.com/bemer/containers-on-aws-workshop/blob/master/03-CreateVPC/images/containers-on-aws-workshop-vpc.png)

# VPC Setup

* \1. Before starting the VPC setup, we must allocate an Elastic IP for your account in the region. Further in this wizard we will attach this Elastic IP into a NAT Gateway.

* 2. Go to the [Elastic IPs Console](https://console.aws.amazon.com/vpc/home?region=us-east-1#Addresses:) in N. Virginia region.

* 3. Click in **Allocate new address** and then confirm it by clickin in **Allocate**. Take note of your newly allocated Elastic IP.

* 4. Go to the [VPC Console](https://console.aws.amazon.com/vpc/home?region=us-east-1#) in N. Virignia region and click **Start VPC Wizard**.

* 5. At *Step 1: Select a VPC Configuration* screen, on the left side, choose **VPC with Public and Private Subnets** and then click in **Select**.

![VPC structure](https://github.com/bemer/containers-on-aws-workshop/blob/master/03-CreateVPC/images/containers-on-aws-workshop-vpc-1.png)

* 4. You can leave everything with the default configurations. The only fields that you must edit are *VPC name*, where you choose a name like containers-workshop and *Elastic IP Allocation ID*, where you must select your newly allocated Elastic IP. After that, click in **Create**.

![VPC wizard](https://github.com/bemer/containers-on-aws-workshop/blob/master/03-CreateVPC/images/containers-on-aws-workshop-vpc-2.png)