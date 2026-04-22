# Service Desk Plus Cloud MCP Server — Development Plan

*Project Location: `C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server\`*  
*Last Updated: April 2026*

---

## Current Status: Production — Single-Tenant

The server is fully operational with 25 tools exposed over SSE on port 3456.  
Architecture is intentionally single-tenant while MCP protocol matures.

### Working Implementation Files
| File | Purpose |
|---|---|
| `src/working-sse-server.cjs` | Main SSE server — MCP protocol + all 25 tools |
| `src/sdp-api-client-v2.cjs` | SDP API client — all CRUD, email, search, assets, changes, solutions |
| `src/sdp-oauth-client.cjs` | OAuth singleton with global refresh lock |
| `src/sdp-api-metadata.cjs` | Metadata retrieval (priorities, statuses, categories) |
| `src/sdp-api-users.cjs` | Technician stubs (users endpoint doesn't exist in SDP Cloud v3) |
| `src/utils/error-logger.cjs` | Structured API error logging |

### Start the Server
```bash
cd C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server
node src/working-sse-server.cjs
```

---

## Completed Work

### Infrastructure
- [x] SSE server with direct MCP JSON-RPC 2.0 protocol (no SDK dependency)
- [x] OAuth singleton with global refresh lock — prevents rate limiting
- [x] Smart token refresh — only on 401, not 404/400
- [x] `.env`-based configuration, no hardcoded credentials
- [x] Security hardening — `.gitignore` covers token cache and error logs
- [x] `require('dotenv').config()` at entry point

### Tools (25 total)
- [x] **Requests (7):** list, get, create, update, close, search, add_note
- [x] **Email & Conversation (4):** reply_to_requester, add_private_note, send_first_response, get_request_conversation
- [x] **Technicians (3, stubs):** list_technicians, get_technician, find_technician
- [x] **Assets (3):** list_assets, get_asset, search_assets
- [x] **Changes (4):** list_changes, get_change, create_change, update_change
- [x] **Solutions (4):** list_solutions, get_solution, search_solutions, create_solution
- [x] **Attachments (1):** get_attachments
- [x] **Utilities (2):** get_metadata, claude_code_command

### Bug Fixes Applied
- [x] Priority mapping typo: `'z - Medium'` → `'2 - Normal'` (3 locations in api client)
- [x] `createSolution` field: `content` → `description` to match SDP API
- [x] Default domain fallback updated to `sc.burtonmi.gov` / `766116682`
- [x] Removed hardcoded OAuth credentials from `sdp-oauth-client.cjs`
- [x] Startup validation: throws on missing `SDP_CLIENT_ID` / `SDP_CLIENT_SECRET`

### Documentation
- [x] `CLAUDE.md` — complete rewrite for City of Burton IT
- [x] `MCP_TOOLS.md` — full parameter reference for all 25 tools
- [x] `QUICK_START.md` — updated with correct config and all 25 tools
- [x] `.env.example` — sanitized placeholders, no real credentials
- [x] `DEVELOPMENT_PLAN.md` — this file

---

## Next Steps

### Priority 1 — Problems Module (New Tools)
SDP Cloud has a full Problems API (`/api/v3/problems`) with no MCP tools yet.

Tools to add:
- `list_problems` — list with status/priority filters
- `get_problem` — get problem details
- `create_problem` — create a problem record
- `update_problem` — update status, assignee, root cause
- `link_request_to_problem` — associate a request with a problem

Implementation: add methods to `sdp-api-client-v2.cjs`, register tools in `working-sse-server.cjs`, update `MCP_TOOLS.md`.

---

### Priority 2 — Projects Module (New Tools)
SDP Cloud has a Projects API (`/api/v3/projects`) with no MCP tools yet.

Tools to add:
- `list_projects` — list active projects
- `get_project` — get project details with milestones
- `create_project` — create a new project
- `update_project` — update status and details

---

### Priority 3 — Tool Quality Improvements
- `create_request`: verify `technician_email` assignment actually passes through to the API (schema exists, handler needs verification)
- `create_solution`: tool schema still labels the body field `content` — rename to `description` to match what the API client now sends (cosmetic but confusing)
- `update_request` / `create_request`: add `subcategory` passthrough to API client (schema has it, client may drop it)

---

### Priority 4 — Additional Request Operations
- `delete_request` — permanent delete (requires appropriate OAuth scope)
- `link_asset_to_request` — associate a CI/asset with a request
- `get_request_timelog` — retrieve time log entries

---

## Configuration Reference

```bash
# Required
SDP_CLIENT_ID=your-zoho-client-id
SDP_CLIENT_SECRET=your-zoho-client-secret
SDP_OAUTH_REFRESH_TOKEN=your-permanent-refresh-token

# Instance
SDP_BASE_URL=https://sc.burtonmi.gov
SDP_INSTANCE_NAME=766116682
SDP_PORTAL_NAME=burtonmi
SDP_DATA_CENTER=US

# Server
SDP_HTTP_PORT=3456
SDP_HTTP_HOST=0.0.0.0
```

## Key Architecture Decisions

| Decision | Rationale |
|---|---|
| CommonJS (.cjs) over ESM | Avoids ES module/CommonJS interop conflicts in Node.js |
| Direct JSON-RPC over SDK SSEServerTransport | SDK transport had reliability issues with Claude Code client |
| Singleton OAuth client | Prevents concurrent refresh attempts hitting Zoho rate limits |
| Refresh only on 401 | 404/400 errors were incorrectly triggering token refreshes |
| Single-tenant for now | MCP stateful connections don't suit per-connection credential injection |
| No priority on create | SDP business rule 4002 rejects priority at creation — set via update |
