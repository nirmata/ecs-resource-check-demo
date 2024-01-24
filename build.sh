#!/bin/bash

if [[ -z ${1} ]]; then
  echo Must pass in a tag version e.g.: ./build.sh v1
  exit 1
fi

aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 844333597536.dkr.ecr.us-west-1.amazonaws.com

docker build . -t ecs-lambda-function --no-cache=true --platform=linux/arm64 -f Dockerfile.kyverno-json
docker tag ecs-lambda-function 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:${1}-kyverno
docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:${1}-kyverno

docker build . -t ecs-lambda-function --no-cache=true --platform=linux/arm64 -f Dockerfile.nctl
docker tag ecs-lambda-function 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:${1}-nctl
docker push 844333597536.dkr.ecr.us-west-1.amazonaws.com/nirmata/ecs-lambda-function:${1}-nctl
