import { HttpClient } from '../../../utils/http/HttpClient';

export class CategoryService {
  /**
   * @param {AbortSignal} signal
   */
  static async getAllCategories(signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/categories`,
      signal,
    });
    return await httpClient.get('');
  }

  /**
   * @param {number} id
   * @param {AbortSignal} signal
   */
  static async getCategoryById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/categories`,
      signal,
    });
    return await httpClient.get(`/${id}`);
  }

  /**
   * @param {object} category
   * @param {AbortSignal} signal
   */
  static async createCategory(category, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/categories`,
      signal,
    });
    return await httpClient.post('/add', category);
  }

  /**
   * @param {object} category
   * @param {AbortSignal} signal
   */
  static async updateCategory(category, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/categories`,
      signal,
    });
    return await httpClient.put('/update', category);
  }

  /**
   * @param {number} id
   * @param {AbortSignal} signal
   */
  static async deleteCategoryById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/categories`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
