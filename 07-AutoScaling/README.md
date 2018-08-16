## Quick jump:

* [1. Tutorial overview](/07-AutoScaling#1-tutorial-overview)

## 1. Tutorial overview

At this moment, you should be able to run your application inside a container and deploy it on ECS using *service*. But as you probably noticed, we don't have created any rule or used any tool to automatically scale the number of containers running in our cluster.

When working with Amazon ECS, we can also take advantage of Auto Scaling features, that will allow us to add more containers of a specific task definition according to some metrics that are already available. In this part of our workshop, we will create some Auto Scaling rules and add to our service, in order to keep our application available even during access peaks.

## 2. 
