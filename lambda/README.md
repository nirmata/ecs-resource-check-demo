# ecs-resource-check-demo

To build the Docker images, pass the tag version you want (increase the version as you go):

```sh
./build.sh v1
```

If you need to push to a different registry, edit the `build.sh` script.

## How to test

After you have modified policies and built & pushed a new docker image, you need to test it out.

**NOTE** Same steps can be followed just to test out the function

1. Log into AWS
2. Switch to `us-west-1`
3. Go to Lambda: https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions
4. Go to the `ecs-lambda-function`: https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/ecs-lambda-function?tab=image
5. Click `Deploy New Image` and select the ECR registry and the latest tag you built
6. Save
7. Go to ECS: https://us-west-1.console.aws.amazon.com/ecs/v2/home?region=us-west-1
8. Choose the ECS cluster you want to test in (current test is in `boris-norvatis-ecs`): https://us-west-1.console.aws.amazon.com/ecs/v2/clusters/boris-norvatis-ecs/services?region=us-west-1
9. If you want to test a `task` or `service` simply click `create` and follow the prompts
   1.  if you want to see failures choose Task Definition Family `sinatra-hi`
   2.  if you want to see passes choose Task Definition Family `nginx`
10. Go to Nirmata Slack channel `#aws-policy-reports-demo` to view results of policy checks
