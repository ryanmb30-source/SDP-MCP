# Claude AI Assistant Guidelines for Service Desk Plus Cloud API

This document outlines the rules and conventions for AI assistants working on this AI-driven MCP Server for the Service Desk Plus Cloud API integration — deployed for **City of Burton IT**.

## 📁 Project Location

**Project Location**: `C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server\`

This is the main development directory for the single-tenant MCP server implementation. All new code should be created in the `sdp-mcp-server/` folder. The `example/` folder contains reference implementations and knowledge base documentation — do not modify it.

## 🎯 Project Scope

This MCP server enables users to **create, update, close, and inquire** about all Service Desk Plus Cloud entities:
- **Requests** - Service requests, incidents, and tickets
- **Problems** - Problem management and root cause analysis
- **Changes** - Change requests and change management
- **Projects** - Project management with milestones and tasks
- **Assets** - IT asset and configuration management
- **Solutions** - Knowledge base articles
- **Users** - User and technician management
- **All other SDP modules** within the OAuth scope permissions

## 🏗️ Project Architecture Overview

### Current Implementation
The project uses a **single-tenant** SSE server implementation:
- Direct MCP protocol implementation over Server-Sent Events (SSE)
- Runs on port 3456 with `/sse` endpoint
- OAuth tokens configured via environment variables (`.env` file)
- Singleton OAuth client prevents rate limiting issues
- Smart token refresh only on 401 errors (not 404/400)
- Production-ready and tested with Claude Code client

### OAuth Token Architecture
- **Singleton Pattern**: `SDPOAuthClient.getInstance()` ensures single instance
- **Global Refresh Lock**: Prevents concurrent token refreshes
- **Token Caching**: Reuses valid tokens until expiry
- **Error Handling**: Only refreshes on actual authentication failures

### Future Multi-Tenant Architecture (Deferred)
Multi-tenant support is planned when MCP protocol evolves to better support it:
- Multiple clients connecting to a single MCP server
- Each client with their own self-client certificate
- Complete token isolation per tenant
- Per-tenant rate limiting and monitoring

**Important**: This is for Service Desk Plus **Cloud** (SDPOnDemand), not on-premises.

### 🔑 Critical OAuth Information
**Zoho OAuth Token Management:**
- **Access Tokens**: Valid for 1 hour only, must be refreshed
- **Refresh Tokens**: Unlimited lifetime until manually revoked
- **Rate Limits**:
  - Maximum 20 refresh tokens per account
  - Maximum 5 refresh tokens per minute
  - Hitting rate limits blocks all token operations
- **Authorization Header**: Use `Zoho-oauthtoken` format (not Bearer)
- **Automatic Refresh**: Server handles token refresh automatically

**Best Practices:**
- ✅ Use singleton OAuth client to prevent multiple refresh attempts
- ✅ Only refresh on actual 401 errors (not 404 or 400)
- ✅ Cache valid tokens until expiry
- ✅ Implement refresh locks to prevent concurrent refreshes
- ❌ Never expose tokens in logs or error messages
- ❌ Never hardcode credentials — always use environment variables
- ❌ Don't refresh if token is still valid

## 🌐 Server Access

The MCP server runs on port 3456. Configure clients to use the appropriate address:
- `localhost` or `127.0.0.1` — local access only
- Server IP on your local network — for remote clients

## 📚 Knowledge Base & Examples

### Knowledge Folder
- **Always** consult `example/knowledge/` folder for detailed API documentation
- **Reference** key documentation files:
  - `service-desk-plus-authentication.md` — OAuth implementation and data center endpoints
  - `service-desk-plus-sse-implementation.md` — Working SSE server implementation details
  - `multi-user-mcp-architecture.md` — Multi-tenant architecture (future reference)
  - `service-desk-plus-oauth-scopes.md` — Complete scope reference and permissions
  - `mcp-server-architecture.md` — Server implementation patterns
  - `mcp-security-best-practices.md` — Security guidelines
  - `mcp-client-server-communication.md` — Transport protocols and patterns
- **Check** knowledge folder before making assumptions about API behavior
- **Use** documented patterns and code examples from knowledge base

### Project Structure
```
sdp-mcp-server/                   # Main project directory
├── src/                          # Source code
│   ├── working-sse-server.cjs    # Main SSE server (25 tools)
│   ├── sdp-api-client-v2.cjs    # SDP API client with OAuth
│   ├── sdp-oauth-client.cjs     # OAuth token management (singleton)
│   ├── sdp-api-metadata.cjs     # Metadata retrieval
│   ├── sdp-api-users.cjs        # Users/technicians module
│   ├── utils/
│   │   └── error-logger.cjs     # Structured API error logging
│   ├── server/                   # Future MCP server implementation
│   ├── tenants/                  # Future multi-tenant management
│   ├── auth/                     # Authentication layer (TypeScript)
│   ├── sdp/                      # Service Desk Plus integration (TypeScript)
│   ├── tools/                    # MCP tool implementations (future)
│   ├── database/                 # Database layer (future)
│   └── monitoring/               # Observability (future)
├── tests/                        # Test files
├── docs/                         # Project documentation
│   ├── MULTI_USER_SETUP.md      # Multi-user remote access guide
│   ├── OAUTH_SETUP.md           # OAuth setup instructions
│   └── OAUTH_SETUP_GUIDE.md     # Detailed OAuth guide
├── scripts/                      # Utility scripts
│   ├── exchange-code.js         # OAuth code exchange
│   ├── test-api-custom-domain.js # API testing
│   └── [other scripts]
├── .env                          # Environment configuration (NOT in git)
├── .env.example                  # Example environment file (template only)
├── package.json                  # Node.js dependencies
└── MCP_TOOLS.md                  # Full tool reference (25 tools)

