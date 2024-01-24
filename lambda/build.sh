docker build . -t ecs-lambda-function --no-cache=true --platform=linux/arm64 -f Dockerfile.kyverno-json
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 844333597536.dkr.ecr.us-west-1.amazonaws.com
docker tag nirmata/ecs-lambda-function:latest 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:latest
docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:latest
