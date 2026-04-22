# PRP: Expand SDP API Coverage
*Generated from INITIAL.md — April 2026*

---

## Goal

Expand the MCP server from 25 tools to ~48 tools by implementing all missing SDP Cloud v3 REST API endpoints relevant to City of Burton IT operations. No delete operations. No Projects or Releases modules.

---

## Acceptance Criteria

- [ ] All new tools appear in `tools/list` response
- [ ] All new tools have working handlers that call the SDP API
- [ ] All new API client methods use the existing `Zoho-oauthtoken` auth interceptor
- [ ] All new tool responses return `{ content: [{ type: 'text', text: JSON.stringify(..., null, 2) }] }`
- [ ] All new tools documented in `MCP_TOOLS.md`
- [ ] `DEVELOPMENT_PLAN.md` updated with new tool count
- [ ] No single source file exceeds 500 lines
- [ ] Server starts cleanly: `node src/working-sse-server.cjs`

---

## Existing Patterns to Follow

### Tool definition (in `working-sse-server.cjs` `tools` array)
```javascript
{
  name: 'tool_name',
  description: 'What this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      required_param: { type: 'string', description: '...' },
      optional_param: { type: 'number', default: 25, maximum: 100 }
    },
    required: ['required_param']
  }
}
```

### Tool implementation (in `toolImplementations` object)
```javascript
async tool_name(params) {
  try {
    const { required_param, optional_param = 25 } = params;
    if (!required_param) throw new Error('required_param is required');
    const result = await sdpClient.methodName(required_param, { optional_param });
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (error) {
    throw new Error(`Failed to do thing: ${error.message}`);
  }
}
```

### API client method (in `sdp-api-client-v2.cjs` or new module file)
```javascript
async methodName(id, options = {}) {
  const params = { input_data: JSON.stringify({ payload_key: { field: value } }) };
  const response = await this.client.get('/endpoint/' + id, { params });
  return response.data.result_key;
}
```

### SDP API payload convention
Every POST/PUT wraps data in the module name:
```javascript
{ "problem": { ... } }
{ "task": { ... } }
{ "worklog": { ... } }
{ "ci": { ... } }
{ "maintenance_window": { ... } }
```

---

## File Structure

### New files to create
- `sdp-mcp-server/src/sdp-api-problems.cjs` — Problems API methods
- `sdp-mcp-server/src/sdp-api-cmdb.cjs` — CMDB CI methods
- `sdp-mcp-server/src/sdp-api-maintenance.cjs` — Maintenance Windows methods

### Files to modify
- `sdp-mcp-server/src/sdp-api-client-v2.cjs` — add request tasks/worklogs, change notes, solution update, asset update; require new module files
- `sdp-mcp-server/src/working-sse-server.cjs` — require new modules, add tool definitions + handlers
- `sdp-mcp-server/MCP_TOOLS.md` — document all new tools
- `DEVELOPMENT_PLAN.md` — update tool count and completed items

---

## Implementation Tasks

### Task 1 — Create `sdp-api-problems.cjs`

New file. Exports a `SDPProblemsAPI` class that receives the axios `client` instance from `SDPAPIClientV2`.

```javascript
// src/sdp-api-problems.cjs
class SDPProblemsAPI {
  constructor(client) { this.client = client; }

  async listProblems(options = {}) {
    const { limit = 25, status, sort_field = 'created_time', sort_order = 'desc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order, get_total_count: true };
    if (status) listInfo.search_criteria = [{ field: 'status.name', condition: 'is', value: status }];
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/problems', { params });
    return { problems: response.data.problems || [], total_count: response.data.list_info?.total_count || 0 };
  }

  async getProblem(problemId) {
    const response = await this.client.get('/problems/' + problemId);
    return response.data.problem;
  }

  async createProblem(data) {
    const problem = { title: data.title };
    if (data.description) problem.description = data.description;
    if (data.priority) problem.priority = { name: data.priority };
    if (data.impact) problem.impact = { name: data.impact };
    if (data.status) problem.status = { name: data.status };
    const params = { input_data: JSON.stringify({ problem }) };
    const response = await this.client.post('/problems', null, { params });
    return response.data.problem;
  }

  async updateProblem(problemId, updates) {
    const problem = {};
    if (updates.title) problem.title = updates.title;
    if (updates.description) problem.description = updates.description;
    if (updates.status) problem.status = { name: updates.status };
    if (updates.priority) problem.priority = { name: updates.priority };
    if (updates.impact) problem.impact = { name: updates.impact };
    if (updates.root_cause) problem.root_cause = updates.root_cause;
    if (updates.symptom) problem.symptom = updates.symptom;
    if (updates.impact_details) problem.impact_details = updates.impact_details;
    const params = { input_data: JSON.stringify({ problem }) };
    const response = await this.client.put('/problems/' + problemId, null, { params });
    return response.data.problem;
  }

  async closeProblem(problemId, closureComments) {
    const problem = { status: { name: 'Closed' } };
    if (closureComments) problem.closure_comments = closureComments;
    const params = { input_data: JSON.stringify({ problem }) };
    const response = await this.client.put('/problems/' + problemId, null, { params });
    return response.data.problem;
  }
}
module.exports = { SDPProblemsAPI };
```

