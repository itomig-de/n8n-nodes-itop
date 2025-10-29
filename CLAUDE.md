# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **n8n community node package** that provides **iTop CMDB** integration for n8n workflows. It enables workflow automation with iTop's REST/JSON API.

**Key Information:**
- Compatible with n8n@1.60.0 or later
- Uses n8n Nodes API Version 1
- Supports username/password and token-based authentication
- Implements iTop REST/JSON API operations (core/get, core/update)
- API Documentation: https://www.itophub.io/wiki/page?id=latest:advancedtopics:rest_json

## Build & Development Commands

```bash
# Build the node (compiles TypeScript to dist/)
npm run build

# Watch mode for development
npm run build:watch

# Development mode with n8n-node dev server
npm run dev

# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Prepare for release (creates changelog, version bump)
npm run release

# Pre-publish checks (runs automatically before npm publish)
npm run prepublishOnly
```

## Architecture & Code Structure

### Node Architecture Pattern

This follows the **n8n imperative node pattern** with manual execute() implementation:

1. **Main Node Class** ([nodes/ITop/ITop.node.ts](nodes/ITop/ITop.node.ts)):
   - Defines the node metadata, credentials, and properties
   - Implements `execute()` method for handling all operations
   - Processes operations: `get` (core/get) and `update` (core/update)
   - Uses custom error handling with `continueOnFail` support

2. **Operations Structure** ([nodes/ITop/operations/](nodes/ITop/operations/)):
   - Each operation (get, update) has its own file defining UI properties
   - `get.ts`: Defines fields for core/get operation (class, key, output_fields, limit, page)
   - `update.ts`: Defines fields for core/update operation (class, key, fields, comment)
   - Property descriptions control UI visibility with `displayOptions`

3. **Shared Components** ([nodes/ITop/shared/](nodes/ITop/shared/)):
   - `descriptions.ts`: Reusable field definitions (class, key, output_fields, comment)
   - `transport.ts`: Two key functions:
     - `iTopApiRequest()`: Handles API communication with authentication
     - `formatITopResponse()`: Converts iTop API responses to n8n items

4. **iTop API Integration**:
   - All requests go to `/webservices/rest.php?version=X.X`
   - Request body uses `json_data` parameter with stringified JSON operation
   - Authentication via body parameters (auth_user/auth_pwd or auth_token)
   - Response format: `{ code: 0, message: "...", objects: {...} }`

### Credentials Structure

One credential type ([credentials/ITopApi.credentials.ts](credentials/ITopApi.credentials.ts)):
- `ITopApi`: Supports two authentication methods:
  - Username/Password (auth_user, auth_pwd)
  - Token (auth_token)
- Stores iTop instance URL and API version
- Test endpoint uses `core/check_credentials` operation

### Package Configuration

The `package.json` `n8n` section registers:
```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "strict": true,
  "credentials": ["dist/credentials/*.credentials.js"],
  "nodes": ["dist/nodes/*/*.node.js"]
}
```

Files are built to `dist/` which is what gets published (see `files` array).

## Adding New Operations

To add a new iTop operation (e.g., "core/create"):

1. Create operation file: `nodes/ITop/operations/create.ts`
   - Export field definitions array following the pattern in [operations/get.ts](nodes/ITop/operations/get.ts)
   - Use `displayOptions.show.operation` to control field visibility

2. Add operation to main node ([nodes/ITop/ITop.node.ts](nodes/ITop/ITop.node.ts)):
   - Add option to the `Operation` property:
     ```typescript
     {
       name: 'Create',
       value: 'create',
       action: 'Create an iTop object',
       description: 'Create a new iTop object'
     }
     ```
   - Import and spread fields: `...createFields`
   - Add handler in `execute()` method:
     ```typescript
     else if (operation === 'create') {
       const requestData = { /* build request */ };
       const response = await iTopApiRequest.call(this, 'core/create', requestData);
       const formattedItems = formatITopResponse(response);
       returnData.push(...formattedItems);
     }
     ```

## iTop Operation Details

### core/get
- **Purpose**: Search for and retrieve iTop objects
- **Key Parameter**: Accepts numeric ID, OQL query, or JSON search criteria
- **OQL Example**: `SELECT Person WHERE email LIKE '%.com'`
- **Output**: Multiple objects possible, supports pagination

### core/update
- **Purpose**: Update a single iTop object
- **Important**: Key must identify exactly ONE object (no bulk updates)
- **Fields Parameter**: fixedCollection format converted to simple object in execute()
- **Comment**: Optional audit trail comment

## TypeScript Configuration

- Target: ES2019 (Node.js compatibility)
- Strict mode enabled with comprehensive type checking
- Output to `dist/` with source maps and declarations
- Includes: credentials, nodes, and package.json

## Important Notes

- **API Response Format**: iTop returns objects keyed by "class::id", which are flattened into n8n items
- **Error Handling**: Response code 0 = success, non-zero codes throw NodeApiError
- **Authentication**: Passed in request body (not headers or query params) - auth_user/auth_pwd or auth_token
- **Content-Type**: Always `application/x-www-form-urlencoded` with json_data in body
- **Icon Location**: PNG file at [nodes/ITop/itop.png](nodes/ITop/itop.png) - official iTop logo from Wikimedia Commons
- **Output Fields**: Use "*" for all fields, "*+" for all fields including subclass attributes
- **OQL Queries**: iTop Query Language - similar to SQL but for iTop objects
- **User Permissions**: Users need "REST Services User" profile + write/bulk write permissions
