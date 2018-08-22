## Quick jump:

* [1. Tutorial overview](/07-AutoScaling#1-tutorial-overview)
* [2. Configuring the Service Auto Scaling](/07-AutoScaling#2-configuring-the-service-auto-scaling)

## 1. Tutorial overview

At this moment, you should be able to run your application inside a container and deploy it on ECS as a *service*, but as you probably noticed, we don't have created any rule or used any tool to automatically scale the number of containers running in our cluster.

When working with Amazon ECS, we can also take advantage of Auto Scaling features, that will allow us to add more containers of a specific task definition according to some metrics that are already available. In this part of our workshop, we will create some Auto Scaling rules with our service, in order to keep our application available even during access peaks.

## 2. Configuring the Service Auto Scaling

When we talk about scaling on ECS, we need to keep in mind that there are two things to be scaled during an event or an access peak: the **number of tasks** of a given service and the **number of instances** within your ECS cluster. The first thing that we are going to configure to scale will be the number of tasks of our deployed service.

Ir order to make these configurations, on your ECS console access the cluster named `containers-workshop-ecs-cluster` and under services, select the service `containers-workshop-ecs-service` and click in update:

![update service](/07-AutoScaling/images/update_service.png)

Now, in the `Configure service` screen, just click in `Next Step`. Click in `Next Step` again under `Configure network` screen. You will reach the `Set Auto Scaling` screen. Here is where we are going to make the first changes.

Under `Service Auto Scaling`, select the option `Configure Service Auto Scaling to adjust your service’s desired count`. Now, use the following values on the fields:

**Minimum number of tasks**: 1
**Desired number of tasks**: 1
**Maximum number of tasks**: 15

![number of tasks](/07-AutoScaling/images/number_of_tasks.png)

After adding this information, let's add a new `scaling policy`, which will execute the scaling actions in your cluster based in some specific metrics. Click in the button `Add scaling policy`.

In this screen, give your policy the name `containers-workshop-ecs-scaling-policy`. In this workshop, we are going to scale the tasks every time that the metric `ECSServiceAverageCPUUtilization` reaches 40%. Add the value `40` in `Target value` and change the `Scale-out cooldown period` to 30. We are doing this change in order to scale fast and see everything working fine in our workshop.

Leave the other parameters with the default values and them click in `Save`:

![number of tasks](/07-AutoScaling/images/ecs_scaling_policy.png)

After saving the policy, click in `Next step`, review your configurations and them click in `Update Service`:
