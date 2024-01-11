import json
import yaml
import sys
from datetime import datetime
import argparse
import re

parser = argparse.ArgumentParser(description='Process kyverno-json output into WG Report')
parser.add_argument("filename", help="Name of the file to process")
parser.add_argument("category", help="Report Category Name")
parser.add_argument("kind", help="Object Kind (task, definition, cluster, service)")
parser.add_argument("severity", help="Severity level (low, medium, high)")
# Parse the arguments
args = parser.parse_args()
# Check if any arguments were provided
if not args:
    parser.print_help()
    exit(0)  # Exit gracefully if no arguments
# Access the parsed arguments
filename = args.filename
category = args.category
kind = args.kind
severity = args.severity

# Read JSON input from file
try:
    with open(filename, 'r') as file:
        data = json.load(file)
except FileNotFoundError:
    print("File not found!")
    sys.exit(1)

# Initialize summary counts
summary_counts = {"error": 0, "fail": 0, "pass": 0, "skip": 0, "warn": 0}

# Function to process each result and format it into a Kyverno policy report
def process_result(item):
    scored = True
    source = "kyverno"
    timestamp = int(datetime.now().timestamp())  # Current timestamp in seconds

    # Update summary counts
    summary_counts[item['result']] += 1

    arn_start = item['message'].find("'arn:aws:ecs:") + len("'arn:aws:ecs:") - 12
    arn_end = item['message'].find("'", arn_start)
    arn = item['message'][arn_start:arn_end]

    return {
        "category": category,
        "message": item['message'],
        "policy": item['policy'],
        "resources": [{
            "apiVersion": "v1",  # Dummy value
            "kind": kind,  # Dummy value
            "name": arn,  # Dummy value
        }],
        "result": item['result'],
        "rule": item['rule'],
        "scored": scored,
        "severity": severity,
        "source": source,
        "timestamp": {
            "nanos": 0,
            "seconds": timestamp
        }
    }

# Generate Kyverno policy report
# Identify unique policies
unique_policies = set(result['policy'] for result in data['results'])
# Generate Kyverno policy report for each unique policy
kyverno_reports = []
for policy in unique_policies:
    policy_results = [process_result(result) for result in data['results'] if result['policy'] == policy]
    kyverno_report = {
        "apiVersion": "wgpolicyk8s.io/v1alpha2",
        "kind": "PolicyReport",
        "metadata": {
            "name": f"{policy}",
            "namespace": "norvatis"
        },
        "results": policy_results,
        "summary": summary_counts
    }
    kyverno_reports.append(kyverno_report)
    # reset counts
    summary_counts = {"error": 0, "fail": 0, "pass": 0, "skip": 0, "warn": 0}

# Output the formatted reports
for report in kyverno_reports:
    print("---")
    print(yaml.dump(report, indent=2))
