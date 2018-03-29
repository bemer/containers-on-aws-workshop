# Running an ECS Cluster

![ecs logo](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/ecs_logo.png)

**Quick jump:**

* [1. Tutorial overview](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#tutorial-overview)
* [2. Creating the Cluster](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#creating-the-cluster)
* [3. Creating the ALB](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#creating-the-alb)
* [4. Creating the Task Definition](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#creating-the-task-definition)
* [5. Creating the Service](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#creating-the-service)
* [6. Testing our service deployments from the console and the ALB](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#testing-our-service-deployments-from-the-console-and-the-alb)
* [7. More in-depth logging with Cloudwatch](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#more-in-depth-logging-with-cloudwatch)
* [8. That's a wrap!](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#thats-a-wrap)


## 1. Tutorial overview

This tutorial will guide you through the creation of an ECS Cluster and the deployment of the container with a simple Python application created in the previous lab.

In order to run this tutorial, you must have completed the following steps:

* [Setup Environment](https://github.com/bemer/containers-on-aws-workshop/tree/master/01-SetupEnvironment)
* [Creating your Docker image](https://github.com/bemer/containers-on-aws-workshop/tree/master/02-CreatingDockerImage)


## 2. Creating the Cluster

Once you've signed into your AWS account, navigate to the [ECS console](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters). This URL will redirect you to the ECS interface on N. Virginia region. If this is your fist time using ECS, you will see the *Clusters* screen without any clusters in it:

![clusters screen](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/clusters_screen.png)

Let's create our first ECS Cluster. Click in the button **Create cluster** and then select the **EC2 Linux + Networking** cluster template:

![cluster template](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/cluster_template.png)

You will then be asked to input information about your new cluster. In the *Configure cluster* screen, keep the default values to the fields, changing just these ones:

### Configure cluster
* Cluster name: `workshop-ecs-cluster`

### Instance configuration
* EC2 instance type: `t2.micro`

### Networking
* VPC: Select the VPC created in the [Create VPC tutorial](https://github.com/bemer/containers-on-aws-workshop/tree/master/03-CreateVPC)
* Subnets: Select the `private` subnet in your VPC

And them click in **Create**.

>In this tutorial we are not covering the creation of a Key Pair to access your EC2 instances. If you want to access your instances for troubleshooting purposes or even to just see how the ECS agent works you will need to create a Key Pair and them select it in the `Key pair` option. You can see how to create a new Key Pair in [this link](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html).

Note that this wizard is also going to create a security group for you allowing access in the port 80 (TCP).

After changing all these parameters and putting the needed information, click in the button **Create** in the end of the screen.

When the creation process finishes, you will see the following screen:

![cluster created](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/cluster_created.png)

You can them click in the button **View Cluster** to see your cluster. The ECS Cluster screen will be like this:

![cluster screen](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/cluster_screen.png)


## 3. Creating the ALB

Now that we've created our cluster, we need an [Application Load Balancer - ALB][https://aws.amazon.com/elasticloadbalancing/applicationloadbalancer/] to route traffic to our endpoints. Compared to a traditional load balancer, an ALB lets you direct traffic between different endpoints.  In our example, we'll use the enpoint:  `/app`.

To create the ALB:

Navigate to the [EC2 Service Console](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1), and select **Load Balancers** from the left-hand menu.  Click in **Create Load Balancer**. Inside the `Application Load Balancer`, click in **Create**:

![choose ALB](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/select_alb.png)

Name your ALB **alb-workshop** and add an HTTP listener on port 80:

![name ALB](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/create_alb.png)

Next, select the VPC previously created and add at the private subnet. If you have multiple VPC, and you're not sure which VPC is the correct one, you can find its ID from the VPC console.

After adding the information about your VPC, click in **Next: Configure Security Settings**.

When clicking in next, you should see a message saying that your load balancer is not using any secure listener. We can just skip this screen, clicking in **Next: Configure Security Groups**.

>NOTE: In a production environment, you should also have a secure listener on port 443.  This will require an SSL certificate, which can be obtained from [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/), or from your registrar/any CA.  For the purposes of this workshop, we will only create the insecure HTTP listener. DO NOT RUN THIS IN PRODUCTION.

Let's now create a security group to be used by your ALB. In the *Step 3: Configure Security Groups* screen, let's select the option `Create a new security group`. Change the **Security group name** to `workshop-alb-sg` and create a rule allowing all traffic in the port `80`:

![create alb security group](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/create_alb_sg.png)

Them, click in **Next: Configure Routing**.

During this initial setup, we're just adding a dummy health check on `/`.  We'll add specific health checks for our ECS service endpoint when registering it with the ALB. Let's change onlye the the **Name** to `dummy`:

![add routing](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/configure_alb_routing.png)

Click in **Next: Register Targets** and them in **Review**. If your values look correct, click **Create**:

![alb creation](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/alb_creation.png)



# CONTINUAR DAQUI


After creating your ALB, you need to update the security group rule so your ALB can access the EC2 instances where your containers will run. If you ran the ECS wizard to provision your cluster, you should have an existing group called something like **EC2ContainerService-lts-workshop-EcsSecurityGroup** listed under **VPC** > **Security Groups** - note that you can select your VPC in the top left corner of the VPC screen. Select your security group from the list, click in **Inbound** > **Edit** and add a rule to allow your ALB to access the port range for ECS (0-65535).  The final rules should look like this (note the ALB security group ID):

![ec2 sg configuration](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/ec2_sg_configuration.png)



## 4. Creating the Task Definition

Before you can register a container to a service, it needs be a part of a Task Definition. Task Definitions define things like environment variables, the container image you wish to use, and the resources you want to allocate to the service (port, memory, CPU).  To create a Task Definition, choose **Task Definitions** from the ECS console menu.  Then, choose **Create new Task Definition**. Select EC2 as the *Launch type compatibility*:

![type compatibility](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/task_compatibility.png)

And them click in **Next Step**. Name your task **lts-demo-app**:

![create task def](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/create_task_def.png)

Continue to adding a container definition. Click in **Add container**. Now we will add the informations about the image that we created in the previous tutorial. The name of our container will be `lts-demo-app`. In the *Image* field, we need to add the URI from our repository. You can get this URI in the *Repositories* screen, by selecting the repository *lts-demo-app* created before.

Add `128` in the *Memory Limits* field and in *Port mapping* add `0` in the *Host port* field and `3000` in the *Container port*.

![container def](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/container_def.png)


A few things to note here:

- We've specified a specific container image, including the `:latest` tag.  Although it's not important for this demo, in a production environment where you were creating Task Definitions programmatically from a CI/CD pipeline, Task Definitions could include a specific SHA, or a more accurate tag.

- Under **Port Mappings**, we've specified a **Container Port** (3000), but left **Host Port** as 0.  This was intentional, and is used to facilitate dynamic port allocation.  This means that we don't need to map the Container Port to a specific Host Port in our Container Definition - instead, we can let the ALB allocate a port during task placement.  To learn more about port allocation, check out the [ECS documentation here](http://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_PortMapping.html).

Once you've specified your Port Mappings, scroll down and add a log driver.  There are a few options here, but for this demo, select **Auto-configure CloudWatch Logs**:

![aws log driver](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/setup_logdriver.png)

Once you've added your log driver, add the Container Definition, and create the Task Definition.


## 5. Creating the Service

Navigate back to the ECS console, and choose the cluster that you created during the first run wizard.  This should be named **lts-workshop**.  If you don't have a cluster named **lts-workshop**, create one following the procedures in  [Creating the cluster](https://github.com/bemer/containers-on-aws-workshop/tree/master/04-DeployEcsCluster#creating-the-cluster).

Next, you'll need to create your app service.  From the cluster detail page, choose **Services** > **Create**.

Select `EC2` as the *Launch Type* choose the Task Definition you created in the previous section. For the purposes of this demo, we'll only start one copy of this task.  In a production environment, you will always want more than one copy of each task running for reliability and availability.

You can keep the default **AZ Balanced Spread** for the Task Placement Policy.  To learn more about the different Task Placement Policies, see the [documentation](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html), or this [blog post](https://aws.amazon.com/blogs/compute/introducing-amazon-ecs-task-placement-policies/).

![create service](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/create_service.png)

Click in **Next**.

Under **Load balancing**, select **Application Load Balancer**. Under *Container to load balance*, select the container "*lts-workshop*" and click in **Add to load balancer**:

![add to ALB](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/add_container_to_alb.png)

This final step allows you to configure the container with the ALB.  When we created our ALB, we only added a listener for HTTP:80.  Select this from the dropdown as the value for **Listener**.  For **Target Group Name**, enter a value that will make sense to you later, like **lts-demo-app**.  For **Path Pattern**, the value should be **`/app*`**.  This is the route that we specified in our Python application. In the **Evaluation order**, add the number `1`.

Finally, **Health check path**, use the value `/app`.

![configure container ALB](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/configure_container_alb.png)

If the values look correct, click **Next Step**.

Since we will not use Auto Scaling in this tutorial, in the **Set Auto Scaling** screen, just click in **Next Step** and after reviewing your configurations, click in **Create Service**.


## 6. Testing our service deployments from the console and the ALB

You can see service level events from the ECS console.  This includes deployment events. You can test that of your service deployed, and registered properly with the ALB by looking at the service's **Events** tab:

![deployment event](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/steady_state_service.png)

We can also test from the ALB itself.  To find the DNS A record for your ALB, navigate to the EC2 Console > **Load Balancers** > **Select your Load Balancer**.  Under **Description**, you can find details about your ALB, including a section for **DNS Name**.  You can enter this value in your browser, and append the endpoint of your service, to see your ALB and ECS Cluster in action:

![alb web test](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/alb_app_response.png)

You can see that the ALB routes traffic appropriately based on the path we specified when we registered the container:  `/app*/` requests go to our app service.


## 7. More in-depth logging with Cloudwatch

When we created our Container Definitions, we also added the awslogs driver, which sends logs to [Cloudwatch](https://aws.amazon.com/cloudwatch/).  You can see more details logs for your service by going to the Cloudwatch console, and selecting first our log group:

![log group](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/loggroup.png)

And then choosing an individual stream:

![event streams](https://github.com/bemer/containers-on-aws-workshop/blob/master/04-DeployEcsCluster/images/event_streams.png)

## 8. That's a wrap!

Congratulations!  You've deployed an ECS Cluster with two working endpoints.  