example/                          # Reference implementations (DO NOT MODIFY)
├── knowledge/                    # API documentation and technical guides
│   ├── service-desk-plus-authentication.md
│   ├── service-desk-plus-requests-api.md
│   ├── service-desk-plus-oauth-scopes.md
│   ├── service-desk-plus-mandatory-fields.md
│   ├── service-desk-plus-sse-implementation.md
│   ├── service-desk-plus-search-criteria.md
│   ├── service-desk-plus-status-codes.md
│   ├── multi-user-mcp-architecture.md
│   ├── mcp-server-architecture.md
│   ├── mcp-security-best-practices.md
│   └── mcp-client-server-communication.md
└── [reference code examples]
```

### Documentation Standards
When adding new documentation to `example/knowledge/`:

1. **File Naming**
   - Use descriptive kebab-case names: `service-desk-plus-[topic].md`
   - Group related topics with common prefixes

2. **Document Structure**
   - Start with a clear overview section
   - Include table of contents for long documents
   - Use consistent heading hierarchy
   - Provide practical code examples

3. **Content Requirements**
   - Document all endpoints with full URLs
   - Include request/response examples
   - Specify required headers and parameters
   - Note any API quirks or limitations
   - Include error handling guidance

4. **Maintenance**
   - Date stamp major updates
   - Note API version compatibility
   - Mark deprecated features clearly
   - Cross-reference related documents

## 📡 Service Desk Plus Cloud API Reference

### API Documentation Portal
**Main Documentation**: https://www.manageengine.com/products/service-desk/sdpod-v3-api/
**OAuth 2.0 Guide**: https://www.manageengine.com/products/service-desk/sdpod-v3-api/getting-started/oauth-2.0.html

### OAuth Scopes
- **Format**: `SDPOnDemand.module.OPERATION_TYPE`
- **Operation Types**: ALL, CREATE, READ, UPDATE, DELETE
- **Modules**: requests, problems, changes, projects, assets, solutions, users
- **Example**: `SDPOnDemand.requests.ALL`

### Core API Endpoints

#### Requests API
- **Key Endpoints**:
  - `GET /api/v3/requests` — List requests with filtering and pagination
  - `POST /api/v3/requests` — Create request (required: subject)
  - `GET /api/v3/requests/{id}` — Get request details
  - `PUT /api/v3/requests/{id}` — Update request
  - `POST /api/v3/requests/{id}/notes` — Add note
  - `GET /api/v3/requests/{id}/notes` — Get conversation history
  - `GET /api/v3/requests/{id}/attachments` — Get attachments
- **Field Limits**: Subject: 250 chars max. Impact Details: 250 chars max.
- **Advanced Features**: Search criteria with logical operators, pagination, sorting, UDF support

#### Assets API
- `GET /api/v3/assets` — List assets
- `GET /api/v3/assets/{id}` — Get asset details

#### Changes API
- `GET /api/v3/changes` — List changes
- `POST /api/v3/changes` — Create change
- `GET /api/v3/changes/{id}` — Get change details
- `PUT /api/v3/changes/{id}` — Update change

#### Solutions API
- `GET /api/v3/solutions` — List knowledge base articles
- `POST /api/v3/solutions` — Create article
- `GET /api/v3/solutions/{id}` — Get article

### Authentication
- **OAuth 2.0**: Zoho self-client credentials
- **Headers Required**:
  - `Authorization: Zoho-oauthtoken {access_token}`
  - `Accept: application/vnd.manageengine.sdp.v3+json`

### City of Burton IT Configuration
- **Base URL**: `https://sc.burtonmi.gov`
- **Instance Name**: `766116682`
- **Full API Path**: `https://sc.burtonmi.gov/app/766116682/api/v3`
- **Portal Name**: `burtonmi`
- **OAuth Tokens**: Obtained from Zoho accounts (accounts.zoho.com)

### Important Notes
- **Status Handling**: "Cancelled", "Closed", and "Resolved" are all treated as closed
- **Users endpoint**: `/api/v3/users` does NOT exist in SDP Cloud API v3 — technician info is embedded in request objects. `list_technicians`, `get_technician`, and `find_technician` tools return stub responses.
- **Priority on create**: Skip priority field on creation (SDP business rule 4002) — set it via update after creation
- **Search**: Use search criteria guide for complex queries
- **Error 4000**: General failure — check error messages array for details
- **Error 4002**: UNAUTHORISED — verify custom domain and instance name
- **Error 4012**: Mandatory fields missing — check `example/knowledge/service-desk-plus-mandatory-fields.md`
- **Instance Configuration**: Each SDP instance may require different mandatory fields

**IMPORTANT REMINDER**: Always check `example/knowledge/` folder for detailed implementation examples and patterns before making API calls!

## 🔄 Project Awareness & Context

- **Check** `DEVELOPMENT_PLAN.md` for comprehensive project roadmap and status
- **Check** `sdp-mcp-server/MCP_TOOLS.md` for complete tool reference (25 tools)
- **Review** documentation in `docs/` folder:
  - `docs/MULTI_USER_SETUP.md` — Multi-user remote access architecture
  - `docs/OAUTH_SETUP.md` — OAuth setup instructions
- **Study** `example/knowledge/` folder for API patterns and examples
- **Reference** OAuth scopes in `example/knowledge/service-desk-plus-oauth-scopes.md`

## 🏢 Architecture Notes

### Current Single-Tenant Implementation
Production server uses a single-tenant architecture:
- OAuth tokens configured via environment variables
- One server instance for the organization
- Simple and reliable for current MCP limitations

### Future Multi-Tenant Architecture (Deferred)
When MCP protocol evolves to support stateless connections:
- **Self-Client**: Each tenant uses their own SDP self-client OAuth app
- **Tenant Isolation**: Complete separation of tokens, data, and rate limits
- **Scope-Based Access**: Tools restricted based on OAuth scopes per tenant

## 🚀 Current Implementation Status

### ✅ PRODUCTION READY — 25 Tools Working
The production implementation is **FULLY FUNCTIONAL**:
- **File**: `sdp-mcp-server/src/working-sse-server.cjs`
- **Port**: 3456
- **Endpoint**: `/sse`
- **Status**: ✅ **ALL 25 TOOLS WORKING**
- **Architecture**: Direct MCP protocol over SSE
- **OAuth**: Singleton client with global refresh lock

### Starting the Server
```bash
cd C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server
node src/working-sse-server.cjs
```

Or with log file:
```bash
node src/working-sse-server.cjs > server.log 2>&1
```

