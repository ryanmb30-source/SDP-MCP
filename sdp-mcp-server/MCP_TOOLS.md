# SDP MCP Server — Tool Reference
# City of Burton IT | 49 Tools

All tools are available via the SSE endpoint at `http://your-server:3456/sse`.

---

## Request Management (7 tools)

### `list_requests`
List service desk requests with optional filters.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 10, max: 100) |
| `status` | string | No | `open`, `closed`, `pending`, `resolved`, `cancelled` |
| `priority` | string | No | `low`, `medium`, `high`, `urgent` |
| `sort_by` | string | No | `created_time`, `due_by_time`, `subject`, `priority` |
| `sort_order` | string | No | `asc`, `desc` (default: `desc`) |

---

### `get_request`
Get detailed information about a specific request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | The SDP request ID |

---

### `create_request`
Create a new service desk request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `subject` | string | **Yes** | Subject/title (max 250 chars) |
| `description` | string | No | Detailed description (HTML supported) |
| `priority` | string | No | `low`, `medium`, `high`, `urgent` (applied after creation) |
| `category` | string | No | Category name |
| `subcategory` | string | No | Subcategory name |
| `urgency` | string | No | `Low`, `Normal`, `High`, `Urgent` |
| `impact` | string | No | `Low`, `Medium`, `High` |
| `group` | string | No | Group name to assign |
| `site` | string | No | Site name |
| `due_by_time` | string | No | ISO 8601 due date |
| `on_behalf_of` | string | No | Email of user on whose behalf request is created |
| `requester_email` | string | No | Email of the requester |
| `technician_id` | string | No | ID of technician to assign |
| `technician_email` | string | No | Email of technician to assign |

**Note**: Priority is skipped on creation due to SDP business rule 4002 — use `update_request` to set it afterward.

---

### `update_request`
Update an existing request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request to update |
| `subject` | string | No | New subject (max 250 chars) |
| `description` | string | No | New description |
| `status` | string | No | `open`, `pending`, `resolved`, `closed` |
| `priority` | string | No | `low`, `medium`, `high`, `urgent` |
| `category` | string | No | New category |
| `subcategory` | string | No | New subcategory |
| `urgency` | string | No | New urgency level |
| `impact` | string | No | New impact level |
| `group` | string | No | New group assignment |
| `site` | string | No | New site |
| `due_by_time` | string | No | New due date (ISO 8601) |
| `update_reason` | string | No | Reason for the update |
| `technician_id` | string | No | ID of technician to assign |
| `technician_email` | string | No | Email of technician to assign |

---

### `close_request`
Close a request with resolution details.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request to close |
| `closure_comments` | string | No | Resolution/closure comments |
| `closure_code` | string | No | `Resolved`, `Cancelled`, `Duplicate` (default: `Resolved`) |

---

### `search_requests`
Search requests by keyword (searches subject field).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **Yes** | Search term |
| `limit` | number | No | Max results (default: 10, max: 100) |

---

### `add_note`
Add a public note/comment to a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `note_content` | string | **Yes** | Content of the note |
| `is_public` | boolean | No | Visible to requester (default: `true`) |

---

## Request Tasks (3 tools)

### `get_request_tasks`
Get all tasks associated with a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |

---

### `add_request_task`
Add a task to a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `title` | string | **Yes** | Task title |
| `description` | string | No | Task description |
| `assigned_to_email` | string | No | Email of technician to assign task to |
| `due_date` | string | No | ISO 8601 due date |

---

### `update_request_task`
Update an existing task on a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `task_id` | string | **Yes** | ID of the task |
| `title` | string | No | New task title |
| `description` | string | No | New description |
| `status` | string | No | New task status |
| `assigned_to_email` | string | No | New assignee email |

---

## Request Worklogs (2 tools)

### `get_request_worklogs`
Get all worklog/time entries for a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |

---

