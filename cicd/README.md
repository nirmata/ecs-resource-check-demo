# Policies for CI/CD controls

![CICD Flow](CICD.png)

This folder containers the policies which can be used with `nctl` to scan various resources from Jenkins, Github Actions, Gitlab, etc.

An example [Github Action](../.github/workflows/npm-periodic-ecs-scan.yaml) can be found in this repository.

Also included is a [Jenkins Plugin](nctl-scan-plugin.hpi) which allows the use of `nctl` in a Jenkins pipeline

## Steps to create and use the plugin

1. **nctl-scan-plugin.hpi**: Install this hpi file locally to add to Jenkins addons.
2. **Jenkins Addons**: From Jenkins Dashboard, head over to the Manage Jenkins section > Plugins under System Configuration > Advanced Settings. Here, you can add your plugin by using the file above. Now upload your file, Deploy the plugin and restart the Jenkins pods.

### Usage

When you create a new Job, from now on , you will see under build options an option called **Run NCTL Scan**

**Parameters**
NCTL Binary installation : You can provide specific NCTL binary installation links using the releases here : https://downloads.nirmata.io/nctl/allreleases/