In `SDPAPIClientV2` constructor, add:
```javascript
const { SDPProblemsAPI } = require('./sdp-api-problems.cjs');
this.problems = new SDPProblemsAPI(this.client);
```

Add pass-through methods on `SDPAPIClientV2`:
```javascript
async listProblems(options) { return this.problems.listProblems(options); }
async getProblem(id) { return this.problems.getProblem(id); }
async createProblem(data) { return this.problems.createProblem(data); }
async updateProblem(id, updates) { return this.problems.updateProblem(id, updates); }
async closeProblem(id, comments) { return this.problems.closeProblem(id, comments); }
```

**Tool definitions to add** (5 tools):

| Tool | Method | Required params |
|---|---|---|
| `list_problems` | GET /problems | none |
| `get_problem` | GET /problems/{id} | `problem_id` |
| `create_problem` | POST /problems | `title` |
| `update_problem` | PUT /problems/{id} | `problem_id` |
| `close_problem` | PUT /problems/{id} | `problem_id` |

---

### Task 2 — Add Request Sub-Resources to `sdp-api-client-v2.cjs`

Add these methods to the `SDPAPIClientV2` class (small enough to stay in the main file):

```javascript
// REQUEST TASKS
async getRequestTasks(requestId) {
  const response = await this.client.get('/requests/' + requestId + '/tasks');
  return response.data.tasks || [];
}

async addRequestTask(requestId, taskData) {
  const task = { title: taskData.title };
  if (taskData.description) task.description = taskData.description;
  if (taskData.assigned_to_email) task.owner = { email_id: taskData.assigned_to_email };
  if (taskData.due_date) task.due_date = { value: taskData.due_date };
  const params = { input_data: JSON.stringify({ task }) };
  const response = await this.client.post('/requests/' + requestId + '/tasks', null, { params });
  return response.data.task;
}

async updateRequestTask(requestId, taskId, updates) {
  const task = {};
  if (updates.title) task.title = updates.title;
  if (updates.description) task.description = updates.description;
  if (updates.status) task.status = { name: updates.status };
  if (updates.assigned_to_email) task.owner = { email_id: updates.assigned_to_email };
  const params = { input_data: JSON.stringify({ task }) };
  const response = await this.client.put('/requests/' + requestId + '/tasks/' + taskId, null, { params });
  return response.data.task;
}

// REQUEST WORKLOGS
async getRequestWorklogs(requestId) {
  const response = await this.client.get('/requests/' + requestId + '/worklogs');
  return response.data.worklogs || [];
}

async addRequestWorklog(requestId, worklogData) {
  const worklog = { description: worklogData.description };
  if (worklogData.technician_email) worklog.technician = { email_id: worklogData.technician_email };
  if (worklogData.hours_spent) worklog.time_spent = String(worklogData.hours_spent * 60); // SDP uses minutes
  if (worklogData.worklog_date) worklog.worklog_date = { value: worklogData.worklog_date };
  const params = { input_data: JSON.stringify({ worklog }) };
  const response = await this.client.post('/requests/' + requestId + '/worklogs', null, { params });
  return response.data.worklog;
}
```

**Tool definitions to add** (5 tools): `get_request_tasks`, `add_request_task`, `update_request_task`, `get_request_worklogs`, `add_request_worklog`

---

### Task 3 — Enhance `create_request` and `update_request`

In `sdp-api-client-v2.cjs` `createRequest` method, add handling for:
- `urgency` → `request.urgency = { name: urgency }`
- `impact` → `request.impact = { name: impact }`
- `site` → `request.site = { name: site }`
- `due_by_time` → `request.due_by_time = { value: due_by_time }`
- `on_behalf_of` → `request.on_behalf_of = { email_id: on_behalf_of }`

In `updateRequest` method, add same fields plus:
- `update_reason` → `request.update_reason = update_reason`

In `working-sse-server.cjs`, update `create_request` and `update_request` tool schemas and handler destructuring to include these new params.

---

### Task 4 — Add `add_change_note` to `sdp-api-client-v2.cjs`

```javascript
async addChangeNote(changeId, noteContent, isPublic = true) {
  const note = { description: noteContent, show_to_requester: isPublic };
  const params = { input_data: JSON.stringify({ note }) };
  const response = await this.client.post('/changes/' + changeId + '/notes', null, { params });
  return response.data.note;
}
```