### `add_request_worklog`
Add a worklog/time entry to a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `description` | string | **Yes** | Description of work done |
| `technician_email` | string | No | Email of technician who did the work |
| `hours_spent` | number | No | Hours spent (e.g. `1.5`) |
| `worklog_date` | string | No | ISO 8601 date of work |

---

## Email & Conversation (4 tools)

### `reply_to_requester`
Send an email reply to the requester (appears in ticket conversation).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request to reply to |
| `reply_message` | string | **Yes** | The reply message content |
| `mark_first_response` | boolean | No | Mark as first response (default: `false`) |

---

### `add_private_note`
Add a private note not visible to the requester.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `note_content` | string | **Yes** | Content of the private note |
| `notify_technician` | boolean | No | Notify assigned technician (default: `true`) |

---

### `send_first_response`
Send the official first response (marks SLA first response time and emails requester).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |
| `response_message` | string | **Yes** | The first response message content |

---

### `get_request_conversation`
Get the full notes/conversation history for a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |

---

## Problems (5 tools)

### `list_problems`
List problem records with optional filters.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25, max: 100) |
| `status` | string | No | `Open`, `In Progress`, `Resolved`, `Closed` |
| `sort_by` | string | No | `created_time`, `title`, `priority` |
| `sort_order` | string | No | `asc`, `desc` |

---

### `get_problem`
Get detailed information about a specific problem.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `problem_id` | string | **Yes** | The problem ID |

---

### `create_problem`
Create a new problem record.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | **Yes** | Problem title |
| `description` | string | No | Detailed description |
| `priority` | string | No | `Low`, `Medium`, `High`, `Urgent` |
| `impact` | string | No | `Low`, `Medium`, `High` |
| `status` | string | No | Initial status |

---

### `update_problem`
Update an existing problem record.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `problem_id` | string | **Yes** | ID of the problem |
| `title` | string | No | New title |
| `description` | string | No | New description |
| `status` | string | No | New status |
| `priority` | string | No | `Low`, `Medium`, `High`, `Urgent` |
| `impact` | string | No | `Low`, `Medium`, `High` |
| `root_cause` | string | No | Root cause analysis |
| `symptom` | string | No | Problem symptoms |
| `impact_details` | string | No | Impact description |

---

### `close_problem`
Close a problem record.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `problem_id` | string | **Yes** | ID of the problem |
| `closure_comments` | string | No | Closure notes |

---

## Technicians (3 tools — stubs)

> **Note**: The `/api/v3/users` endpoint does not exist in Service Desk Plus Cloud API v3. These tools return informative stub responses. Technician info is embedded in request objects when retrieved. Use `technician_email` directly when assigning tickets.

