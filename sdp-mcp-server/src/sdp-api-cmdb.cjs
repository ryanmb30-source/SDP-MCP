/**
 * Service Desk Plus CMDB API
 * Configuration Item (CI) management and relationships
 */

class SDPCmdbAPI {
  constructor(client) {
    this.client = client;
  }

  async listCIs(options = {}) {
    const { limit = 25, ci_type, search, sort_field = 'name', sort_order = 'asc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order, get_total_count: true };
    const criteria = [];
    if (ci_type) criteria.push({ field: 'citype.name', condition: 'is', value: ci_type });
    if (search) criteria.push({ field: 'name', condition: 'contains', value: search });
    if (criteria.length === 1) {
      listInfo.search_criteria = criteria;
    } else if (criteria.length > 1) {
      listInfo.search_criteria = criteria.map((c, i) => i > 0 ? { ...c, logical_operator: 'AND' } : c);
    }
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/cmdb/ci', { params });
    return {
      cis: response.data.configuration_items || response.data.cis || [],
      total_count: response.data.list_info?.total_count || 0
    };
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
