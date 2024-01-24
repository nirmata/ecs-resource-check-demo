const { ECS } = require("@aws-sdk/client-ecs");
const { execSync } = require('child_process');
const fs = require("fs");
const YAML = require('js-yaml');


const ecs = new ECS();

exports.handler = async (event, context) => {

  const resourceDir = '/tmp/resources';

  try {
    console.log(`Got event: ${JSON.stringify(event)}`);
    console.log(`Got context: ${JSON.stringify(context)}`);

    console.log(`Got event payload: ${JSON.stringify(event.detail)}`);

    const taskArn = event.detail.taskArn;
    const clusterArn = event.detail.clusterArn;

    console.log(`Task ARN: ${taskArn}`);
    console.log(`Cluster ARN: ${clusterArn}`);

    const response = await ecs.describeTasks({ tasks: [taskArn], cluster: clusterArn });

    console.log(`Response: ${JSON.stringify(response)}`);

    const containerImage = response.tasks[0].containers[0].image;
    console.log(`Container Image: ${containerImage}`);

    var resource = new Object();
    /* Create resource object for validation
    resource.apiVersion = "v1";
    resource.kind = "ecs";
    resource.metadata = Object();
    resource.metadata.name = taskArn;
    resource.spec = response.tasks[0];
    */
    //Create resource object for image verification - use Pod as Kind
    resource.apiVersion = "v1";
    resource.kind = "Pod";
    resource.metadata = Object();
    resource.metadata.name = taskArn;
    resource.spec = response.tasks[0];


    console.log(`Resource: ${JSON.stringify(resource)}`);

    const resourceYAML = YAML.dump(resource);
    console.log(`Resource YAML: ${resourceYAML}`);

    if (!fs.existsSync(resourceDir)) {
      fs.mkdirSync(resourceDir);
    }

    fs.writeFileSync("/tmp/resources/ecs.yaml", resourceYAML, "utf8");
   
    // Run a CLI command to verify the task
    const command = `/bin/nctl scan -p /policies/ -r /tmp/resources/`;
    const output = execSync(command);
    console.log(output.toString());

    if(output.includes("failed to verify image")) {
      console.error(`Failed to verify image ${containerImage}`);
      return "Fail";
    }

    return "Success";
  } catch (err) {
    console.error(err);
    throw err;
  }
};