### `list_technicians` / `get_technician` / `find_technician`
Return a message explaining the endpoint limitation.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search_term` | string | Yes (find only) | Name or email to search for |

---

## Asset Management (4 tools)

### `list_assets`
List IT assets with optional filters.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25, max: 100) |
| `search` | string | No | Search by asset name |
| `state` | string | No | `In Use`, `In Stock`, `In Repair`, `Disposed`, `Expired`, `Loaned` |
| `sort_by` | string | No | `name`, `asset_tag`, `state`, `asset_type` |
| `sort_order` | string | No | `asc`, `desc` |

---

### `get_asset`
Get detailed information about a specific asset.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `asset_id` | string | **Yes** | The asset ID |

---

### `search_assets`
Search assets by name or tag.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **Yes** | Search term |
| `limit` | number | No | Max results (default: 25) |
| `state` | string | No | Filter by asset state |

---

### `update_asset`
Update an existing asset record (state, assignment, location).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `asset_id` | string | **Yes** | The asset ID |
| `name` | string | No | New asset name |
| `state` | string | No | `In Use`, `In Stock`, `In Repair`, `Disposed`, `Expired`, `Loaned` |
| `asset_tag` | string | No | New asset tag |
| `assigned_user_email` | string | No | Email of user to assign asset to |
| `location` | string | No | Asset location |

---

## Change Management (5 tools)

### `list_changes`
List change requests with optional status filter.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25, max: 100) |
| `status` | string | No | `Requested`, `Planning`, `Awaiting Approval`, `Approved`, `Rejected`, `In Progress`, `Completed`, `Closed`, `Cancelled` |
| `sort_by` | string | No | `created_time`, `scheduled_start_time`, `title`, `priority` |
| `sort_order` | string | No | `asc`, `desc` |

---

### `get_change`
Get detailed information about a specific change request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `change_id` | string | **Yes** | The change ID |

---

### `create_change`
Create a new change request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | **Yes** | Change request title |
| `description` | string | No | Detailed description |
| `change_type` | string | No | `Minor`, `Standard`, `Major`, `Emergency` |
| `priority` | string | No | `Low`, `Medium`, `High`, `Urgent` |
| `risk` | string | No | `Low`, `Medium`, `High`, `Very High` |
| `scheduled_start_time` | string | No | ISO 8601 datetime |
| `scheduled_end_time` | string | No | ISO 8601 datetime |

---

### `update_change`
Update an existing change request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `change_id` | string | **Yes** | ID of the change to update |
| `title` | string | No | New title |
| `description` | string | No | New description |
| `status` | string | No | `Requested`, `Planning`, `Awaiting Approval`, `Approved`, `In Progress`, `Completed`, `Closed`, `Cancelled` |
| `change_type` | string | No | Change type |
| `priority` | string | No | Priority level |
| `risk` | string | No | Risk level |

---

### `add_change_note`
Add a note to a change request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `change_id` | string | **Yes** | ID of the change |
| `note_content` | string | **Yes** | Note content |
| `is_public` | boolean | No | Visible to requester (default: `true`) |

---

## Knowledge Base / Solutions (5 tools)

### `list_solutions`
List knowledge base articles.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25, max: 100) |
| `search` | string | No | Filter by title keyword |
| `sort_by` | string | No | `created_time`, `title`, `views` |
| `sort_order` | string | No | `asc`, `desc` |

---

### `get_solution`
Get a specific knowledge base article.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `solution_id` | string | **Yes** | The solution ID |

---

### `search_solutions`
Search knowledge base articles by keyword.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **Yes** | Search term |
| `limit` | number | No | Max results (default: 25) |

---

### `create_solution`
Create a new knowledge base article.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | string | **Yes** | Article title |
| `content` | string | **Yes** | Article body content |
| `keywords` | string | No | Comma-separated keywords |
| `topic` | string | No | Topic/category name |

---

### `update_solution`
Update an existing knowledge base article.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `solution_id` | string | **Yes** | The solution ID |
| `title` | string | No | New title |
| `content` | string | No | New body content |
| `keywords` | string | No | New keywords |
| `topic` | string | No | New topic/category |

---

## CMDB — Configuration Items (7 tools)

### `list_cis`
List configuration items from the CMDB.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25, max: 100) |
| `ci_type` | string | No | Filter by CI type (e.g. `Server`, `Workstation`, `Switch`) |
| `search` | string | No | Search by CI name |
| `sort_by` | string | No | Field to sort by (default: `name`) |
| `sort_order` | string | No | `asc`, `desc` |

---

### `get_ci`
Get detailed information about a specific CI.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ci_id` | string | **Yes** | The CI ID |

---

### `search_cis`
Search configuration items by name.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | **Yes** | Search term |
| `limit` | number | No | Max results (default: 25) |
| `ci_type` | string | No | Filter by CI type |

---

### `create_ci`
Create a new configuration item in the CMDB.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | CI name |
| `ci_type` | string | **Yes** | CI type (e.g. `Server`, `Workstation`, `Switch`, `Router`, `Software`) |
| `description` | string | No | CI description |
| `impact` | string | No | `Low`, `Medium`, `High` |
| `location` | string | No | Physical/logical location |
| `assigned_user_email` | string | No | Email of responsible user |

