import { HttpClient } from '../../../utils/http/HttpClient';

export class UserRegistersService {
  static async getUserRegisters(id, page = 1, pageSize = 10, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      timeout: 10000,
      signal,
    });
    return await httpClient.get(
      `/user-registers/${id}?page=${page}&pageSize=${pageSize}`
    );
  }

  static async register(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.post(`/enroll-on-course/${id}`);
  }

  static async unregister(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.delete(`/unregister-from-course/${id}`);
  }
}
