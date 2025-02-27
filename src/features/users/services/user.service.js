import { HttpClient } from '../../../utils/http/HttpClient';

export class UserService {
  /**
   * @param {number} page
   * @param {number} pageSize
   * @param {string} searchQuery - Search term for user properties (e.g., email, username)
   * @param {AbortSignal} signal
   */
  static async getAllUsers(page = 1, pageSize = 10, searchQuery = '', signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      timeout: 10000,
      signal,
    });
    let url = `?page=${page}&pageSize=${pageSize}`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }
    return await httpClient.get(url);
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
    return await httpClient.put('/update', { ...user });
  }

  static async deleteUserById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }

  static initiateFacebookLogin(returnUrl) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    // Construct the Facebook login URL with returnUrl as a query param
    const facebookLoginUrl = `${apiUrl}/users/login/facebook?returnUrl=${encodeURIComponent(
      returnUrl
    )}`;
    // Redirect the browser to the backend's Facebook login endpoint
    window.location.href = facebookLoginUrl;
  }
}
