import { environment } from '../../../../environments/environment';

const API_BASE_URL = environment.apiBaseUrl;

export const AUTH_API_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
};
