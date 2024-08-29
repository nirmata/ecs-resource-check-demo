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
      console.log(`Got event: ${JSON.stringify(event)}`);
      console.log(`Event resources: ${JSON.stringify(event.resources)}`);
      console.log(`Got event payload: ${JSON.stringify(event.detail)}`);
    }

    const resourceYAML = YAML.dump(event);
    if (debugEnabled) {
      console.log(`Resource YAML:\n ${resourceYAML}`);
    }

    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir);
    }

    fs.writeFileSync("/tmp/resources/resource.yaml", resourceYAML, "utf8");

    // Run a CLI command to verify the task
    try {
      const filedate = Date.now();
      const date = `mv /tmp/resources/resource.yaml /tmp/resources/${filedate}-resource.yaml`;
      const dateresults = execSync(date);

      const login = `/bin/nctl login --url https://nirmata.io --userid ${user} --token ${token}`;
      const loginresults = execSync(login);

      const scan = `/bin/nctl scan json -p /policies/ -r /tmp/resources/${filedate}-resource.yaml -o json --report-sourceid=${filedate} --publish`;
      const scanresults = execSync(scan);

      if (debugEnabled) {
        const results = { scanresults, loginresults, dateresults };
        const nonEmptyResults = Object.entries(results).filter(([_, value]) => value);
        if (nonEmptyResults.length > 0) {
          nonEmptyResults.forEach(([key, value]) => {
            console.log(`Got ${key}: ${value.toString()}`);
          });
        } else {
          console.log(`All Results are empty`);
        }
      }
    } catch (err) {
      console.log(`Got error: ${err}`);
    }

    return;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
