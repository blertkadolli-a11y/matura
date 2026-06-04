const SUPA_URL = 'https://exwyictcidnidiykpctl.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4d3lpY3RjaWRuaWRpeWtwY3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMzcxMzQsImV4cCI6MjA5NTYxMzEzNH0.RshiMbQ35U0waUIxfO-C7OvKGvdwtg0iCcfdkVHq_-8';

const api = {
  async request(path, method = 'GET', body = null, token = null) {
    const headers = {
      'Content-Type': 'application/json',
      'apikey': SUPA_KEY,
      'Authorization': 'Bearer ' + (token || SUPA_KEY)
    };
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(SUPA_URL + path, opts);
    const data = await res.json();
    return { data, status: res.status, ok: res.ok };
  },

  async signUp(email, password, name) {
    return this.request('/auth/v1/signup', 'POST', {
      email, password, data: { full_name: name }
    });
  },

  async signIn(email, password) {
    return this.request('/auth/v1/token?grant_type=password', 'POST', { email, password });
  },

  async signOut(token) {
    return this.request('/auth/v1/logout', 'POST', {}, token);
  },

  async getUser(token) {
    return this.request('/auth/v1/user', 'GET', null, token);
  },

  async db(table, method = 'GET', body = null, query = '', token = null) {
    return this.request('/rest/v1/' + table + query, method, body, token);
  }
};

// Auth helpers
const auth = {
  getToken() { return localStorage.getItem('matura_token'); },
  getUser() {
    try { return JSON.parse(localStorage.getItem('matura_user')); } catch { return null; }
  },
  isLoggedIn() { return !!this.getToken(); },
  save(token, user) {
    localStorage.setItem('matura_token', token);
    localStorage.setItem('matura_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('matura_token');
    localStorage.removeItem('matura_user');
  },
  requireAuth() {
    if (!this.isLoggedIn()) window.location.href = 'login.html';
  },
  requireGuest() {
    if (this.isLoggedIn()) window.location.href = 'dashboard.html';
  }
};
