![eks-kubernetes](/07-IntroToKubernetes/images/eks.png)

[Kubernetes](https://eksworkshop.com) alone requires an entire workshop (usually two days) by its own. The proposed agenda is a suggestion on how to use a few modules from eksworkshop.com to get an example microservices application up and running in 1h or less.

 If you're already familiar with Kubernetes you can use [your own laptop environment](/01-EnvironmentSetup#6-running-on-your-own-computer) at your convenience. For a easier and quick start just [use Cloud9 IDE](/01-EnvironmentSetup#3-infrastructure-setup-with-cloud9).

## Get Started with EKS

1. [Introduction](https://eksworkshop.com/introduction/)
1. [Prerequisites](https://eksworkshop.com/prerequisites/self_paced/workspace/)
1. [Launch using eksctl](https://eksworkshop.com/eksctl/)
1. [Deploy the Example Microservices](https://eksworkshop.com/deploy/)

## What's next?

By completing the modules above you should be able to start productively exploring Kubernetes ecosystem by yourself.

- eksworkshop.com is actively maintained and updated by AWS personnel (also accepting [_pull requests_](https://github.com/aws-samples/eks-workshop/pulls)).

- Monitoring (or better saying, **observing**) your clusters/containers are critical for benefiting from Kubernetes entirely. At re:Invent 2018 there was [a workshop regarding CloudWatch and X-Ray](https://github.com/aws-samples/reinvent2018-dev303-code) in the context of containerized applications ([slides](https://www.slideshare.net/AmazonWebServices/instrumenting-kubernetes-for-observability-using-aws-xray-and-amazon-cloudwatch-dev303r2-aws-reinvent-2018)).

- [eksctl](https://eksctl.io) repository and docs have a lot of information regarding how to customize and adjust `eksctl` to your specific needs.

- AWS Containers Services, including ECS and EKS, are being developed in the open. You can see, follow and influence our [containers-roadmap](https://github.com/aws/containers-roadmap/projects/1) in GitHub.

## \#NowGoBuild
