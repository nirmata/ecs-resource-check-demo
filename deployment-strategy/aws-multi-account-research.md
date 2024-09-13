# AWS Multi-Account Research

```mermaid
graph TB
    subgraph AWS Organization
        MA[Management Account]
        subgraph "Development OU"
            DA[Development Account]
        end
        subgraph "Test OU"
            TA[Test Account]
        end
        subgraph "Production OU"
            PA[Production Account]
        end
    end

    MA -->|Manages| DA
    MA -->|Manages| TA
    MA -->|Manages| PA

    subgraph "Management Account"
        Proton[AWS Proton]
        CP[CodePipeline]
        CT[Control Tower]
        NPC[Nirmata Policy Control]
    end

    subgraph "Development Account"
        DL[Lambda Function]
        DE[Dev Environment]
    end

    subgraph "Test Account"
        TL[Lambda Function]
        TE[Test Environment]
    end

    subgraph "Production Account"
        PL[Lambda Function]
        PE[Prod Environment]
    end

    PL -->|Governs & Reports to| NPC
    TL -->|Governs & Reports to| NPC
    DL -->|Governs & Reports to| NPC

    Proton -->|Deploys to| DE
    Proton -->|Deploys to| TE
    Proton -->|Deploys to| PE

    CP -->|Orchestrates| Proton

    CT -->|Governs| DA
    CT -->|Governs| TA
    CT -->|Governs| PA

    classDef account fill:#a2c,stroke:#333,stroke-width:2px;
    class MA,DA,TA,PA account;
```

```mermaid
graph LR
    subgraph "Source"
        GH[GitHub/CodeCommit]
    end

    subgraph "Build"
        CB[CodeBuild]
    end

    subgraph "Deploy"
        P[AWS Proton]
    end

    subgraph "Development Account"
        DE[Dev Environment]
        DL[Lambda Function]
    end

    subgraph "Test Account"
        TE[Test Environment]
        TL[Lambda Function]
    end

    subgraph "Production Account"
        PE[Prod Environment]
        PL[Lambda Function]
    end

    GH -->|Code changes| CB
    CB -->|Built artifact| P
    P -->|Deploy| DE
    P -->|Deploy| TE
    P -->|Deploy| PE
    DE --> DL
    TE --> TL
    PE --> PL

    classDef env fill:#a2c,stroke:#333,stroke-width:2px;
    class DE,TE,PE env;
```

## **Multi-Account AWS Lambda Deployment with AWS Proton**

### **1. Architecture Overview**
The goal is to set up a well-architected AWS Lambda function deployment pipeline across multiple AWS accounts using AWS Proton, Control Tower, and CodePipeline.

- **AWS Control Tower**: Helps automate the creation and governance of AWS accounts within an organizational structure.
- **AWS Proton**: Manages and simplifies infrastructure and service deployment, creating standardized environments across different accounts.
- **AWS CodePipeline**: Facilitates CI/CD processes, ensuring Lambda code is automatically tested, approved, and deployed across environments (development, testing, production).

### **2. Account Setup**
We will use a **multi-account strategy** to isolate the different stages of the deployment lifecycle (e.g., dev, test, prod). Each account will belong to its own Organizational Unit (OU) managed via AWS Control Tower:

- **Management Account (Proton Management)**: This account manages AWS Proton templates (environment and service templates) and provides infrastructure for other accounts. It serves as the "source of truth" for all infrastructure.
- **Development, Test, and Production Accounts**: These accounts host the deployed Lambda functions. Each account operates in its own sandbox, but the management account defines and provides the infrastructure.

AWS Proton uses **Environment Account Connections** to allow the management account to securely deploy infrastructure in the development/test/production accounts. This ensures bi-directional secure communication without the need for complex cross-account policies【[source](https://aws.amazon.com/blogs/architecture/simplifying-multi-account-ci-cd-deployments-using-aws-proton/)】【[source](https://aws.amazon.com/blogs/containers/multi-account-infrastructure-provisioning-with-aws-control-tower-and-aws-proton/)】.

### **3. CI/CD Pipeline with AWS CodePipeline**
**AWS CodePipeline** will manage code deployments across accounts. Code changes are automatically pushed through different stages:
1. **Source (e.g., CodeCommit or GitHub)**: The Lambda function code is stored in a repository.
2. **Build (CodeBuild)**: The code is packaged and prepared for deployment.
3. **Deploy (AWS Proton)**: AWS Proton deploys infrastructure templates that define the environment (e.g., networking, IAM policies) where the Lambda function will run.

**Service templates** within Proton define the Lambda service’s deployment configurations. These templates are reused across different environments, ensuring consistency. You can integrate **AWS CodeStar Connections** (e.g., with GitHub) to trigger deployment when changes are made to the Lambda code【[source](https://aws.amazon.com/blogs/containers/multi-account-infrastructure-provisioning-with-aws-control-tower-and-aws-proton/)】.

### **4. Step-by-Step Walkthrough**

1. **Set up Control Tower**:
   - Use Control Tower to create OUs and accounts for **Management**, **Development**, **Test**, and **Production**. These accounts will be isolated from one another.

2. **Define Environment and Service Templates in AWS Proton**:
   - Create environment templates in Proton, specifying network configurations, VPC settings, and IAM policies.
   - Service templates will define the Lambda function deployment, including roles, permissions, and monitoring tools (CloudWatch, X-Ray).
   - For example, the environment template could include VPC, subnets, and security groups, while the service template defines the Lambda service itself.

3. **Establish Environment Account Connections**:
   - Use the **Environment Account Connections** feature in Proton to allow the management account to provision infrastructure in the development/test/production accounts. Proton takes care of cross-account permissions using IAM roles【[source](https://aws.amazon.com/blogs/containers/multi-account-infrastructure-provisioning-with-aws-control-tower-and-aws-proton/)】.

4. **CI/CD Integration with AWS CodePipeline**:
   - Define a CodePipeline that pushes Lambda functions through different environments:
     - In the **development account**, functions are deployed and tested automatically.
     - After passing tests, the pipeline pushes the function to **test**, and then **production**, using AWS Proton templates for infrastructure provisioning【[source](https://aws.amazon.com/blogs/architecture/simplifying-multi-account-ci-cd-deployments-using-aws-proton/)】.

5. **Secure the Multi-Account Environment with SCPs**:
   - Use **Service Control Policies (SCPs)** to enforce organizational guardrails. For example, the management account may be allowed to deploy infrastructure in development and production accounts, but development accounts are prevented from making changes directly.
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "BlockProton",
           "Effect": "Deny",
           "Action": [
             "proton:*"
           ],
           "Resource": [
             "*"
           ]
         }
       ]
     }
     ```

6. **Monitoring and Logging**:
   - Use AWS CloudWatch and X-Ray to monitor Lambda execution, performance, and logs across accounts. Proton can provision these as part of the service templates, ensuring uniform monitoring across all environments.
