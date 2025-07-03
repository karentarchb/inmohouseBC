import { environment } from '../../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ADMIN_TEST: `${API_BASE_URL}/api/auth/admin-test`,
  },
  PROPERTIES: {
    GET_ALL: `${API_BASE_URL}/api/properties`,
    CREATE: `${API_BASE_URL}/api/properties`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/properties/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/properties/${id}`,
  },
  USERS: {
    GET_ALL: `${API_BASE_URL}/api/users`,
    GET_AGENTS: `${API_BASE_URL}/api/users/agents`,
    CREATE: `${API_BASE_URL}/api/users`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/users/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/users/${id}`,
  },
  STATS: {
    GET_SUMMARY: `${API_BASE_URL}/api/stats/summary`
  }
};
