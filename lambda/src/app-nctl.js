const {
  EventBridgeClient
} = require("@aws-sdk/client-eventbridge");

const { execSync } = require("child_process");
const fs = require("fs");
const YAML = require("js-yaml");

exports.handler = async (event, context) => {
  const resourceDir = "/tmp/resources";
  const user = process.env.NPM_USER || null;
  const token = process.env.NPM_TOKEN || null;
  const client = new EventBridgeClient({});

  try {
    // Debug helpers
    // console.log(`Got event: ${JSON.stringify(event)}`);
    // console.log(`Event resources: ${JSON.stringify(event.resources)}`);
    // console.log(`Got event payload: ${JSON.stringify(event.detail)}`);

    const resourceYAML = YAML.dump(event);
    // Debug helpers
    console.log(`Resource YAML: ${resourceYAML}`);

    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir);
    }

    fs.writeFileSync("/tmp/resources/resource.yaml", resourceYAML, "utf8");

    // Run a CLI command to verify the task
    try {
      const login = `/bin/nctl login --url https://nirmata.io --userid ${user} --token ${token}`;
      const loginresults = execSync(login);

      const scan = `/bin/nctl scan json -p /policies/ -r /tmp/resources/resource.yaml -o json --details --publish`;
      const scanresults = execSync(scan);

      // Debug helpers
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
