/**
 * Service Desk Plus Maintenance Windows API
 * Note: endpoint /api/v3/maintenance_windows must be verified against live instance.
 * If endpoint returns 404, tools will return a clear error message.
 */

class SDPMaintenanceAPI {
  constructor(client) {
    this.client = client;
  }

  async listMaintenanceWindows(options = {}) {
    const { limit = 25, sort_field = 'start_time', sort_order = 'asc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order, get_total_count: true };
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/maintenance_windows', { params });
    return {
      maintenance_windows: response.data.maintenance_windows || [],
      total_count: response.data.list_info?.total_count || 0
    };
  }

  async getMaintenanceWindow(windowId) {
    const response = await this.client.get('/maintenance_windows/' + windowId);
    return response.data.maintenance_window;
  }

  async createMaintenanceWindow(data) {
    const maintenance_window = { name: data.name };
    if (data.description) maintenance_window.description = data.description;
    if (data.scheduled_start_time) {
      maintenance_window.start_time = { value: String(new Date(data.scheduled_start_time).getTime()) };
    }
    if (data.scheduled_end_time) {
      maintenance_window.end_time = { value: String(new Date(data.scheduled_end_time).getTime()) };
    }
    if (data.ci_ids && data.ci_ids.length) {
      maintenance_window.configuration_items = data.ci_ids.map(id => ({ id }));
    }
    const params = { input_data: JSON.stringify({ maintenance_window }) };
    const response = await this.client.post('/maintenance_windows', null, { params });
    return response.data.maintenance_window;
  }

  async updateMaintenanceWindow(windowId, updates) {
    const maintenance_window = {};
    if (updates.name) maintenance_window.name = updates.name;
    if (updates.description) maintenance_window.description = updates.description;
    if (updates.scheduled_start_time) {
      maintenance_window.start_time = { value: String(new Date(updates.scheduled_start_time).getTime()) };
    }
    if (updates.scheduled_end_time) {
      maintenance_window.end_time = { value: String(new Date(updates.scheduled_end_time).getTime()) };
    }
    if (updates.ci_ids) {
      maintenance_window.configuration_items = updates.ci_ids.map(id => ({ id }));
    }
    const params = { input_data: JSON.stringify({ maintenance_window }) };
    const response = await this.client.put('/maintenance_windows/' + windowId, null, { params });
    return response.data.maintenance_window;
  }
}

module.exports = { SDPMaintenanceAPI };
