import { HttpClient } from '../../../utils/http/HttpClient';

export class CourseSubChaptersService {
  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async getByChater(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-subchapters`,
      signal,
    });
    return await httpClient.get('/by-chapter/' + id);
  }

  /**
   * @param {object} subchapter
   * @param {AbortSignal} signal
   */
  static async createSubChapter(subchapter, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-subchapters`,
      signal,
    });
    return await httpClient.post('/add', subchapter);
  }

  /**
   * @param {object} subchapter
   * @param {AbortSignal} signal
   */
  static async updateSubChapter(subchapter, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-subchapters`,
      signal,
    });
    return await httpClient.put('/update', subchapter);
  }

  /**
   * @param {[object]} subChapter
   * @param {[number]} numbers
   * @param {AbortSignal} signal
   */
  static async updateSubChaptersOrder(subChaptersIds, numbers, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-subchapters`,
      signal,
    });
    return await httpClient.put('/update-order', {
      subChaptersIds,
      numbers,
    });
  }

  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async deleteSubChapterById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-subchapters`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
