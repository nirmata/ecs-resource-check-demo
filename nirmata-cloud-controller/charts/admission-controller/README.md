# cloud-admission-controller

![Version: v0.0.0](https://img.shields.io/badge/Version-v0.0.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: latest](https://img.shields.io/badge/AppVersion-latest-informational?style=flat-square)

A Helm chart for Kubernetes

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| controllerManager.manager.args[0] | string | `"--metrics-bind-address=:8080"` |  |
| controllerManager.manager.args[1] | string | `"--leader-elect"` |  |
| controllerManager.manager.args[2] | string | `"--health-probe-bind-address=:8081"` |  |
| controllerManager.manager.containerSecurityContext.allowPrivilegeEscalation | bool | `false` |  |
| controllerManager.manager.containerSecurityContext.capabilities.drop[0] | string | `"ALL"` |  |
| controllerManager.manager.image.pullPolicy | string | `"IfNotPresent"` |  |
| controllerManager.manager.image.registery | string | `"ghcr.io"` |  |
| controllerManager.manager.image.repository | string | `"nirmata/admission-controller"` |  |
| controllerManager.manager.image.tag | string | `"latest"` |  |
| controllerManager.manager.resources.limits.cpu | string | `"500m"` |  |
| controllerManager.manager.resources.limits.memory | string | `"128Mi"` |  |
| controllerManager.manager.resources.requests.cpu | string | `"10m"` |  |
| controllerManager.manager.resources.requests.memory | string | `"64Mi"` |  |
| controllerManager.replicas | int | `1` |  |
| controllerManager.serviceAccount.annotations | object | `{}` |  |
| fullnameOverride | string | `nil` | Override the expanded name of the chart |
| imagePullSecrets | object | `{}` |  |
| kubernetesClusterDomain | string | `"cluster.local"` |  |
| metricsService.createServiceMonitor | bool | `false` |  |
| metricsService.ports[0].name | string | `"http"` |  |
| metricsService.ports[0].port | int | `8080` |  |
| metricsService.ports[0].protocol | string | `"TCP"` |  |
| metricsService.ports[0].targetPort | int | `8080` |  |
| metricsService.type | string | `"ClusterIP"` |  |
| nameOverride | string | `nil` | Override the name of the chart |
| namespaceOverride | string | `nil` | Override the namespace the chart deploys to |
| service.ports[0].name | string | `"http"` |  |
| service.ports[0].port | int | `8443` |  |
| service.ports[0].protocol | string | `"TCP"` |  |
| service.ports[0].targetPort | string | `"http-proxy-svc"` |  |
| service.type | string | `"ClusterIP"` |  |

