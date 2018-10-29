# Configuring Service Auto Scaling on Amazon ECS

![auto scaling](/06-AutoScaling/images/auto_scaling.png)

## Quick jump:

* [1. Tutorial overview](/06-AutoScaling#1-tutorial-overview)
* [2. Configuring the Service Auto Scaling](/06-AutoScaling#2-configuring-the-service-auto-scaling)
* [3. Generating Load](/06-AutoScaling#3-generating-load)
* [4. Scaling your environment](/06-AutoScaling#4-scaling-your-environment)

## 1. Tutorial overview

At this moment, you should be able to run your application inside a container and deploy it on ECS as a *service*, but as you probably noticed, we didn't create any rule or used any tool to automatically scale the number of containers running in our cluster.

When working with Amazon ECS, we can also take advantage of Auto Scaling features, that will allow us to add more containers of a specific task definition according to some metrics that are already available. In this part of our workshop, we will create some Auto Scaling rules with our service, in order to keep our application available even during access peaks.

## 2. Configuring the Service Auto Scaling

When we talk about scaling on ECS, we need to keep in mind that there are two things to be scaled during an event or an access peak: the **number of tasks** of a given service and the **number of instances** within your ECS cluster. In this workshop we are going to cover the auto scaling configuration for the tasks only. If you wish to learn more about EC2 Auto Scaling, you can get more information in [this link](https://aws.amazon.com/pt/autoscaling/).

Let's get started.

In the AWS Management Console, go to ECS. On the left side menu, click in **Clusters** and click in the cluster `containers-workshop-ecs-cluster`. Find the **Services** tab, select the service `containers-workshop-ecs-service` and click in **Update**:

![update service](/06-AutoScaling/images/update_service.png)

Now, in the `Configure service` screen, just click in **Next step**. Click in `Next step` again under `Configure network` screen. You will reach the `Set Auto Scaling` screen. Here is where we are going to make the first changes.

Under `Service Auto Scaling`, select the option `Configure Service Auto Scaling to adjust your service’s desired count`. Now, use the following values on the fields:

**Minimum number of tasks**: 1

**Desired number of tasks**: 1

**Maximum number of tasks**: 5

![number of tasks](/06-AutoScaling/images/number_of_tasks.png)

After adding this information, let's add a new `scaling policy`, which will execute the scaling actions in your cluster based in some specific metrics. Click in the button `Add scaling policy`.

In this screen, give your policy the name `containers-workshop-ecs-scaling-policy`. In this workshop, we are going to scale the tasks every time the metric `ECSServiceAverageCPUUtilization` reaches 10%. Add the value `10` in `Target value`, change the `Scale-out cooldown period` and the `Scale-in cooldown period` to `30`.

>NOTE: We are using lower values just to see the scaling in action very quickly, and also, we will be generating load using just one EC2 instance. In a real world scenario, you might want to use higher values to scale your application.

Leave the other parameters with the default values and then click in `Save`:

![number of tasks](/06-AutoScaling/images/ecs_scaling_policy.png)

After saving the policy, click in `Next step`, review your configurations and then click in `Update Service`.

You can check the `Auto Scaling` configurations of your service by clicking in the service `containers-workshop-ecs-service` under your cluster, and then selecting the tab `Auto Scaling`:

![service auto scaling](/06-AutoScaling/images/service_auto_scaling.png)

## 3. Generating Load

Now that we have our Service Auto Scaling configured, we need to generate load in order to scale the number of running tasks in our cluster. To do so, we will be using an open source tool called `Locust`. You can find more information about Locust in [their documentation](https://docs.locust.io/en/stable/).

Since the focus of this workshop is understaing how to run containers on AWS, we will provide you a CloudFormation template that will create an EC2 instance, install and configure Locust in it. 

In the AWS Management Console, go to Services > CloudFormation. Click in `Create Stack`. You'll need to upload the file `load_test_instance.json`. You can first download the file directly from the Cloud9 enviroment by right-clicking on the file `load_test_instance.json` and select Download. Save it and then upload it using the option `Upload a template to Amazon S3`.  

In the following screen, type `containers-workshop-load-testing`. For the `HTTP Location` parameter, you can add you public IP Address or just leave it as the default.

Since we will be generating a large ammount of load, it's recommended that you use a large instance type. We are setting the default as `m5.xlarge`.

If you have a keypair created in the region where you are running this workshop, you can select it under `KeyName`. However, instance SSH access is not nedded.

Under `Load Balancer URL`, you should add the hostname of your Load Balancer. This is the same name that you used to access your application in the step [04-Deploy ECS Cluster](/04-DeployEcsCluster#6-testing-our-service-deployments-from-the-console-and-the-alb).

![load testing cfn](/06-AutoScaling/images/load_test_cfn.png)

Then, click in `Next` and in the Options screen, click in `Next` again. Under the Review screen, validate your configurations and click in `Create`.

After creating your new Stack, you should see a URL that point to your EC2 instance with the Locust installed:

![load testing output](/06-AutoScaling/images/load_test_output.png)

Click in this URL and you will be redirected to the Locust page in your instance. In this screen, you can see that the `HOST` is pointing to your Load Balancer hostname. Now, under `Number of users to simulate` you can add `20000` and under `Hatch rate` add `500`:

![locust main screen](/06-AutoScaling/images/locust_main_screen.png)

After configuring Locust, you can click in `Start swarming`.

This will start to simulate 20000 users accessing your application. You can follow the results in the following screen:

![locust test](/06-AutoScaling/images/locust_test.png)

## 4. Scaling your environment

After generating load against your application, you should be able to see it scaling after a few seconds. Go to you `containers-workshop-ecs-cluster` and click in the service `containers-workshop-ecs-service`. Go to the `Events` tab and you will find the message saying that the desired count of tasks have changed:

![scaling message](/06-AutoScaling/images/scaling_message.png)

<br>

[![back to menu](/images/back_to_menu.png)][back-to-menu]

[back-to-menu]: https://github.com/bemer/containers-on-aws-workshop
