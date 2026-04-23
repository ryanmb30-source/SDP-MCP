/**
 * Service Desk Plus Problems API
 */

class SDPProblemsAPI {
  constructor(client) {
    this.client = client;
  }

  async listProblems(options = {}) {
    const { limit = 25, status, sort_field = 'created_time', sort_order = 'desc' } = options;
    const listInfo = { row_count: limit, start_index: 0, sort_field, sort_order, get_total_count: true };
    if (status) listInfo.search_criteria = [{ field: 'status.name', condition: 'is', value: status }];
    const params = { input_data: JSON.stringify({ list_info: listInfo }) };
    const response = await this.client.get('/problems', { params });
    return {
      problems: response.data.problems || [],
      total_count: response.data.list_info?.total_count || 0
    };
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
