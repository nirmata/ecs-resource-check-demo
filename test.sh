#!/bin/bash

# # Initialize counters outside the pipeline
# total_results=0
# failed_results=0
# success_results=0

# # Print report header
# echo "ECS Compliance Report"
# echo "---------------------\n"

# # Store parsed JSON in a variable before the loop
# results=$@

# # Iterate over parsed results
# while IFS= read -r i; do
#   # Extract values from the JSON
#   result_status=$(echo "$i" | jq -r '.results[].result')

#   # Print result details
#   policy=$(echo "$i" | jq -r '.results[].policy')
#   rule=$(echo "$i" | jq -r '.results[].rule')
#   taskArn=$(echo "$i" | jq -r '.results[].message' | ggrep -Po 'arn:aws:[^"]*' | tr -d '\\')
#   message=$(echo "$i" | jq -r '.results[].message' | ggrep -Po '^[^: ]*')
#   echo "Policy: $policy"
#   echo "Rule: $rule"
#   echo "Status: $result_status"
#   echo "Task: $taskArn"
#   echo "Message: $message"
#   echo ""

#   # Increment counters
#   ((total_results++))
#   [[ "$result_status" == "fail" ]] && ((failed_results++))
# #  [[ "$result_status" == "fail" ]] && ((success_results++))
# done <<< "$results"

# # Print summary
# echo "---------------------"
# echo "Summary:"
# echo "Total Results: $total_results"
# echo "Failed Results: $failed_results"
# # echo "Successful Results: $success_results"

echo "Checking Cluster Policies"
echo "---------------------"
kyverno-json scan --payload payloads/payload-clusters.json --policy policies/policy-cluster-fargate.yaml,policies/policy-cluster-insights.yaml
echo "\n"
echo "Checking Task Definition Policies"
echo "---------------------"
kyverno-json scan --payload payloads/payload-definition.json --policy policies/policy-definition-registry.yaml,policies/policy-definition-rootfs.yaml
echo "\n"
echo "Checking Task Policies"
echo "---------------------"
kyverno-json scan --payload payloads/payload-task.json --policy policies/policy-task-registry.yaml,policies/policy-task-overrides.yaml
