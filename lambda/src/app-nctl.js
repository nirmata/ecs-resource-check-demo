import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dump } from "js-yaml";
//const axios = require("axios");

export async function handler(event, context) {
  const resourceDir = "/tmp/resources";
  const user = process.env.NPM_USER || null;
  const token = process.env.NPM_TOKEN || null;

  const client = new EventBridgeClient({});

  try {
    console.log(`Got event: ${JSON.stringify(event)}`);
    console.log(`Webhook url: ${url}`);
    console.log(`Event resources: ${JSON.stringify(event.resources)}`);
    console.log(`Got event payload: ${JSON.stringify(event.detail)}`);

    const resourceYAML = dump(event);
    console.log(`Resource YAML: ${resourceYAML}`);

    if (!existsSync(resourceDir)) {
      mkdirSync(resourceDir);
    }

    writeFileSync("/tmp/resources/resource.yaml", resourceYAML, "utf8");

    // Run a CLI command to verify the task
    const command = `/bin/nctl scan -p /policies/ -r /tmp/resources/resource.yaml --details --publish --token ${token} --user ${user}`;
    const results = execSync(command);
    console.log(`Got results: ${results.toString()}`);

    var eventName = "--";
    if (event.detail.eventName) {
      eventName = event.detail.eventName;
    }

    var eventTime = event.time;
    if (event.detail.eventTime) {
      eventTime = event.detail.eventTime;
    }

    var resources = [];
    resources.push("Event Source: " + event.source);
    resources.push("Event Name: " + eventName);
    resources.push("Event Type: " + event["detail-type"]);
    resources.push("Event Time: " + eventTime);
    resources.push("AWS Account: " + event.account);
    resources.push("Region: " + event.region);
    for (const resource of event.resources) {
      resources.push("Resource: " + resource);
    }

    console.log(`Got resources: ${resources}`);

    const response = await client.send(
      new PutEventsCommand({
        Entries: [
          {
            Detail: JSON.stringify(details),
            DetailType: "Policy Results",
            Resources: event.resources,
            Source: "nirmata.lambda",
            EventBusName:
              "arn:aws:events:us-west-1:844333597536:event-bus/ecs-results-event-bus",
          },
        ],
      })
    );
    console.log(`PutEvents response: ${JSON.stringify(response)}`);

    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
