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
   * @param {number} limit
   * @param {AbortSignal} signal
   */
  static async getPopularCourses(limit, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });
    return await httpClient.get('popular/' + limit);
  }

  /**
   * @param {string} searchQuery - Search term for course name
   * @param {string[]} categoryIds - Array of category IDs to filter by
   * @param {AbortSignal} signal
   */
  static async getFilteredCourses(searchQuery, categoryIds, signal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
      signal,
    });

    // Construct query string for the filtered endpoint
    let queryString = 'filtered';
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', encodeURIComponent(searchQuery));
    }
    if (categoryIds && categoryIds.length > 0) {
      for (let i = 0; i < categoryIds.length; i++) {
        params.append(`categoryIds[${i}]`, encodeURIComponent(categoryIds[i]));
      }
    }

    if (params.toString()) {
      queryString += `?${params.toString()}`;
    }

    return await httpClient.get(queryString);
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
   * @param {object} course - Object with Name, Image, Description, CreatorId, StartDate, FinishDate, Language, Requirements, CategoriesIds
   */
  static async createCourse(course) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/courses`,
    });

    const formData = new FormData();
    Object.entries(course).forEach(([key, value]) => {
      if (key === 'CategoriesIds' && Array.isArray(value)) {
        value.forEach((val, index) => {
          formData.append(`${key}[${index}]`, val);
        });
      } else if (key === 'Image' && value instanceof File) {
        formData.append('Image', value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    console.log(formData);

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
      } else if (key === 'Image' && value instanceof File) {
        formData.append('Image', value);
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