**Tool definition** (1 tool): `add_change_note`

---

### Task 5 — Add `update_solution` to `sdp-api-client-v2.cjs`

```javascript
async updateSolution(solutionId, updates) {
  const solution = {};
  if (updates.title) solution.title = updates.title;
  if (updates.content) solution.description = updates.content; // API field is 'description'
  if (updates.keywords) solution.keywords = updates.keywords;
  if (updates.topic) solution.topic = { name: updates.topic };
  const params = { input_data: JSON.stringify({ solution }) };
  const response = await this.client.put('/solutions/' + solutionId, null, { params });
  return response.data.solution;
}
```

**Tool definition** (1 tool): `update_solution`

---

### Task 6 — Add `update_asset` to `sdp-api-client-v2.cjs`

```javascript
async updateAsset(assetId, updates) {
  const asset = {};
  if (updates.name) asset.name = updates.name;
  if (updates.state) asset.asset_state = { name: updates.state };
  if (updates.asset_tag) asset.asset_tag = updates.asset_tag;
  if (updates.assigned_user_email) asset.used_by = { email_id: updates.assigned_user_email };
  if (updates.location) asset.location = { name: updates.location };
  const params = { input_data: JSON.stringify({ asset }) };
  const response = await this.client.put('/assets/' + assetId, null, { params });
  return response.data.asset;
}
```

**Tool definition** (1 tool): `update_asset`

---

### Task 7 — Create `sdp-api-cmdb.cjs`

```javascript
class SDPCmdbAPI {
  constructor(client) { this.client = client; }

  async listCIs(options = {}) {
    const { limit = 25, ci_type, search, sort_field = 'name', sort_order = 'asc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order, get_total_count: true };
    const criteria = [];
    if (ci_type) criteria.push({ field: 'citype.name', condition: 'is', value: ci_type });
    if (search) criteria.push({ field: 'name', condition: 'contains', value: search });
    if (criteria.length) listInfo.search_criteria = criteria;
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/cmdb/ci', { params });
    return { cis: response.data.configuration_items || response.data.cis || [], total_count: response.data.list_info?.total_count || 0 };
  }

  async getCI(ciId) {
    const response = await this.client.get('/cmdb/ci/' + ciId);
    return response.data.ci || response.data.configuration_item;
  }

  async searchCIs(query, options = {}) {
    return this.listCIs({ ...options, search: query });
  }

  async createCI(data) {
    const ci = { name: data.name, citype: { name: data.ci_type } };
    if (data.description) ci.description = data.description;
    if (data.impact) ci.impact = { name: data.impact };
    if (data.location) ci.location = { name: data.location };
    if (data.assigned_user_email) ci.used_by = { email_id: data.assigned_user_email };
    const params = { input_data: JSON.stringify({ ci }) };
    const response = await this.client.post('/cmdb/ci', null, { params });
    return response.data.ci || response.data.configuration_item;
  }

  async updateCI(ciId, updates) {
    const ci = {};
    if (updates.name) ci.name = updates.name;
    if (updates.description) ci.description = updates.description;
    if (updates.impact) ci.impact = { name: updates.impact };
    if (updates.location) ci.location = { name: updates.location };
    if (updates.assigned_user_email) ci.used_by = { email_id: updates.assigned_user_email };
    if (updates.status) ci.status = { name: updates.status };
    const params = { input_data: JSON.stringify({ ci }) };
    const response = await this.client.put('/cmdb/ci/' + ciId, null, { params });
    return response.data.ci || response.data.configuration_item;
  }

  async getCIRelationships(ciId) {
    const response = await this.client.get('/cmdb/ci/' + ciId + '/relationships');
    return response.data.relationships || [];
  }

  async addCIRelationship(ciId, relatedCiId, relationshipType) {
    const relationship = {
      relationship_type: { name: relationshipType },
      related_ci: { id: relatedCiId }
    };
    const params = { input_data: JSON.stringify({ relationship }) };
    const response = await this.client.post('/cmdb/ci/' + ciId + '/relationships', null, { params });
    return response.data.relationship;
  }
}
module.exports = { SDPCmdbAPI };
```

**Tool definitions to add** (7 tools): `list_cis`, `get_ci`, `search_cis`, `create_ci`, `update_ci`, `get_ci_relationships`, `add_ci_relationship`

---

### Task 8 — Create `sdp-api-maintenance.cjs`

> **Important**: The `/api/v3/maintenance_windows` endpoint must be verified against the live SDP instance before implementing handlers. The endpoint may differ. Implement optimistically and handle 404 gracefully with a clear error message.

