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

    fs.writeFileSync("/tmp/resources/resource.yaml", resourceYAML, "utf8");

    // Run a CLI command to verify the task
    try {
      const command = `/bin/nctl scan json -p /policies/ -r /tmp/resources/resource.yaml -o json --publish --token ${token}`;
      const results = execSync(command);

      // if (results) {
      //   console.log(`Got nctl results: ${results.toString()}`);
      // } else {
      //   console.log(`Results are empty`);
      // }
    } catch (err) {
      console.log(`Got nctl error: ${err}`);
    }

    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
