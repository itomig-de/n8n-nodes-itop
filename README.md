# n8n-nodes-itop

This is an n8n community node. It lets you use iTop CMDB in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Preview

https://github.com/user-attachments/assets/6524dc6b-c6c9-4a39-ae8f-218ec982d13b


## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Get**: Search for and retrieve iTop objects using OQL queries or object IDs
- **Update**: Update a single iTop object with new field values

## Credentials

You can use either username/password or token-based authentication to use this node.

### Setting up credentials in n8n

1. In n8n, go to **Credentials** and create a new **iTop API** credential
2. Enter your **iTop URL** (e.g., `https://your-itop-instance.com`)
3. Select your **Authentication Method**:

### Username and Password

1. Select **Username and Password** as the authentication method
2. Enter your iTop **Username**
3. Enter your iTop **Password**
4. Optionally adjust the **API Version** (default: 1.3)

### Token

1. Select **Token** as the authentication method
2. Enter your iTop **Auth Token**
   - To generate a token in iTop, go to **User Account** > **Personal Tokens**
3. Optionally adjust the **API Version** (default: 1.3)

### Required iTop Permissions

Users need the following permissions in iTop:
- **REST Services User** profile
- **Write access** on the classes they want to modify
- **Bulk write** permissions on the classes they want to modify

Note: Standard administrator accounts do not have REST access by default unless the REST Services User profile is explicitly granted.

## Compatibility

Compatible with n8n@1.60.0 or later

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [iTop REST/JSON API documentation](https://www.itophub.io/wiki/page?id=latest:advancedtopics:rest_json)
