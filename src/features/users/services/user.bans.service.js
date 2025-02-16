import { HttpClient } from '../../../utils/http/HttpClient';

export class UserBansService {
  static async getUserBans(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/bans`,
      timeout: 10000,
      signal,
    });
    return await httpClient.get('/by-user/' + id);
  }

  static async banUser(ban, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/bans`,
      signal,
    });
    return await httpClient.post('/add', { ...ban });
  }

  static async unbanUser(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/bans`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
