const BASE_URL = '/api/agents';

export async function fetchAgents(filters = {}) {
  const query = new URLSearchParams();
  if (filters.status && filters.status !== 'all') {
    query.append('status', filters.status);
  }
  if (filters.service_area) {
    query.append('service_area', filters.service_area);
  }
  if (filters.search) {
    query.append('search', filters.search);
  }

  const url = query.toString() ? `${BASE_URL}?${query.toString()}` : BASE_URL;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch agents');
  }
  return data;
}

export async function fetchAgentById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch agent details');
  }
  return data.data;
}

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch statistics');
  }
  return data.data;
}

export async function createAgent(agentData) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentData)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.error || 'Failed to create agent';
    throw new Error(errorMsg);
  }
  return data.data;
}

export async function updateAgent(id, agentData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentData)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.error || 'Failed to update agent';
    throw new Error(errorMsg);
  }
  return data.data;
}

export async function deleteAgent(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete agent');
  }
  return data;
}
