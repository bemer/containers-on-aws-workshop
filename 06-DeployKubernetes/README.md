## Deploying a Kubernetes Cluster with KOPS

Today's last tutorial is going to guide you through a deployment of a Kubernetes Cluster using Kops.

We will be using a material crafted by Arun Gupta. This tutorial is available in [this link](https://github.com/aws-samples/aws-workshop-for-kubernetes). If you want, you can just follow the levels starting with the **Beginner (100 level)** and so on, but we advice you to follow the following steps:

## Pre-Reqs

Before starting this lab, you must follow these [Pre-requisites](https://github.com/aws-samples/aws-workshop-for-kubernetes/blob/master/prereqs.adoc).

Note that some of these requirements might be duplicated in the next steps. If this is the case, you don't need to do it again.

## Create a Kubernetes Cluster Using KOPS

Follow [this URL](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/cluster-install) and execute the following steps:

* Install Kops
* Install AWS CLI
* IAM user permissions
* S3 Bucket for kops

## Create A Cluster

* [Create a Gossip Based Kubernetes Cluster with kops](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/cluster-install#create-a-gossip-based-kubernetes-cluster-with-kops)

* [Multi-master, multi-node, multi-az Gossip Based Cluster](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/cluster-install#multi-master-multi-node-multi-az-gossip-based-cluster)

* [Instance Groups with kops (Optional)](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/cluster-install#instance-groups-with-kops)

* [Delete a Cluster](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/cluster-install#delete-a-cluster)
  **PLEASE, DO NOT DELETE MULTI-MASTER, MULTI-NODE-MULTI-AZ CLUSTER!**


## Developer Concepts

Follow [this URL](https://github.com/aws-samples/aws-workshop-for-kubernetes/tree/master/developer-concepts)


* Create a Pod
* Memory and CPU resource request
* Delete a Pod
* Deployment
* Service
* Daemon Set
* Job
* Cron Job
* Namespaces
