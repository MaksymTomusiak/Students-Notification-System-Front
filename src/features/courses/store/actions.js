export const CoursesCrudActionTypes = {
  CREATE_COURSE: 'CREATE_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
  SET_COURSES: 'SET_COURSES',
};

export const createCourseAction = (payload) => ({
  type: CoursesCrudActionTypes.CREATE_COURSE,
  payload,
});

export const updateCourseAction = (payload) => ({
  type: CoursesCrudActionTypes.UPDATE_COURSE,
  payload,
});

export const deleteCourseAction = (payload) => ({
  type: CoursesCrudActionTypes.DELETE_COURSE,
  payload,
});

export const setCoursesAction = (payload) => ({
  type: CoursesCrudActionTypes.SET_COURSES,
  payload,
});
