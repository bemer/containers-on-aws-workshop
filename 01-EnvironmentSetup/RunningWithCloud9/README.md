## 1. Infrastructure Setup (with Cloud9)

In order to deploy the infrastructure to your account, you can use one of the following links according to the region you with to use. These are the regions that currently support Fargate and Cloud9.

|Deploy | Region |
|:---:|:---:|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-east-1-with-cloud9] | US East (N. Virginia)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-east-2-with-cloud9] | US East (Ohio)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][us-west-2-with-cloud9] | US West (Oregon)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][eu-west-1-with-cloud9] | EU (Ireland)|
|[![launch stach](/01-EnvironmentSetup/images/launch_stack_button.png)][ap-southeast-1-with-cloud9] | Asia Pacific (Singapore)|

In the CloudFormation screen, add your name under the resource naming. This is going to add your name in front of the names to all the resources created, so in case you are running the workshop with someone else in the same account, you will be able to know your resources.

Wait till the status of the stack be changed to `CREATE_COMPLETE`, click in the **Outputs** tab and take note of all the values in the **Value** colunm. If you are using the template that provision a Cloud9 instance, you will have the `Cloud9URL` option. You can click in this URL to access your Cloud9 instance:

![CloudFormation Output](/01-EnvironmentSetup/images/cloudformation_output.png)

## 2. Understanding the Cloud9 Interface

AWS Cloud9 is a cloud-based integrated development environment (IDE) that lets you write, run, and debug your code with just a browser. During this workshop, we will be using Cloud9 to interact with the application code and Docker containers. Since Cloud9 has everything that we need to run the workshop, let's now take a moment to understand where we will be running our commands and executing the steps.

This is the main interface presented by Cloud9 and the first thing you will see when clicking in the CloudFormation output URL:

![Cloud9 Main Screen](/01-EnvironmentSetup/images/cloud9_main_screen.png)

All the commands presented in the workshop, such as `docker build`, `aws ecr get-login` and so on, should be executed in the terminal window:

![Cloud9 Terminal](/01-EnvironmentSetup/images/cloud9_terminal.png)

>NOTE: You can arrange the size of the windows inside the Cloud9 interface.

On the left side of the screen, you will have a list of all files:

![Cloud9 Files](/01-EnvironmentSetup/images/cloud9_files.png)

On the top window, you have a text editor, where you can make all the changes in the files. If you just click twice in any file on the *files** menu, you will be able to edit it:

![Cloud9 Editor](/01-EnvironmentSetup/images/cloud9_editor.png)

## 3. Cloning the workshop repository

In order to clone this repository, you can use the following command:

    $ git clone https://github.com/bemer/containers-on-aws-workshop.git

After cloning the repository, you will see that a new folder called `containers-on-aws-workshop` will be created. All the content will be available inside this folder.

After provisioning the infrastructure and cloning the repository within your Cloud9 environment, you can go to the next chapter: [2. Creating your Docker image](/02-CreatingDockerImage).

<br>

[![back to menu](/images/back_to_menu.png)][back-to-menu]  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   [![continue workshop](/images/continue_workshop.png)][continue-workshop]


<br>



[back-to-menu]: /
[continue-workshop]: /02-CreatingDockerImage


[us-east-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[us-east-2-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[us-west-2-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[eu-west-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
[ap-southeast-1-with-cloud9]: https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/new?stackName=containers-workshop-insfrastructure&templateURL=https://s3.amazonaws.com/containers-on-aws-workshop-vpc/containers-workshop-with-cloud9.yaml
