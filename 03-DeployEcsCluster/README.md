# Running an ECS Cluster

![ecs logo](/03-DeployEcsCluster/images/ecs_logo.png)

**Quick jump:**

* [1. Tutorial overview](/03-DeployEcsCluster#1-tutorial-overview)
* [2. Creating the Cluster](/03-DeployEcsCluster#2-creating-the-cluster)
* [3. Creating the ALB](/03-DeployEcsCluster#3-creating-the-alb)
* [4. Creating the Task Definition](/03-DeployEcsCluster#4-creating-the-task-definition)
* [5. Creating the Service](/03-DeployEcsCluster#5-creating-the-service)
* [6. Testing our service deployments from the console and the ALB](/03-DeployEcsCluster#6-testing-our-service-deployments-from-the-console-and-the-alb)

## 1. Tutorial overview

This tutorial will guide you through the creation of an ECS Cluster and the deployment of the container with a simple Python application created in the previous lab.

In order to run this tutorial, you must have completed the following steps:

* [Setup Environment](/01-SetupEnvironment)
* [Creating your Docker image](/02-CreatingDockerImage)


## 2. Creating the Cluster

Once you've signed into your AWS account, navigate to the [ECS console](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters). This URL will redirect you to the ECS interface on N. Virginia region. If this is your fist time using ECS, you will see the *Clusters* screen without any clusters in it:

![clusters screen](/03-DeployEcsCluster/images/clusters_screen.png)

Let's create our first ECS Cluster. Click in the button **Create cluster**, select the **EC2 Linux + Networking** cluster template and click in `Next Step`:

![cluster template](/03-DeployEcsCluster/images/cluster_template.png)

You will then be asked to input information about your new cluster. In the *Configure cluster* screen, keep the default values to the fields, changing just these ones:

### Configure cluster
* Cluster name: `containers-workshop-ecs-cluster`

### Instance configuration
* EC2 instance type: `t2.micro`

### Networking
* VPC: Select the VPC `containers-workshop-vpc` created in the [01-Setup Environments](/01-SetupEnvironment) step
* Subnets: Select the `containers-workshop-private-subnet-az1` and `containers-workshop-private-subnet-az2` subnets in your VPC

And then click in **Create**.

>In this tutorial we are not covering the creation of a Key Pair to access your EC2 instances. If you want to access your instances for troubleshooting purposes or even to just see how the ECS agent works you will need to create a Key Pair and then select it in the `Key pair` option. You can see how to create a new Key Pair in [this link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html).

Note that this wizard is also going to create a security group for you allowing access in the port 80 (TCP).

After changing all these parameters and putting the needed information, click in the button **Create** in the end of the screen.

When the creation process finishes, you will see the following screen:

![cluster created](/03-DeployEcsCluster/images/cluster_created.png)

You can then click in the button **View Cluster** to see your cluster. The ECS Cluster screen will be like this:

![cluster screen](/03-DeployEcsCluster/images/cluster_screen.png)


## 3. Creating the ALB

Now that we've created our cluster, we need an [Application Load Balancer (ALB)](https://aws.amazon.com/elasticloadbalancing/applicationloadbalancer/) to route traffic to our endpoints. Compared to a traditional load balancer, an ALB lets you direct traffic between different endpoints. In our example, we'll use the enpoint `/app`.

To create the ALB:

Navigate to the [EC2 Service Console](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1), and select **Load Balancers** from the left-hand menu.  Click in **Create Load Balancer**. Inside the `Application Load Balancer`, click in **Create**:

![choose ALB](/03-DeployEcsCluster/images/select_alb.png)

Name your ALB `containers-workshop-alb` and add an HTTP listener on port 80:

![name ALB](/03-DeployEcsCluster/images/create_alb.png)

In this same screen, under **Availability Zones** select the VPC `containers-workshop-vpc` previously created and select the two public subnets:

![select subnets](/03-DeployEcsCluster/images/select_subnets.png)


After adding the information about your Availability Zones, click in **Next: Configure Security Settings**.

When clicking in next, you should see a message saying that your load balancer is not using any secure listener. We can just skip this screen, clicking in **Next: Configure Security Groups**.

>NOTE: In a production environment, you should also have a secure listener on port 443.  This will require an SSL certificate, which can be obtained from [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/), or from your registrar/any CA.  For the purposes of this workshop, we will only create the insecure HTTP listener. DO NOT RUN THIS IN PRODUCTION.

Let's now create a security group to be used by your ALB. In the *Step 3: Configure Security Groups* screen, let's select the option `Create a new security group`. Change the **Security group name** to `containers-workshop-alb-sg` and create a rule allowing all traffic in the port `80`:

![create alb security group](/03-DeployEcsCluster/images/create_alb_sg.png)

Them, click in **Next: Configure Routing**.

During this initial setup, we're just adding a dummy health check on `/`.  We'll add specific health checks for our ECS service endpoint when registering it with the ALB. Let's change only the the **Name** to `dummy`:

![add routing](/03-DeployEcsCluster/images/configure_alb_routing.png)

Click in **Next: Register Targets** and then in **Next: Review**. If your values look correct, click **Create**:

![alb creation](/03-DeployEcsCluster/images/alb_creation.png)


After creating your ALB, you need to update the security group rule so your ALB can access the EC2 instances where your containers will run. In order to identify what is the security group applied to your instances, you can access the ECS console, select the cluster `containers-workshop-ecs-cluster` and then select the tab **ECS Instances**. You will see that you have one instance running. Then, click in the ECS Instance ID:

![ecs instance](/03-DeployEcsCluster/images/ecs_instance.png)

>NOTE: in this screen, you will find two different ID's. One of them is related to the `Container Instance`, which will show you all the tasks running in this specific instance as well as some data from the EC2 Instance. The other ID is the `EC2 Instance` ID, that will redirect you to the EC2 console, where you can manage the EC2 instance.

In the EC2 service dashboard, you will see all the information about your instance. In this screen, click in the security group name. This name is going to be similar to **EC2ContainerService-containers-workshop-ecs-cluster-EcsSecurityGroup-12SD646C23L1H**:

![ec2 security group](/03-DeployEcsCluster/images/ec2_security_group.png)

In this scree, with the Security Group selected, click in the tab **Inbound** and then in **Edit**. Here, we will have a rule previously create allowing traffic in the port 80 from anywhere. Let's change this rule, in order to allow all traffic coming from the ALB security group to our EC2 instance. Start changing the `Type` to `All Traffic` and in the field `Source` start typing `sg-`. You will see a list with all the security groups created in your AWS account. Select the security group `containers-workshop-alb-sg` previouly created and click in **Save**:

![security group configuration](/03-DeployEcsCluster/images/sg_configuration.png)

The final rules in your instance Security Group should look like this:

![final sg configuration](/03-DeployEcsCluster/images/final_sg_configuration.png)


At this point, your EC2 instances will be able to receive traffic from the ALB.

>NOTE: When creating this rule we are allowing all the traffic from the ALB to the instances. We are doing that because when working with ECS we can use a dynamic port mapping feature in order to run more containers with the same image in the same EC2 instance, so when starting our task, we will not specify any port to run our application and the ECS will do it for us. Since we don't know what is the port that the Docker daemon will expose, we need to allow all traffic to have our application accessible by the ALB.



## 4. Creating the Task Definition

When working with ECS to run our applications, there are a few concepts that we need to understand. The first of these concepts is about what is a `Task`. Basically, a task is a subset of containers that we need to execute in order to have our application running. The `Tasks` are defined in a configuration called `Task Definition`.

A `Task Definition` is where you will specify your task. Things like the Docker Image version, the amount of CPU and memory that each container will need, what ports needs to be mapped, data volumes, environment variables and other informations are going to be specified in the Task Definition.

The first thing that we will need, is the information about the image that we want to use. In this case, we are going to use the image created in the [Creating Your Docker Image](/02-CreatingDockerImage) tutorial. To get the image URI, navigate to the [ECR page](https://console.aws.amazon.com/ecs/home?region=us-east-1#/repositories). You will see the repository named `containers-workshop-app`. In this screen, you will also see that there is a `Repository URI`. Take note of this URI:

![image uri](/03-DeployEcsCluster/images/image_uri.png)


To create a Task Definition, in the [Task Definitions](https://console.aws.amazon.com/ecs/home?region=us-east-1#/taskDefinitions) screen on the ECS console menu, click in **Create new Task Definition**. Select EC2 as the *Launch type compatibility* and click in **Next step**:

![type compatibility](/03-DeployEcsCluster/images/task_compatibility.png)

Let's add now the information about this task definition. Name your task `containers-workshop-ecs-task-def` and under **Task Role** select `None`:

![create task def](/03-DeployEcsCluster/images/create_task_def.png)


In the **Task execution IAM role** select `Create new role` and under **Task size** add `128` in the **Task memory (MiB)** field:

![create task iam](/03-DeployEcsCluster/images/create_task_iam.png)


The next step is to add the information about our container. Click in the **Add container** button, under **Container Definitions**. The name of the container will be `containers-workshop-app`. In the **Image** field, add the URI that you got before, pointing to your image.

Under **Port mappings** add `0` in the **Host port** field and `80` in the *Container port*.

![container def](/03-DeployEcsCluster/images/container_def.png)


A few things to note here:

- We've specified a specific container image, including the `:latest` tag.  Although it's not important for this demo, in a production environment where you were creating Task Definitions programmatically from a CI/CD pipeline, Task Definitions could include a specific SHA, or a more accurate tag.

- Under **Port Mappings**, we've specified a **Container Port** (80), but left **Host Port** as 0.  This was intentional, and is used to facilitate dynamic port allocation.  This means that we don't need to map the Container Port to a specific Host Port in our Container Definition - instead, we can let the ALB dynamically allocate a port during the task placement. To learn more about port allocation, check out the [ECS documentation here](http://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PortMapping.html).

Once you've specified your Port Mappings, scroll down and add a log driver. There are a few options here, but for this demo, select **Auto-configure CloudWatch Logs**:

![aws log driver](/03-DeployEcsCluster/images/setup_logdriver.png)

Once you've added your log driver, click in **Add** to add the container in your task definition, and finally click in **Create** in the `Task Definition` screen.


## 5. Creating the Service

Now that we have the description of everything we need to run our application in the `Task Definition`, the next step is to run our container using Amazon ECS. Let's do it by creating a `Service`.

In ECS, a `Service` allows you to run and maintain a specified number (the "desired count") of instances of a task definition simultaneously in an Amazon ECS cluster. If any of your tasks should fail or stop for any reason, the Amazon ECS service scheduler launches another instance of your task definition to replace it and maintain the desired count of tasks in the service. You can find more information about ECS Services in the [ECS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html).

Navigate back to the [Clusters screen](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters) on the ECS console, and click in the cluster name `containers-workshop-ecs-cluster` previously created.

>If you don't have a cluster named **containers-workshop-ecs-cluster**, create one following the procedures in  [Creating the cluster](/03-DeployEcsCluster#2-creating-the-cluster).

In the details page of the **containers-workshop-ecs-cluster** , click in the button **Create**, in the `Services` tab:

![service creation](/03-DeployEcsCluster/images/service_creation.png)

Select `EC2` as the `Launch Type`, and choose the Task Definition created in the previous section. For the purposes of this demo, we'll only start one copy of this task.  

>In a production environment, you will always want more than one copy of each task running for reliability and availability.

Name your service `containers-workshop-ecs-service`.

You can keep the default **AZ Balanced Spread** for the Task Placement Policy. To learn more about the different Task Placement Policies, see the [documentation](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html), or this [blog post](https://aws.amazon.com/blogs/compute/introducing-amazon-ecs-task-placement-policies/).

  ![create service](/03-DeployEcsCluster/images/create_service.png)

Click in **Next**.

Now, under `Load balancing`, select `Application Load Balancer`. Let's configure the integration between the ECS Service and the Application Load Balancer, so we will be able to access the application using the ALB. Select `Create new role` under `Service IAM role` and under`Container to load balance`, select the container `containers-workshop-app:0:80`. Click in **Add to load balancer**:

![add to ALB](/03-DeployEcsCluster/images/add_container_to_alb.png)

This final step allows you to configure the container with the ALB. When we created our ALB, we only added a listener for HTTP:80.  Select this from the dropdown as the value for **Listener**. For **Target Group Name**, enter a value that will make sense to you later, like `containers-workshop-ecs-target`.  For **Path Pattern**, the value should be `/*`. In the **Evaluation order**, add the number `1`.

Finally, **Health check path**, use the value `/`.

![configure container ALB](/03-DeployEcsCluster/images/configure_container_alb.png)

If the values look correct, click **Next Step**.

Since we will not use Auto Scaling in this tutorial, in the `Set Auto Scaling` screen, just click in **Next Step** and after reviewing your configurations, click in **Create Service**.


## 6. Testing our service deployments from the console and the ALB

You can see service level events from the ECS console. This includes deployment events. You can test that of your service deployed, and registered properly with the ALB by looking at the service's **Events** tab:

![deployment event](/03-DeployEcsCluster/images/steady_state_service.png)

We can also test from the ALB itself. To find the DNS A record for your ALB, navigate to the EC2 Console > **Load Balancers** > **Select your Load Balancer**. Under **Description**, you can find details about your ALB, including a section for **DNS Name**. You can enter this value in your browser, and append the endpoint of your service, to see your ALB and ECS Cluster in action:

![alb web test](/03-DeployEcsCluster/images/alb_app_response.png)

You can see that the ALB routes traffic appropriately based on the path we specified when we registered the container `/app` requests go to our app service.
