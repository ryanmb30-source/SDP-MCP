# SDP MCP Server — Tool Reference
# City of Burton IT | 25 Tools

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
| `subcategory` | string | No | Subcategory name (often required by instance) |
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

Returns: array of notes with author, timestamp, visibility, and content.

---

## Technicians (3 tools — stubs)

> **Note**: The `/api/v3/users` endpoint does not exist in Service Desk Plus Cloud API v3. These tools return informative stub responses. Technician info is embedded in request objects when retrieved. Use `technician_email` directly when assigning tickets.

### `list_technicians`
Returns a message explaining the endpoint limitation.

### `get_technician`
Returns a message explaining the endpoint limitation.

### `find_technician`
Returns a message explaining the endpoint limitation with the search term echoed back.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `search_term` | string | **Yes** | Name or email to search for |

---

## Asset Management (3 tools)

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

## Change Management (4 tools)

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

## Knowledge Base / Solutions (4 tools)

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

## Attachments (1 tool)

### `get_attachments`
Get all attachments for a request.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `request_id` | string | **Yes** | ID of the request |

Returns: array of attachment objects with name, size, and download info.

---

## Utilities (2 tools)

### `get_metadata`
Get valid field values for priorities, statuses, categories, and templates. Call this first to understand what values are valid for your SDP instance.

No parameters required.

Returns: `priorities`, `statuses`, `categories`, `templates` arrays.

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
| Email & Conversation | reply, private_note, first_response, conversation | 4 |
| Technicians (stubs) | list, get, find | 3 |
| Assets | list, get, search | 3 |
| Changes | list, get, create, update | 4 |
| Solutions | list, get, search, create | 4 |
| Attachments | get | 1 |
| Utilities | get_metadata, claude_code_command | 2 |
| **Total** | | **28** |

> Note: `list_technicians`, `get_technician`, and `find_technician` are stub tools that return informative messages explaining the `/users` endpoint does not exist in SDP Cloud API v3.
