import { environment } from '../../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${environment.apiBaseUrl}/api/auth/login`,
    REGISTER: `${environment.apiBaseUrl}/api/auth/register`,
    ADMIN_TEST: `${environment.apiBaseUrl}/api/auth/admin-test`,
  },
  PROPERTIES: {
    GET_ALL: `${environment.apiBaseUrl}/api/properties`,
    CREATE: `${environment.apiBaseUrl}/api/properties`,
    UPDATE: (id: number) => `${environment.apiBaseUrl}/api/properties/${id}`,
    DELETE: (id: number) => `${environment.apiBaseUrl}/api/properties/${id}`,
  },
  USERS: {
    GET_ALL: `${environment.apiBaseUrl}/api/users`,
    GET_AGENTS: `${environment.apiBaseUrl}/api/users/agents`,
    CREATE: `${environment.apiBaseUrl}/api/users`,
    UPDATE: (id: number) => `${environment.apiBaseUrl}/api/users/${id}`,
    DELETE: (id: number) => `${environment.apiBaseUrl}/api/users/${id}`,
  },
  STATS: {
    GET_SUMMARY: `${environment.apiBaseUrl}/api/stats/summary`
  }
};
