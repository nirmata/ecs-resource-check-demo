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

    // const breakpoint = "- ";
    // const splittedResults = results.toString().split(breakpoint);
    // console.log(`Got splittedResults: ${splittedResults.toString()}`);

    // if (splittedResults.length > 1) {
    //   splittedResults.shift();
    // } else {
    //   console.log(`No results found`);
    //   return;
    // }

    // var details = new Object();
    // details.results = splittedResults;

    // console.log(`Got details: ${JSON.stringify(details)}`);

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

    // if (url) {
    //   const data = {
    //     blocks: [],
    //   };

    //   data.blocks.push({
    //     type: "header",
    //     text: {
    //       type: "plain_text",
    //       text: "Policy Results",
    //       emoji: true,
    //     },
    //   });

    //   const resourceSection = {
    //     type: "section",
    //     fields: [],
    //   };

    //   for (const resource of resources) {
    //     resourceSection.fields.push({
    //       type: "plain_text",
    //       text: resource,
    //       emoji: true,
    //     });
    //   }

    //   data.blocks.push(resourceSection);

    //   for (const result of splittedResults) {
    //     data.blocks.push({
    //       type: "section",
    //       text: {
    //         type: "mrkdwn",
    //         text: result,
    //       },
    //     });
    //   }

    //   console.log(`Sending data to webhook: ${JSON.stringify(data)}`);

    //   const postResponse = await axios.post(url, data, {
    //     headers: {
    //       // Overwrite Axios's automatically set Content-Type
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   console.log("POST response: ", postResponse);
    // }

    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
