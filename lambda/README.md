# ecs-resource-check-demo

To build the Docker images, edit the `build.sh` script to point it to your registry.

To build, pass the tag version you want (increase the version as you go):
```bash
./build.sh v1
```

## How to test

After you have modified policies and built & pushed a new docker image, you need to test it out.

**NOTE** Same steps can be followed just to test out the function

1. Log into AWS
2. Switch to `us-west-1`
3. Go to Lambda: https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions
4. Create a new Lambda Function from Container Image
5. Click `Deploy New Image` and select the ECR registry and the latest tag you built
6. Save
7. Go to ECS: https://us-west-1.console.aws.amazon.com/ecs/v2/home?region=us-west-1
8. Choose the ECS cluster you want to test in: https://us-west-1.console.aws.amazon.com/ecs/v2/clusters/
9. If you want to test a `task` simply click `create` and follow the prompts
    - Deploy a task
10. Go to Nirmata.io and visit the Policy Reports under `ECS Best Practices`
