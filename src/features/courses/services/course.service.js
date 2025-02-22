import { HttpClient } from '../../../utils/http/HttpClient';

export class CourseService {
  /**
   * @param {AbortSignal} signal
   */
  static async getAllCourses(signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });
    return await httpClient.get('');
  }

  /**
   * @param {number} id
   * @param {AbortSignal} signal
   */
  static async getCourseById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });
    return await httpClient.get(`/${id}`);
  }

  /**
   * @param {object} course
   */
  static async createCourse(course) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
    });

    const formData = new FormData();
    Object.entries(course).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val, index) => {
          formData.append(`${key}[${index}]`, val);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return await httpClient.post('/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * @param {object} course
   * @param {AbortSignal} signal
   */
  static async updateCourse(course, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });

    const formData = new FormData();
    Object.entries(course).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val, index) => {
          formData.append(`${key}[${index}]`, val);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return await httpClient.put('/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * @param {number} id
   * @param {AbortSignal} signal
   */
  static async deleteCourseById(id, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });
    return await httpClient.delete(`/delete/${id}`);
  }
}
