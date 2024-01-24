# Verifying AWS Service Configuration Using Kyverno JSON

Demo for applying policies using AWS lambda. It uses kyverno-json scan command to apply the policies to incoming events.

To build:
```
./build.sh
```

Tag and push the container image to Amazon ECR

e.g. 
```
     docker tag ecs-lambda-function-amd64 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:v1
     docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:v1
```

Use the image in AWS Lambda. For Slack integration, pass in the webhook url as an environment variable - WEBHOOK_URL

Add rules in Amazon EventBridge (default event bus) to forward events from ecs and eks to the lambda function.

Verify by creating an ECS service or EKS cluster with public IP address.

![](kyverno-json-lambda.jpg)