### Client Configuration
```json
{
  "mcpServers": {
    "service-desk-plus": {
      "command": "npx",
      "args": ["mcp-remote", "http://YOUR-SERVER-IP:3456/sse", "--allow-http"]
    }
  }
}
```

## 🧱 Code Structure & Modularity

### Active Implementation Files
- `src/working-sse-server.cjs` — Main SSE server with MCP protocol + all 25 tools
- `src/sdp-api-client-v2.cjs` — SDP API client (requests, assets, changes, solutions, attachments, email, advanced search)
- `src/sdp-oauth-client.cjs` — OAuth singleton with global refresh lock
- `src/sdp-api-metadata.cjs` — Metadata (priorities, statuses, categories)
- `src/sdp-api-users.cjs` — Users/technicians module (stubs for missing endpoint)
- `src/utils/error-logger.cjs` — Structured API error logging

### File Organization
- **Never** create source files longer than 500 lines
- **Split** large modules into smaller, focused files
- **Use** CommonJS (.cjs) to avoid ES module conflicts

### Import Conventions
```javascript
const express = require('express');
const { SDPAPIClientV2 } = require('./sdp-api-client-v2.cjs');
```

## 🧪 Testing & Reliability

### Mock API Server
```bash
npm run mock:api   # Runs on port 3457
```

```bash
# In .env to use mock:
SDP_USE_MOCK_API=true
SDP_BASE_URL=http://localhost:3457
```

### Test Requirements
- Create Jest unit tests for all new modules in `/tests/`
- Minimum: happy path, error handling, edge cases, authentication

## ✅ Task Management

- **Update** `DEVELOPMENT_PLAN.md` with current task status
- **Never** delete completed tasks, only mark them done
- **Add** timestamps when updating task status

## 📎 Style & Conventions

### Code Style
- **Follow** ESLint configuration (`npm run lint`)
- **Use** Prettier for formatting (`npm run format`)
- **Name** files in kebab-case: `request-utils.cjs`
- **Name** classes in PascalCase: `SDPAPIClientV2`
- **Name** functions/variables in camelCase: `createRequest`

### Error Handling
- **Provide** meaningful error messages with context
- **Include** error codes for different scenarios
- **Handle** rate limiting with exponential backoff

## 🔐 Security Practices

- **Never** hardcode credentials or tokens
- **Never** commit `.env`, `.sdp-tokens.json`, or `api-errors.log`
- **Use** environment variables for all configuration
- **Validate** all user inputs
- **Sanitize** data before sending to API
- **Log** security-relevant events without exposing token values

## 🚀 Development Workflow

1. **Navigate** to project: `cd C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server\`
2. **Consult** `example/knowledge/` for relevant API documentation
3. **Review** API endpoints section in this document
4. **Verify** at https://www.manageengine.com/products/service-desk/sdpod-v3-api/ if needed
5. **Edit** CommonJS files (.cjs) in `src/`
6. **Test** by running: `node src/working-sse-server.cjs`
7. **Monitor** logs in the terminal

## 📦 Dependencies

### Core Runtime
- `express` — Web server for SSE endpoint
- `axios` — HTTP client for SDP API calls
- `dotenv` — Environment variable loading (**must** call `require('dotenv').config()` at top of entry file)
- `cors` — Cross-origin resource sharing

### When Adding Dependencies
- Verify the package is actively maintained
- Check license compatibility (prefer MIT/Apache)
- Document why the dependency is needed

## 🗄️ Database Integration (Future Enhancement)

Database integration is planned for future multi-tenant support. The current implementation caches OAuth tokens in `.sdp-tokens.json` (local only, in `.gitignore`) and reads credentials from environment variables.

### Environment Variables
```bash
# Service Desk Plus Configuration
SDP_BASE_URL=https://sc.burtonmi.gov
SDP_INSTANCE_NAME=766116682
SDP_PORTAL_NAME=burtonmi
SDP_DATA_CENTER=US

# OAuth Configuration (from Zoho self-client)
SDP_CLIENT_ID=your-client-id
SDP_CLIENT_SECRET=your-client-secret
SDP_OAUTH_REFRESH_TOKEN=your-permanent-refresh-token

