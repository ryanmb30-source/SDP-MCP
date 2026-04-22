# Feature Request: Complete SDP REST API Coverage

## Overview

Implement all missing Service Desk Plus Cloud v3 REST API endpoints as MCP tools, expanding the current 25-tool server to cover the remaining useful API surface documented at https://www.manageengine.com/products/service-desk/sdpod-v3-api/

All new tools follow the same patterns established in `src/working-sse-server.cjs` and `src/sdp-api-client-v2.cjs`. All new API methods go in `sdp-api-client-v2.cjs`. All new tool definitions and handlers go in `working-sse-server.cjs`. Update `MCP_TOOLS.md` and `DEVELOPMENT_PLAN.md` when complete.

**Scope:** City of Burton IT is a 2-person team. No Releases module, no Projects module, no delete operations. Assets are auto-discovered via network probe and Endpoint Central Cloud integration — no asset creation needed, only updates.

---

## Module 1: Problems (New — 0 tools currently)

CRUD for the `/api/v3/problems` endpoint (no delete).

### Tools to implement

**`list_problems`**
- `GET /api/v3/problems`
- Params: `limit` (default 25, max 100), `status` (Open, In Progress, Resolved, Closed), `sort_by` (created_time, title, priority), `sort_order` (asc, desc)

**`get_problem`**
- `GET /api/v3/problems/{problem_id}`
- Params: `problem_id` (required)

**`create_problem`**
- `POST /api/v3/problems`
- Params: `title` (required), `description`, `priority` (Low, Medium, High, Urgent), `impact` (Low, Medium, High), `status`
- Payload: `{ "problem": { "title": "...", "priority": { "name": "..." } } }`

**`update_problem`**
- `PUT /api/v3/problems/{problem_id}`
- Params: `problem_id` (required), `title`, `description`, `status`, `priority`, `impact`, `root_cause`, `symptom`, `impact_details`

**`close_problem`**
- `PUT /api/v3/problems/{problem_id}`
- Sets `status: { name: "Closed" }` with closure comments
- Params: `problem_id` (required), `closure_comments`

---

## Module 2: Requests — Missing Operations

The existing request tools are missing several sub-resource operations.

### New tools

**`get_request_tasks`**
- `GET /api/v3/requests/{request_id}/tasks`
- Params: `request_id` (required)

**`add_request_task`**
- `POST /api/v3/requests/{request_id}/tasks`
- Params: `request_id` (required), `title` (required), `description`, `assigned_to_email`, `due_date`

**`update_request_task`**
- `PUT /api/v3/requests/{request_id}/tasks/{task_id}`
- Params: `request_id` (required), `task_id` (required), `title`, `description`, `status`, `assigned_to_email`

**`get_request_worklogs`**
- `GET /api/v3/requests/{request_id}/worklogs`
- Params: `request_id` (required)

**`add_request_worklog`**
- `POST /api/v3/requests/{request_id}/worklogs`
- Params: `request_id` (required), `description` (required), `technician_email`, `hours_spent` (number), `worklog_date`

### Enhancements to existing tools

**`create_request`** — add missing optional fields:
- `urgency` (Low, Normal, High, Urgent)
- `impact` (Low, Medium, High)
- `group` (group name string)
- `site` (site name string)
- `due_by_time` (ISO 8601)
- `on_behalf_of` (email of user on whose behalf request is created)

**`update_request`** — add missing optional fields:
- `urgency`, `impact`, `group`, `site`, `due_by_time`, `update_reason`, `subcategory`

---

## Module 3: Changes — Missing Operations

**`add_change_note`**
- `POST /api/v3/changes/{change_id}/notes`
- Params: `change_id` (required), `note_content` (required), `is_public` (boolean, default true)

---

## Module 4: Solutions — Missing Operations

**`update_solution`**
- `PUT /api/v3/solutions/{solution_id}`
- Params: `solution_id` (required), `title`, `content` (maps to `description` in API payload), `keywords`, `topic`

---

## Module 5: Assets — Missing Operations

Assets are discovered automatically. Tools needed for updating state and assignments only.

**`update_asset`**
- `PUT /api/v3/assets/{asset_id}`
- Params: `asset_id` (required), `name`, `state` (In Use, In Stock, In Repair, Disposed, Expired, Loaned), `asset_tag`, `assigned_user_email`, `location`

---

## Module 6: CMDB — Configuration Items (New — 0 tools currently)

Used to track CIs and record changes against them from requests, patches, and changes. Endpoint: `/api/v3/cmdb/ci`

