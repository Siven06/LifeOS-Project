const API_BASE = 'http://localhost:8080/api';
const REQUEST_TIMEOUT = 15000;

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      const fetchOptions = { ...options, headers, signal: controller.signal };
      if (options.signal) fetchOptions.signal = options.signal;
      res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
      clearTimeout(timeoutId);
    } catch (err) {
      if (err.name === 'AbortError') throw new Error('Request timed out — please try again');
      throw new Error('Connection failed — is the backend running at ' + API_BASE + '?');
    }

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '/login';
        throw new Error('Session expired — please login again');
      }
      let text;
      try { text = await res.text(); } catch { text = ''; }
      try { const json = JSON.parse(text); throw new Error(json.message || 'Request failed (status ' + res.status + ')'); }
      catch (e) { if (e.message.startsWith('Request failed') || e.message.startsWith('Session')) throw e; }
      throw new Error('Request failed (status ' + res.status + ')');
    }

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Invalid server response (status ' + res.status + ')');
    }
    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },

  del(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  },

  auth: {
    login(email, password) {
      return api.post('/auth/login', { email, password });
    },
    register(name, email, password) {
      return api.post('/auth/register', { name, email, password });
    }
  },

  dashboard: {
    get() {
      return api.get('/dashboard');
    }
  },

  transactions: {
    list(params = {}) {
      const query = new URLSearchParams();
      if (params.type) query.set('type', params.type);
      if (params.category) query.set('category', params.category);
      if (params.start) query.set('start', params.start);
      if (params.end) query.set('end', params.end);
      const qs = query.toString();
      return api.get(`/transactions${qs ? '?' + qs : ''}`);
    },
    create(data) {
      return api.post('/transactions', data);
    },
    update(id, data) {
      return api.put(`/transactions/${id}`, data);
    },
    delete(id) {
      return api.del(`/transactions/${id}`);
    }
  },

  budgets: {
    list() {
      return api.get('/budgets');
    },
    create(data) {
      return api.post('/budgets', data);
    },
    update(id, data) {
      return api.put(`/budgets/${id}`, data);
    },
    delete(id) {
      return api.del(`/budgets/${id}`);
    }
  },

  goals: {
    list() {
      return api.get('/goals');
    },
    create(data) {
      return api.post('/goals', data);
    },
    updateProgress(id, amount) {
      return api.patch(`/goals/${id}/progress`, { amount });
    },
    delete(id) {
      return api.del(`/goals/${id}`);
    }
  },

  users: {
    getProfile() {
      return api.get('/users/me');
    },
    updateProfile(data) {
      return api.patch('/users/me', data);
    }
  },

  alerts: {
    list() {
      return api.get('/alerts');
    },
    count() {
      return api.get('/alerts/count');
    },
    dismiss(id) {
      return api.post(`/alerts/${id}/dismiss`);
    },
    dismissAll() {
      return api.post('/alerts/dismiss-all');
    }
  },

  debts: {
    list() {
      return api.get('/debts');
    },
    getActive() {
      return api.get('/debts/active');
    },
    getSummary() {
      return api.get('/debts/summary');
    },
    get(id) {
      return api.get(`/debts/${id}`);
    },
    create(data) {
      return api.post('/debts', data);
    },
    update(id, data) {
      return api.put(`/debts/${id}`, data);
    },
    delete(id) {
      return api.del(`/debts/${id}`);
    },
    makePayment(id, amount) {
      return api.post(`/debts/${id}/payment`, { amount });
    }
  }
};
