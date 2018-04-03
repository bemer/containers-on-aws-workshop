# Deploying an application with AWS Fargate

![aws fargate logo](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/aws_fargate_logo.png)


**Quick jump:**

* [1. Tutorial overview](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#1-tutorial-overview)
* [2. Creating the Cluster](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#5-creating-the-cluster)
* [3. Creating the Task Definition](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#6-creating-the-task-definition)
* [4. Deploying the application](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#7-deploying-the-application)
* [5. Acessing the application](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#8-acessing-the-application)
* [6. Conclusion](https://github.com/bemer/containers-on-aws-workshop/tree/master/05-DeployFargate#9-conclusion)


## 1. Tutorial overview

This tutorial will walk you through a web application deployment using AWS Fargate. This is the same application that we used for the ECS Cluster with EC2. This means that we won't need to create and build another Docker image. We will also use the same image and ECR respoitory.

After concluding this tutorial, you will have a serverless application running in AWS Fargate.

## 2. Creating the Cluster

We will create a new cluster just for the Fargate tasks, however, a single ECS cluster supports both EC2 and Fargate tasks.

Let's create a new cluster to deploy our containers. In your AWS account dashboard, navigate to the [ECS Console](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters).

Click in **Create cluster** and in the following screen select the **Networking only** cluster template. Click in **Next step**:

![cluster template](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/cluster_template.png)

For the *Cluster name* type a name for your cluster and click in **Create**:

![cluster configuration](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/cluster_configuration.png)

## 3. Creating the Task Definition

To create a Task Definition, at the left side of the ECS Console menu, click in **Task Definitions**. Clinck in **Create new Task Definition**. Select `FARGATE` as the *Launch type compatibility* and click in **Next steps**:

![type compatibility](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/task_compatibility.png)

For *Task Definition Name* type a name for your task. For *Task Role* choose `None`.

![task configuration](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/task_configuration.png)

For *Task execution role* choose `ecsTaskEcecutionRole`, if that role is not listed, choose `Create new role`. For *Task memory (GB)* select `0.5GB`. For *Task CPU (vCPU)* select `0.25 vCPU`. Click in **Add container**:

![task size](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/task_size.png)

For *Container name* type a name like `python-fargate`. For *Image* copy and paste the same ECR URL used in the previous tutorials. For *Port mppings* type `3000` and leave `tcp` as  the protocol. Click in **Add**: 

![task container](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/fargate_container.png)

Click in **Create**.

## 4. Deploying the application

Now that we have our task definition, let's create a task itself to see our container running with no servers to manage.

Go back to the ECS Console and select the cluster that you created for this tutorial. Click on the *Task* tab and then click in **Run new task**

![run task](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/run_new_task.png)

In the **Run Task** screen, for *Launch type* select `FARGATE`. For *Task Definition* select the Task Definition that you created in the previous step. For *Cluster* select the cluster that you created for this tutorial:

![run task configuration](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/run_new_task_conf.png)

For *Cluster VPC* select the VPC that you created in the step 03-CreateVPC. For *Subnets* select a public subnet. If you have more than one public subnet, feel free to choose all of them. For *Auto-assign public IP* choose `ENABLED`. Click in **Run Task**.

![run task configuration VPC](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/run_new_task_conf_vpc.png)

## 5. Acessing the application

After running your task, go back to the ECS Console. Select the cluster and click on the Tasks tab. You'll see a task in the `PENDING` status. 

![pending task](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/pending_task.png)

A Fargate task can take around 30 seconds to a minute before changing its status to `RUNNING`. That's because, for each new task, an ENI is created in your VPC with an IP from the subnet you chose, and then, it's attached to the Fargate task.

![running task](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/running_task.png)

The last step to test our app is to change its security group. Click in the task that is currently running. In the Network section, find the **ENI Id** and click in the ENI. 

![task eni](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/eni_fargate.png)

In the Security Groups, click in the Security Group with a name `fargat-something`. 

![SG fargate](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/sg_fargate.png)

Click in the tab **Inbound** and click in **Edit**. First remove any rule that was already created by Fargate. Now we will add our rule. For **Type** select `Custom TCP Rule`. For **Port Range** type `3000`. For **Source** select `Anywhere`. Click in **Save**.

![rules SG fargate](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/sg_rules_fargate.png)

To test your app go back to the Task and find the **Public IP**. Copy and paste it your browser, and add `:3000/app` to the URL. The final URL should look like this: http://34.232.64.118:3000/app

![final Fargate](https://github.com/bemer/containers-on-aws-workshop/blob/master/05-DeployFargate/images/final_fargate.png)

## 6. Conclusion

You have successfully deployed an application with AWS Fargate and Docker containers. This is how you deploy a serverless container app on AWS.

Now, take a moment to spend some time navigating in the AWS Fargate. Here is a list of a few thing that you can try:

* Finding the container logs;
* Deploying a new version of this application;
* Adding an Application Load-Balancer to your task definition;
* Deploying other containers using AWS Fargate (you can use the container you created on the previous tutorial).
