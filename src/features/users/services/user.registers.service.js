import { HttpClient } from '../../../utils/http/HttpClient';

export class UserRegistersService {
  static async getUserRegisters(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      timeout: 10000,
      signal,
    });
    return await httpClient.get('/user-registers/' + id);
  }
}