---

### `update_ci`
Update an existing configuration item.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ci_id` | string | **Yes** | The CI ID |
| `name` | string | No | New name |
| `description` | string | No | New description |
| `impact` | string | No | `Low`, `Medium`, `High` |
| `location` | string | No | New location |
| `assigned_user_email` | string | No | New responsible user email |
| `status` | string | No | New status |

---

### `get_ci_relationships`
Get all relationships for a CI (dependencies, connections, etc.).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ci_id` | string | **Yes** | The CI ID |

---

### `add_ci_relationship`
Add a relationship between two CIs.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `ci_id` | string | **Yes** | Source CI ID |
| `related_ci_id` | string | **Yes** | Target CI ID |
| `relationship_type` | string | **Yes** | e.g. `Depends on`, `Used by`, `Connected to` |

---

## Maintenance Windows (4 tools)

### `list_maintenance_windows`
List scheduled maintenance windows.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `limit` | number | No | Max results (default: 25) |
| `sort_order` | string | No | `asc`, `desc` (default: `asc`) |

---

### `get_maintenance_window`
Get details of a specific maintenance window.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `window_id` | string | **Yes** | The maintenance window ID |

---

### `create_maintenance_window`
Create a scheduled maintenance window (e.g. monthly patch Tuesday).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `name` | string | **Yes** | Window name |
| `scheduled_start_time` | string | **Yes** | ISO 8601 start datetime |
| `scheduled_end_time` | string | **Yes** | ISO 8601 end datetime |
| `description` | string | No | Window description |
| `ci_ids` | array | No | Array of CI IDs to include in window |

---

### `update_maintenance_window`
Update an existing maintenance window.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `window_id` | string | **Yes** | The maintenance window ID |
| `name` | string | No | New name |
| `description` | string | No | New description |
| `scheduled_start_time` | string | No | New start datetime (ISO 8601) |
| `scheduled_end_time` | string | No | New end datetime (ISO 8601) |
| `ci_ids` | array | No | Updated list of CI IDs |

---

## Attachments (1 tool)

### `get_attachments`
Get all attachments for a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |

---

## Utilities (2 tools)

### `get_metadata`
Get valid field values for priorities, statuses, categories, and templates. Call this first to understand what values are valid for your SDP instance.

No parameters required.

---

### `claude_code_command`
Get instructions for Claude Code integration tasks.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `command` | string | **Yes** | `open_project`, `create_file`, `read_file`, `write_file`, `list_files`, `run_command`, `git_status`, `git_commit` |
| `project_path` | string | No | Path to project or file |
| `args` | array | No | Additional arguments |

---

## Summary Table

| Category | Tools | Count |
|---|---|---|
| Request Management | list, get, create, update, close, search, add_note | 7 |
| Request Tasks | get_tasks, add_task, update_task | 3 |
| Request Worklogs | get_worklogs, add_worklog | 2 |
| Email & Conversation | reply, private_note, first_response, conversation | 4 |
| Problems | list, get, create, update, close | 5 |
| Technicians (stubs) | list, get, find | 3 |
| Assets | list, get, search, update | 4 |
| Changes | list, get, create, update, add_note | 5 |
| Solutions | list, get, search, create, update | 5 |
| CMDB | list, get, search, create, update, get_relationships, add_relationship | 7 |
| Maintenance Windows | list, get, create, update | 4 |
| Attachments | get | 1 |
| Utilities | get_metadata, claude_code_command | 2 |
| **Total** | | **52** |

> Note: `list_technicians`, `get_technician`, and `find_technician` are stub tools — the `/users` endpoint does not exist in SDP Cloud API v3.
> Note: Maintenance Windows endpoint (`/api/v3/maintenance_windows`) should be verified against your live SDP instance before use.
