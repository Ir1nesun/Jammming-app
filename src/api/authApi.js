import { apiFetch } from './apiClient';

export const authApi = {
  me() {
    return apiFetch('/auth/me');
  },
  login(payload) {
    return apiFetch('/auth/login', { method: 'POST', body: payload });
  },
  register(payload) {
    return apiFetch('/auth/register', { method: 'POST', body: payload });
  },
  logout() {
    return apiFetch('/auth/logout', { method: 'POST' });
  },
};
