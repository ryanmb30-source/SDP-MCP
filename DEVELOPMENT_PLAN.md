# Service Desk Plus Cloud MCP Server — Development Plan

*Project Location: `C:\SDP-MCP\SDP-MCP-fork\sdp-mcp-server\`*  
*Last Updated: April 22, 2026*

---

## Current Status: Production — Single-Tenant

The server is fully operational with **52 tools** exposed over SSE on port 3456.  
Architecture is intentionally single-tenant.

### Working Implementation Files
| File | Purpose |
|---|---|
| `src/working-sse-server.cjs` | Main SSE server — MCP protocol + all 52 tools |
| `src/sdp-api-client-v2.cjs` | SDP API client — all CRUD, email, search, assets, changes, solutions, problems, tasks, worklogs |
| `src/sdp-oauth-client.cjs` | OAuth singleton with global refresh lock |
| `src/sdp-api-metadata.cjs` | Metadata retrieval (priorities, statuses, categories) |
| `src/sdp-api-users.cjs` | Technician stubs (users endpoint doesn't exist in SDP Cloud v3) |
| `src/sdp-api-problems.cjs` | Problems module — list, get, create, update, close |
| `src/sdp-api-cmdb.cjs` | CMDB module — CI list, get, create, update, relationships |
| `src/sdp-api-maintenance.cjs` | Maintenance Windows module (endpoint TBC against live instance) |
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

### Tools (52 total)
- [x] **Requests (7):** list, get, create (+ urgency/impact/on_behalf_of), update, close, search, add_note
- [x] **Email & Conversation (4):** reply_to_requester, add_private_note, send_first_response, get_request_conversation
- [x] **Request Tasks (3):** get_request_tasks, add_request_task, update_request_task
- [x] **Request Worklogs (2):** get_request_worklogs, add_request_worklog
- [x] **Technicians (3, stubs):** list_technicians, get_technician, find_technician
- [x] **Assets (4):** list_assets, get_asset, search_assets, update_asset
- [x] **Changes (5):** list_changes, get_change, create_change, update_change, add_change_note
- [x] **Solutions (5):** list_solutions, get_solution, search_solutions, create_solution, update_solution
- [x] **Problems (5):** list_problems, get_problem, create_problem, update_problem, close_problem
- [x] **CMDB (7):** list_cis, get_ci, search_cis, create_ci, update_ci, get_ci_relationships, add_ci_relationship
- [x] **Maintenance Windows (4):** list_maintenance_windows, get_maintenance_window, create_maintenance_window, update_maintenance_window
- [x] **Attachments (1):** get_attachments
- [x] **Utilities (2):** get_metadata, claude_code_command

### Bug Fixes Applied
- [x] Priority mapping typo: `'z - Medium'` → `'2 - Normal'` (3 locations in api client)
- [x] `createSolution` field: `content` → `description` to match SDP API
- [x] Default domain fallback updated to `sc.burtonmi.gov` / `766116682`
- [x] Removed hardcoded OAuth credentials from `sdp-oauth-client.cjs`
- [x] Startup validation: throws on missing `SDP_CLIENT_ID` / `SDP_CLIENT_SECRET`

### Documentation
- [x] `CLAUDE.md` — complete rewrite for City of Burton IT, multi-tenant references removed
- [x] `MCP_TOOLS.md` — full parameter reference for all 52 tools
- [x] `.env.example` — sanitized placeholders, DB/Redis/multi-tenant blocks removed
- [x] `DEVELOPMENT_PLAN.md` — this file
- [x] `PRPs/expand-api-coverage.md` — PRP used to drive the April 2026 expansion

---

## Next Steps

### Verification Needed
- [ ] Test `list_problems` / `create_problem` against live SDP Cloud instance
- [ ] Test `list_cis` / `create_ci` against live CMDB endpoints
- [ ] Verify `/api/v3/maintenance_windows` endpoint exists — returns 404 on instances where it's not enabled
- [ ] Confirm Zoho self-client OAuth scopes include `SDPOnDemand.problems.ALL` and `SDPOnDemand.cmdb.ALL`

### Quality Improvements
- [ ] `create_request`: verify `technician_email` assignment passes through to the API
- [ ] `update_request` / `create_request`: confirm `subcategory` passthrough reaches the API

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
