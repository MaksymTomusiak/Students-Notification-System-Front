import { HttpClient } from '../../../utils/http/HttpClient';

export class UserBansService {
  static async getUserBans(userId, page = 1, pageSize = 10, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/bans`,
      signal,
    });
    return await httpClient.get(
      `/by-user/${userId}?page=${page}&pageSize=${pageSize}`
    );
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
