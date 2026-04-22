# Quick Start Guide — Service Desk Plus MCP Server
# City of Burton IT

Get connected to the Service Desk Plus MCP server in under 10 minutes!

## Prerequisites

- Service Desk Plus OAuth credentials (Client ID & Secret from Zoho self-client)
- Network access to the MCP server on port 3456
- MCP-compatible client (Claude Desktop, VS Code with Copilot, etc.)

## For Remote Users — Quick Connection

### Step 1: Get Your Credentials
1. Create a Self-Client at [Zoho API Console](https://api-console.zoho.com/)
2. Save your Client ID and Client Secret
3. Generate authorization code with ALL scopes (see below)

### Step 2: Send to Administrator
Send these to your MCP administrator:
- Client ID
- Client Secret
- Authorization Code (expires in 10 minutes!)

### Step 3: Configure Your Client
```json
{
  "mcpServers": {
    "service-desk-plus": {
      "command": "npx",
      "args": ["mcp-remote", "http://YOUR-SERVER-IP:3456/sse", "--allow-http"],
      "env": {
        "SDP_CLIENT_ID": "your_client_id",
        "SDP_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

### Step 4: Connect!
Restart your MCP client and start using Service Desk Plus tools.

## Important: OAuth Token Information

**Zoho OAuth refresh tokens are PERMANENT and never expire!** This means:
- ✅ One-time setup only
- ✅ No re-authentication needed
- ✅ Tokens work forever (unless manually revoked)
- ✅ Access tokens (1-hour) are refreshed automatically

## For Administrators — Setup Process

### 1. OAuth Setup (One-Time Per User)

When a user sends you their authorization code:

```bash
# Exchange authorization code for permanent refresh token
node scripts/exchange-code.js
```

### 2. Test API Connection

```bash
# Test with custom domain configuration
node scripts/test-api-custom-domain.js
```

You should see:
- ✅ Connection to custom domain successful
- ✅ OAuth token obtained from Zoho
- ✅ API requests working

### 3. Required OAuth Scopes

```
SDPOnDemand.requests.ALL,SDPOnDemand.problems.ALL,SDPOnDemand.changes.ALL,SDPOnDemand.projects.ALL,SDPOnDemand.assets.ALL,SDPOnDemand.solutions.ALL,SDPOnDemand.setup.READ,SDPOnDemand.general.ALL
```

### 4. Server Configuration

```env
# Service Desk Plus (City of Burton IT)
SDP_BASE_URL=https://sc.burtonmi.gov
SDP_INSTANCE_NAME=766116682
SDP_PORTAL_NAME=burtonmi
SDP_DATA_CENTER=US

# OAuth (from Zoho self-client)
SDP_CLIENT_ID=your_client_id
SDP_CLIENT_SECRET=your_client_secret
SDP_OAUTH_REFRESH_TOKEN=your_permanent_refresh_token

# Server
SDP_HTTP_HOST=0.0.0.0
SDP_HTTP_PORT=3456
```

## Available MCP Tools (25 total)

### Request Management
- `list_requests` — Get service requests with filters
- `create_request` — Create new request
- `update_request` — Update existing request
- `close_request` — Close a request
- `get_request` — Get request details
- `search_requests` — Search by keyword
- `add_note` — Add a public note/comment

### Email & Conversation
- `reply_to_requester` — Send email reply to requester
- `add_private_note` — Add private note (not visible to requester)
- `send_first_response` — Send first response with email notification
- `get_request_conversation` — Get full conversation/notes history

### Asset Management
- `list_assets` — List IT assets
- `get_asset` — Get asset details
- `search_assets` — Search assets by name or tag

### Change Management
- `list_changes` — List change requests
- `get_change` — Get change details
- `create_change` — Create new change request
- `update_change` — Update a change request

### Knowledge Base (Solutions)
- `list_solutions` — List knowledge base articles
- `get_solution` — Get a specific article
- `search_solutions` — Search articles by keyword
- `create_solution` — Create a new article

### Attachments
- `get_attachments` — Get attachments for a request

### Utilities
- `get_metadata` — Get valid field values (priorities, statuses, categories)
- `claude_code_command` — Claude Code integration helper

## Troubleshooting

### API Returns "UNAUTHORISED"
- Verify custom domain is correct: `https://sc.burtonmi.gov`
- Check instance name: `766116682`
- Ensure OAuth token has required scopes

### "Invalid refresh token"
- Token may have been revoked
- Generate new authorization code
- Exchange for new refresh token using `scripts/exchange-code.js`

### Connection Issues
- Verify server is running: `curl http://localhost:3456/health`
- Check firewall allows port 3456

## Quick Test Commands

After setup, try these in your MCP client:

1. **List recent requests**: "Show me the last 5 service requests"
2. **Create a request**: "Create a service request for printer not working"
3. **Check tools**: "What SDP tools are available?"
4. **Get metadata**: "What priority values are available in SDP?"

## Support

- **Setup Guide**: `docs/OAUTH_SETUP.md`
- **Full Tool Reference**: `MCP_TOOLS.md`
- **Architecture**: `docs/MULTI_USER_SETUP.md`