```javascript
class SDPMaintenanceAPI {
  constructor(client) { this.client = client; }

  async listMaintenanceWindows(options = {}) {
    const { limit = 25, sort_field = 'start_time', sort_order = 'asc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order };
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/maintenance_windows', { params });
    return { maintenance_windows: response.data.maintenance_windows || [], total_count: response.data.list_info?.total_count || 0 };
  }

  async getMaintenanceWindow(windowId) {
    const response = await this.client.get('/maintenance_windows/' + windowId);
    return response.data.maintenance_window;
  }

  async createMaintenanceWindow(data) {
    const maintenance_window = { name: data.name };
    if (data.description) maintenance_window.description = data.description;
    if (data.scheduled_start_time) maintenance_window.start_time = { value: new Date(data.scheduled_start_time).getTime().toString() };
    if (data.scheduled_end_time) maintenance_window.end_time = { value: new Date(data.scheduled_end_time).getTime().toString() };
    if (data.ci_ids && data.ci_ids.length) maintenance_window.configuration_items = data.ci_ids.map(id => ({ id }));
    const params = { input_data: JSON.stringify({ maintenance_window }) };
    const response = await this.client.post('/maintenance_windows', null, { params });
    return response.data.maintenance_window;
  }

  async updateMaintenanceWindow(windowId, updates) {
    const maintenance_window = {};
    if (updates.name) maintenance_window.name = updates.name;
    if (updates.description) maintenance_window.description = updates.description;
    if (updates.scheduled_start_time) maintenance_window.start_time = { value: new Date(updates.scheduled_start_time).getTime().toString() };
    if (updates.scheduled_end_time) maintenance_window.end_time = { value: new Date(updates.scheduled_end_time).getTime().toString() };
    if (updates.ci_ids) maintenance_window.configuration_items = updates.ci_ids.map(id => ({ id }));
    const params = { input_data: JSON.stringify({ maintenance_window }) };
    const response = await this.client.put('/maintenance_windows/' + windowId, null, { params });
    return response.data.maintenance_window;
  }
}
module.exports = { SDPMaintenanceAPI };
```

**Tool definitions to add** (4 tools): `list_maintenance_windows`, `get_maintenance_window`, `create_maintenance_window`, `update_maintenance_window`

---

## Tool Count Summary

| Module | New Tools | Running Total |
|---|---|---|
| Starting point | — | 25 |
| Problems | 5 | 30 |
| Request tasks | 3 | 33 |
| Request worklogs | 2 | 35 |
| Changes | 1 | 36 |
| Solutions | 1 | 37 |
| Assets | 1 | 38 |
| CMDB | 7 | 45 |
| Maintenance Windows | 4 | 49 |
| **Total** | **24** | **49** |

---

## OAuth Scopes Checklist

Before testing, confirm these scopes are on your Zoho self-client:
- [ ] `SDPOnDemand.problems.ALL`
- [ ] `SDPOnDemand.requests.ALL`
- [ ] `SDPOnDemand.changes.ALL`
- [ ] `SDPOnDemand.solutions.UPDATE`
- [ ] `SDPOnDemand.assets.UPDATE`
- [ ] `SDPOnDemand.cmdb.ALL`

---

## Validation Checklist

After implementation, verify each tool group manually:

**Problems**
- [ ] `list_problems` returns array with status/priority
- [ ] `get_problem` returns full problem detail
- [ ] `create_problem` creates record in SDP
- [ ] `update_problem` updates root cause / status
- [ ] `close_problem` sets status to Closed

**Request Sub-Resources**
- [ ] `get_request_tasks` returns task list for a known request
- [ ] `add_request_task` creates a task on a request
- [ ] `update_request_task` changes task status
- [ ] `get_request_worklogs` returns worklog entries
- [ ] `add_request_worklog` records time spent

**Changes**
- [ ] `add_change_note` adds note to a change

**Solutions**
- [ ] `update_solution` modifies existing article

**Assets**
- [ ] `update_asset` changes asset state (e.g. In Use → In Stock)

**CMDB**
- [ ] `list_cis` returns CI list
- [ ] `get_ci` returns CI detail
- [ ] `search_cis` filters by name
- [ ] `create_ci` creates a new CI
- [ ] `update_ci` modifies CI attributes
- [ ] `get_ci_relationships` returns relationships
- [ ] `add_ci_relationship` links two CIs

**Maintenance Windows**
- [ ] `list_maintenance_windows` returns windows (or clear error if endpoint doesn't exist)
- [ ] `create_maintenance_window` creates a patch window with start/end time

---

## Execution Order

1. Task 1 — Problems module (highest value, fully documented API)
2. Task 7 — CMDB module (actively used, CI tracking)
3. Task 2 — Request tasks & worklogs
4. Task 3 — Enhance create/update request
5. Task 4 — Change notes
6. Task 5 — Solution update
7. Task 6 — Asset update
8. Task 8 — Maintenance Windows (verify endpoint first)
9. Update `MCP_TOOLS.md` and `DEVELOPMENT_PLAN.md`
