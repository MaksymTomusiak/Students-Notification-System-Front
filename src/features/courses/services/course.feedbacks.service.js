import { HttpClient } from '../../../utils/http/HttpClient';

export class CourseFeedbacksService {
  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async getByCourse(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/feedbacks`,
      signal,
    });
    return await httpClient.get('/by-course/' + id);
  }

  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async getByUser(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/feedbacks`,
      signal,
    });
    return await httpClient.get('/by-user/' + id);
  }

  /**
   * @param {object} feedback
   * @param {AbortSignal} signal
   */
  static async createFeedback(feedback, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/feedbacks`,
      signal,
    });
    return await httpClient.post('/add', feedback);
  }

  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async deleteFeedbackById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/feedbacks`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
