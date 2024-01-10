#!/bin/bash
echo "Checking Cluster Policies"
echo "---------------------"
kyverno-json scan --payload payloads/clusters.json --policy policies/cluster-fargate.yaml,policies/cluster-insights.yaml
echo "\n"
echo "Checking Task Definition Policies"
echo "---------------------"
kyverno-json scan --payload payloads/definition.json --policy policies/definition-registry.yaml,policies/definition-rootfs.yaml
echo "\n"
echo "Checking Task Policies"
echo "---------------------"
kyverno-json scan --payload payloads/task.json --policy policies/task-registry.yaml,policies/task-overrides.yaml
