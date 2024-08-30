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
    // Check if process.env.DEBUG is enabled
    const debugEnabled = process.env.DEBUG === "enabled";

    if (debugEnabled) {
      console.log(`Debug: Event JSON --- \n ${JSON.stringify(event)}`);
    }

    const resourceYAML = YAML.dump(event);
    if (debugEnabled) {
      console.log(`Debug: Resource YAML ---\n ${resourceYAML}`);
    }

    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir);
    }

    const timestamp = Date.now();
    const filename = `/tmp/resources/resource-${timestamp}.yaml`;
    fs.writeFileSync(filename, resourceYAML, "utf8");

    // Run a CLI command to verify the task
    try {
      const login = `/bin/nctl login --url https://nirmata.io --userid ${user} --token ${token}`;
      const loginresults = execSync(login);

      const scan = `/bin/nctl scan json -p /policies/ -r /tmp/resources/resource-${timestamp}.yaml -o json --report-sourceid=${timestamp} --details --publish`;
      const scanresults = execSync(scan);

      if (debugEnabled) {
        const results = { scanresults, loginresults };
        let hasResults = false;
        for (const [key, value] of Object.entries(results)) {
          if (value) {
            hasResults = true;
            console.log(`Debug: Results of commands ${key}: ${value.toString()}`);
          }
        }

        if (!hasResults) {
          console.log(`Debug: All Results are empty`);
        }
      }
    } catch (err) {
      console.log(`Error: inside command try block: ${err}`);
    }
    return;
  } catch (err) {
    console.log(`Error: inside overall try block: ${err}`);
    throw err;
  }
};
