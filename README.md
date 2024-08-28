# ecs-resource-check-demo

![ECS Full Nirmata Flow](ECSFlows.png)

Demo repo which holds materials to tell a complete ECS control story:
- protection in repository `terraform`
- protection in cloud `cloud-controller`
  - image verification on the fly
- protection of existing resources `lambda`
- periodic scan of running ECS resources
