#!/bin/bash

# Function to convert JSON
function convert_json() {
  local input_json="$1"

  # Parse input JSON
  local parsed_json=$(jq -r '.results[] | { policy: .policy, rule: .rule, result: .result, message: .message }' <<< "$input_json")

  # Construct template JSON
  cat <<EOF
{
  "apiVersion": "wgpolicyk8s.io/v1beta1",
  "kind": "PolicyReport",
  "metadata": {
    "name": "norvatis-ecs-static-check",
    "annotations": {
      "name": "Norvatis ECS Image Compliance Report"
    }
  },
  "configuration": {
    "limits": {
      "maxResults": 100,
      "statusFilter": [
        "pass",
        "fail"
      ]
    },
    "source": "kyverno"
  },
  "results": [
    $(echo "$parsed_json" | sed 's/}$/},/g')
  ]
}
EOF
}

echo "$(convert_json "$(kyverno-json scan --payload payload.json --policy policy.yaml --output json)")"
