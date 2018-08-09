## Quick jump:

* [1. Tutorial overview](/06-CDECS#1-tutorial-overview)
* [2. Creating a Source stage](/06-CDECS#2-creating-a-source-stage)
* [3. Creating a Build stage](/06-CDECS#3-creating-a-build-stage)
* [4. Configuring a Continous Delivery pipeline](/06-CDECS#4-configuring-a-continous-delivery-pipeline)
* [5. Testing our pipeline](/06-CDECS#5-testing-our-pipeline)

## 1. Tutorial overview

So far we've been deploying our containers into ECS manually. On a production enviroment, changes that happens on code or on the container image itself should be builded, tested and deployed, all automatically. This process is commonly known as Continous Delievey (CD).

To support us on this task, we must create a Continous Delivery pipeline that will orchestrate different stages of our pipeline. For this workshop our pipeline will have three stages:

>a) a Source stage: the Git repository branch where all the changes should be promoted to a production enviroment. We will use AWS CodeCommit as the Git repository;

>b) a Build stage: automatically pulls the content from the Git repository, builds and tags the Docker image, and pushes the new version to Amazon ECR. We will use AWS CodeBuild for this job;

>c) a Deployment stage: automatically deploys the new version of our application that is on Amazon ECR into Amazon ECS. The Amazon ECS itself will be responsible for deploying it without any downtime;

Since we already have the Depployment stage working, we only need to create the Source stage and the Build stage, and later, figure out how to connect all those stages to finally form an actual Continous Delivery pipeline. 

Let's begin with the Source stage.

## 2. Creating a Source stage

In the AWS Console Management, type on the search field `Commit` and select **CodeCommit** in the list

![codecommit]
(https://github.com/bemer/containers-on-aws-workshop/blob/new-application/06-CDECS/images/codecommit.png)
