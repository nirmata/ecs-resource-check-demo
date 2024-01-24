docker build . -t ecs-lambda-function-kyverno --no-cache=true --platform=linux/arm64 -f Dockerfile.kyverno-json
docker build . -t ecs-lambda-function-nctl --no-cache=true --platform=linux/arm64 -f Dockerfile.nctl
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 844333597536.dkr.ecr.us-west-1.amazonaws.com
docker tag ecs-lambda-function-kyverno 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function-kyverno:${1}
docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function-kyverno:${1}
docker tag ecs-lambda-function-nctl 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function-nctl:${1}
docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function-nctl:${1}