**`list_cis`**
- `GET /api/v3/cmdb/ci`
- Params: `limit` (default 25, max 100), `ci_type` (filter by CI type name), `search` (search by name), `sort_by`, `sort_order`

**`get_ci`**
- `GET /api/v3/cmdb/ci/{ci_id}`
- Params: `ci_id` (required)
- Returns full CI detail including attributes and relationships

**`search_cis`**
- `GET /api/v3/cmdb/ci` with search criteria
- Params: `query` (required), `limit` (default 25), `ci_type`

**`create_ci`**
- `POST /api/v3/cmdb/ci`
- Params: `name` (required), `ci_type` (required — e.g. Server, Workstation, Switch, Router, Software), `description`, `impact` (Low, Medium, High), `location`, `assigned_user_email`
- Payload: `{ "ci": { "name": "...", "citype": { "name": "..." } } }`

**`update_ci`**
- `PUT /api/v3/cmdb/ci/{ci_id}`
- Params: `ci_id` (required), `name`, `description`, `impact`, `location`, `assigned_user_email`, `status`

**`get_ci_relationships`**
- `GET /api/v3/cmdb/ci/{ci_id}/relationships`
- Params: `ci_id` (required)
- Returns all CIs this CI depends on or is depended on by

**`add_ci_relationship`**
- `POST /api/v3/cmdb/ci/{ci_id}/relationships`
- Params: `ci_id` (required), `related_ci_id` (required), `relationship_type` (e.g. `Depends on`, `Used by`, `Connected to`)

---

## Module 7: Maintenance Windows (New — 0 tools currently)

Used to schedule monthly patch windows and planned maintenance. Endpoint: `/api/v3/maintenance_windows`

**`list_maintenance_windows`**
- `GET /api/v3/maintenance_windows`
- Params: `limit` (default 25), `sort_by` (start_time, name), `sort_order`

**`get_maintenance_window`**
- `GET /api/v3/maintenance_windows/{window_id}`
- Params: `window_id` (required)

**`create_maintenance_window`**
- `POST /api/v3/maintenance_windows`
- Params: `name` (required), `description`, `scheduled_start_time` (ISO 8601, required), `scheduled_end_time` (ISO 8601, required), `ci_ids` (array of CI IDs to include in window)
- Payload: `{ "maintenance_window": { "name": "...", "start_time": { "value": "..." }, "end_time": { "value": "..." } } }`

**`update_maintenance_window`**
- `PUT /api/v3/maintenance_windows/{window_id}`
- Params: `window_id` (required), `name`, `description`, `scheduled_start_time`, `scheduled_end_time`, `ci_ids`

---

## Implementation Notes

### File size limit
`working-sse-server.cjs` and `sdp-api-client-v2.cjs` are approaching the 500-line limit. Split new modules into separate files:
- `src/sdp-api-problems.cjs` — Problems API methods
- `src/sdp-api-cmdb.cjs` — CMDB CI methods
- `src/sdp-api-maintenance.cjs` — Maintenance Windows methods

Require these in `working-sse-server.cjs`. All other new methods (request tasks/worklogs, change notes, solution update, asset update) can be added directly to `sdp-api-client-v2.cjs` as they are small additions.

### File size limit
`working-sse-server.cjs` and `sdp-api-client-v2.cjs` are approaching the 500-line limit. Add Problems API methods to a new file:
- `src/sdp-api-problems.cjs` — Problems API methods

Require it in `working-sse-server.cjs`. All other new methods (request tasks/worklogs, change notes, solution update, asset update) can be added directly to `sdp-api-client-v2.cjs` as they are small additions.

### API payload pattern
All SDP POST/PUT payloads use the module name as the root key:
```javascript
// Problems
{ "problem": { "title": "...", "priority": { "name": "High" } } }

// Request tasks
{ "task": { "title": "...", "description": "..." } }

// Worklogs
{ "worklog": { "description": "...", "hours_spent": 1.5 } }
```

### OAuth scopes needed
Ensure the Zoho self-client OAuth app has these scopes if not already granted:
- `SDPOnDemand.problems.ALL`
- `SDPOnDemand.requests.ALL` (covers tasks and worklogs as sub-resources)
- `SDPOnDemand.changes.ALL` (covers notes)
- `SDPOnDemand.solutions.UPDATE`
- `SDPOnDemand.assets.UPDATE`
- `SDPOnDemand.cmdb.ALL`

### Documentation updates required
- `MCP_TOOLS.md` — add all new tools with parameter tables
- `DEVELOPMENT_PLAN.md` — mark completed items, update tool count
