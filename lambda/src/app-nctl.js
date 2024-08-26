const {
  EventBridgeClient,
  PutEventsCommand,
} = require("@aws-sdk/client-eventbridge");

const { execSync } = require("child_process");
const fs = require("fs");
const YAML = require("js-yaml");
// const axios = require("axios");

exports.handler = async (event, context) => {
  const resourceDir = "/tmp/resources";
  const user = process.env.NPM_USER || null;
  const token = process.env.NPM_TOKEN || null;
  const client = new EventBridgeClient({});

  try {
    console.log(`Got event: ${JSON.stringify(event)}`);
    console.log(`Event resources: ${JSON.stringify(event.resources)}`);
    console.log(`Got event payload: ${JSON.stringify(event.detail)}`);

    const resourceYAML = YAML.dump(event);
    console.log(`Resource YAML: ${resourceYAML}`);

    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir);
    }

    // console.log(`Returned Event: ${resourceYAML}`)
    fs.writeFileSync("/tmp/resources/resource.yaml", resourceYAML, "utf8");

    // Run a CLI command to verify the task
    try {
      const command = `/bin/nctl scan json -p /policies/ -r /tmp/resources/resource.yaml -o json --publish --token ${token}`;
      const results = execSync(command);

      if (results) {
        console.log(`Got nctl results: ${results.toString()}`);
      } else {
        console.log(`Results are empty`);
      }
    } catch (err) {
      console.log(`Got nctl error: ${err}`);
    }

    // var eventName = "--";
    // if (event.detail.eventName) {
    //   eventName = event.detail.eventName;
    // }
    // var eventTime = event.time;
    // if (event.detail.eventTime) {
    //   eventTime = event.detail.eventTime;
    // }
    // var resources = [];
    // resources.push("Event Source: " + event.source);
    // resources.push("Event Name: " + eventName);
    // resources.push("Event Type: " + event["detail-type"]);
    // resources.push("Event Time: " + eventTime);
    // resources.push("AWS Account: " + event.account);
    // resources.push("Region: " + event.region);
    // for (const resource of event.resources) {
    //   resources.push("Resource: " + resource);
    // }
    // console.log(`Got resources: ${resources}`);
    // const response = await client.send(
    //   new PutEventsCommand({
    //     Entries: [
    //       {
    //         Detail: JSON.stringify(details),
    //         DetailType: "Policy Results",
    //         Resources: event.resources,
    //         Source: "nirmata.lambda",
    //         EventBusName:
    //           "arn:aws:events:us-west-1:844333597536:event-bus/ecs-results-event-bus",
    //       },
    //     ],
    //   })
    // );
    // console.log(`PutEvents response: ${JSON.stringify(response)}`);
    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
