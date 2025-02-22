import { CoursesCrudActionTypes } from './actions';

const coursesReducer = (state = [], action) => {
  switch (action.type) {
    case CoursesCrudActionTypes.CREATE_COURSE:
      return [
        ...state,
        {
          ...action.payload,
        },
      ];

    case CoursesCrudActionTypes.UPDATE_COURSE:
      return state.map((course) =>
        course.id === action.payload.id
          ? {
              ...course,
              ...action.payload,
            }
          : course
      );
    case CoursesCrudActionTypes.DELETE_COURSE:
      return state.filter((course) => course.id !== action.payload.id);
    case CoursesCrudActionTypes.SET_COURSES:
      return action.payload;
    default:
      return state;
  }
};

export default coursesReducer;