# Server Configuration
SDP_HTTP_HOST=0.0.0.0
SDP_HTTP_PORT=3456
```

## 🧠 AI Behavior Rules

### Code Generation
- **Always** check `example/knowledge/` folder before implementing API features
- **Never** assume a library is available without checking `package.json`
- **Never** hallucinate API endpoints — refer to SDP documentation and knowledge base
- **Always** check if a file exists before reading/modifying
- **Never** delete existing code unless explicitly instructed
- **Never** hardcode credentials — always use environment variables

### API Integration
- **ALWAYS CHECK** `example/knowledge/` BEFORE implementing any API calls
- **VERIFY** endpoints at https://www.manageengine.com/products/service-desk/sdpod-v3-api/
- **Remember** common operations:
  - Create: `POST /api/v3/{module}`
  - Read: `GET /api/v3/{module}/{id}`
  - Update: `PUT /api/v3/{module}/{id}`
  - Delete: `DELETE /api/v3/{module}/{id}`
  - Notes: `POST /api/v3/requests/{id}/notes`
- **Research** — do not assume anything about the API; always verify at the docs portal

### MCP Tool Development
- **Define** clear, descriptive tool names mapping to API operations
- **Create** comprehensive input schemas with descriptions
- **Implement** proper error messages for users
- **Validate** required OAuth scopes for each tool
- **Research** — MCP is evolving; use web search for current client/server standards

## 📖 Documentation & Explainability

### Inline Comments
- Add `// Reason:` comments for non-obvious logic
- Explain rate limiting delays
- Document OAuth token refresh logic
- Clarify any SDP API quirks

### Documentation Updates
- Update `MCP_TOOLS.md` when adding new MCP tools
- Update `DEVELOPMENT_PLAN.md` when completing milestones

## 🔄 Git Practices

- Write clear, descriptive commit messages
- Keep commits focused on single changes
- **Never** commit: `.env`, `.sdp-tokens.json`, `api-errors.log`, `node_modules/`

## 🚀 Quick Reference

### Available MCP Tools (25 total)
See `sdp-mcp-server/MCP_TOOLS.md` for full documentation.

**Request Management** (7): `list_requests`, `get_request`, `create_request`, `update_request`, `close_request`, `search_requests`, `add_note`

**Email / Conversation** (4): `reply_to_requester`, `add_private_note`, `send_first_response`, `get_request_conversation`

**Technicians** (3, stubs): `list_technicians`, `get_technician`, `find_technician`

**Assets** (3): `list_assets`, `get_asset`, `search_assets`

**Changes** (4): `list_changes`, `get_change`, `create_change`, `update_change`

**Solutions** (4): `list_solutions`, `get_solution`, `search_solutions`, `create_solution`

**Attachments** (1): `get_attachments`

**Utilities** (2): `get_metadata`, `claude_code_command`

### Critical Configuration (City of Burton IT)
- **Base URL**: `https://sc.burtonmi.gov`
- **Instance Name**: `766116682`
- **API Path**: `https://sc.burtonmi.gov/app/766116682/api/v3`
- **Portal Name**: `burtonmi`
- **Client ID env var**: `SDP_CLIENT_ID`
- **Client Secret env var**: `SDP_CLIENT_SECRET`
- **Refresh Token env var**: `SDP_OAUTH_REFRESH_TOKEN`

### Remember
1. This is for Service Desk Plus **CLOUD** (not on-premises)
2. Current implementation is **single-tenant** (multi-tenant deferred)
3. OAuth refresh tokens are **permanent** — one-time setup only
4. Server runs on port **3456**
5. Use `https://sc.burtonmi.gov` as the custom domain
6. Check `example/knowledge/` before implementing anything
7. Never hardcode credentials — use `.env`

### Current Working Implementation
- **Server**: `src/working-sse-server.cjs`
- **API Client**: `src/sdp-api-client-v2.cjs`
- **OAuth**: `src/sdp-oauth-client.cjs`
- **Metadata**: `src/sdp-api-metadata.cjs`
- **Start**: `node src/working-sse-server.cjs`
- **Health check**: `curl http://localhost:3456/health`
