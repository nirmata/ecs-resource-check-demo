# How to use the CLI to check things

**NOTE** CURRENTLY THIS DOES NOT WORK WITH THE POLICIES AT HAND. IGNORE THIS

Generate resources (requires you already have `aws` authenticated):

```sh
for i in $(aws ecs list-task-definitions --query taskDefinitionArns --output text); do
  echo $(aws ecs describe-task-definition --output json --query taskDefinition --task-definition $i)
done | jq . > payloads/definition.json

for i in $(aws ecs list-clusters --query clusterArns --output text); do
  echo ${i}
  aws ecs describe-tasks --output json --cluster ${i} --tasks `aws ecs list-tasks --query taskArns --output text --cluster ${i}`
done | jq . > payloads/tasks.json

aws ecs describe-services --output json --services `aws ecs list-services --query serviceArns --output text` | jq . > payloads/services.json

aws ecs describe-clusters --output json --include SETTINGS --clusters `aws ecs list-clusters --query clusterArns --output text` | jq . > payloads/clusters.json
```

-  Run `test-payloads.sh` to get sample output from `kyverno-json` output
-  Run `convert-to-report.py` to convert the `payloads/` outputs to an NPM readable report that can be applied in a k8s cluster
