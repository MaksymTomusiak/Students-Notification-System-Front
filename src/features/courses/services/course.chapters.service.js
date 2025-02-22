import { HttpClient } from '../../../utils/http/HttpClient';

export class CourseChaptersService {
  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async getByCourse(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-chapters`,
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
      baseURL: `${apiUrl}/course-chapters`,
      signal,
    });
    return await httpClient.get('/by-user/' + id);
  }

  /**
   * @param {object} chapter
   * @param {AbortSignal} signal
   */
  static async createChapter(chapter, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-chapters`,
      signal,
    });
    return await httpClient.post('/add', chapter);
  }

  /**
   * @param {object} chapter
   * @param {AbortSignal} signal
   */
  static async updateChapter(chapter, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-chapters`,
      signal,
    });
    return await httpClient.put('/update', chapter);
  }

  /**
   * @param {[object]} chapter
   * @param {[number]} numbers
   * @param {AbortSignal} signal
   */
  static async updateChaptersOrder(chaptersIds, numbers, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-chapters`,
      signal,
    });
    return await httpClient.put('/update-order', {
      chaptersIds,
      numbers,
    });
  }

  /**
   * @param {string} id
   * @param {AbortSignal} signal
   */
  static async deleteChapterById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/course-chapters`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
