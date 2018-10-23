# Deploying an application with AWS Fargate

![aws fargate logo](/04-DeployFargate/images/aws_fargate_logo.png)


**Quick jump:**

* [1. Tutorial overview](/04-DeployFargate#1-tutorial-overview)
* [2. Creating the Cluster](/04-DeployFargate#2-creating-the-cluster)
* [3. Creating the Task Definition](/04-DeployFargate#3-creating-the-task-definition)
* [4. Deploying the application](/04-DeployFargate#4-deploying-the-application)
* [5. Accessing the application](/04-DeployFargate#5-accessing-the-application)
* [6. Conclusion](/04-DeployFargate#6-conclusion)


## 1. Tutorial overview

This tutorial will walk you through a web application deployment using AWS Fargate. This is the same application that we used for the ECS Cluster with EC2. This means that we won't need to create and build another Docker image. We will also use the same image and ECR respoitory.

After concluding this tutorial, you will have an application running in AWS Fargate.

## 2. Creating the Cluster

We will create a new cluster just for the Fargate tasks, however, a single ECS cluster supports both EC2 and Fargate tasks.

Let's create a new cluster to deploy our containers. In your AWS account Management Console, navigate to the [ECS Console](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters).

Click in **Create cluster** and in the following screen select the **Networking only** cluster template. Click in **Next step**:

![cluster template](/04-DeployFargate/images/cluster_template.png)

For the **Cluster name** use `containers-workshop-fargate-cluster` and click in **Create**:

![cluster configuration](/04-DeployFargate/images/cluster_configuration.png)

## 3. Creating the Task Definition

To create a Task Definition, at the left side of the ECS Console menu, click in **Task Definitions**. Click in **Create new Task Definition**. Select `FARGATE` as the **Launch type compatibility** and click in **Next steps**:

![type compatibility](/04-DeployFargate/images/task_compatibility.png)

In the **Task Definition Name** type `containers-workshop-fargate-task-def`. For *Task Role* choose `None`.

![task configuration](/04-DeployFargate/images/task_configuration.png)

Under **Task execution role** choose `ecsTaskEcecutionRole`, if that role is not listed, choose `Create new role`. Under **Task memory (GB)** select `0.5GB`. For **Task CPU (vCPU)** select `0.25 vCPU`. Click in **Add container**:

![task size](/04-DeployFargate/images/task_size.png)

For **Container name** type the name `containers-workshop-app`. And add the same ECR URL using in the previous modules of this workshop in the **Image** field. Under **Port mappings** type `80` and leave `tcp` as the protocol. Click in **Add**:

![task container](/04-DeployFargate/images/fargate_container.png)

Click in **Create**.

## 4. Deploying the application

Now that we have our task definition, let's create a task itself to see our container running with no servers to manage.

Go back to the ECS Console and select the cluster that you created for this tutorial. Click on the **Task** tab and then click in **Run new task**

![run task](/04-DeployFargate/images/run_new_task.png)

In the **Run Task** screen, for **Launch type** select `FARGATE`. For **Task Definition** select the Task Definition that you created in the previous step. For **Cluster** select the cluster `containers-workshop-fargate-cluster`:

![run task configuration](/04-DeployFargate/images/run_new_task_conf.png)

Under **Cluster VPC**, select the VPC `containers-workshop-vpc` and the both `containers-workshop-public-subnets` as your **Subnets**. Select `ENABLED` in the **Auto-assign public IP** option. After selecting everything, click in **Run Task**:

![run task configuration VPC](/04-DeployFargate/images/run_new_task_conf_vpc.png)

## 5. Accessing the application

After running your task, go back to the ECS Console. Select the cluster and click on the Tasks tab. You'll see a task in the `PENDING` status.

![pending task](/04-DeployFargate/images/pending_task.png)

A Fargate task can take around 30 seconds to a minute before changing its status to `RUNNING`. That's because, for each new task, an ENI is created in your VPC with an IP from the subnet you chose, and then, it's attached to the Fargate task.

![running task](/04-DeployFargate/images/running_task.png)

To test your app, click in the Task and find the **Public IP**. Copy and paste it in your browser. The final URL should look like this: http://34.229.126.241

![final Fargate](/04-DeployFargate/images/final_fargate.png)

## 6. Conclusion

You have successfully deployed an application with AWS Fargate and Docker containers. This is how you deploy a serverless container app on AWS.

Now, take a moment to spend some time navigating in the AWS Fargate. Here is a list of a few thing that you can try:

* Finding the container logs;
* Deploying a new version of this application;
* Adding an Application Load-Balancer to your task definition;
* Deploying other containers using AWS Fargate (you can use the container you created on the previous tutorial).

[![back to meny](/01-SetupEnvironment/images/back_to_menu.png)][back-to-menu]  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   [![continue workshop](/01-SetupEnvironment/images/continue_workshop.png)][continue-workshop]

[back-to-menu]: https://github.com/bemer/containers-on-aws-workshop
[continue-workshop]: /05-ContinuousDelivery
