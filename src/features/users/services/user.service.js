import { HttpClient } from '../../../utils/http/HttpClient';

export class UserService {
  static async getAllUsers(signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      timeout: 10000,
      signal,
    });
    return await httpClient.get('');
  }

  static async loginUser(user, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.post('/login', { ...user });
  }

  static async registerUser(user, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.post('/register', { ...user });
  }

  static async updateUser(user, signal) {
    console.warn('user', user);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.put('/update', { ...user.profile, ...user });
  }

  static async deleteUserById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
