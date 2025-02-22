export const useValidateCourse = () => {
  const validateCourse = (course) => {
    if (course.name.trim().length < 5) {
      return 'The course name must be at least 5 letters long';
    }
    if (course.name.trim().length > 255) {
      return 'The course name must be less than 255 letters long';
    }
    if (course.imageUrl.trim().length === 0) {
      return 'The course image URL is required';
    }
    if (course.imageUrl.trim().length > 1000) {
      return 'The course image URL must be less than 1000 letters long';
    }
    if (course.description.trim().length < 10) {
      return 'The course description must be at least 10 letters long';
    }
    if (course.description.trim().length > 1000) {
      return 'The course description must be less than 1000 letters long';
    }
    if (course.language.trim().length === 0) {
      return 'The course language is required';
    }
    if (course.language.trim().length > 255) {
      return 'The course language must be less than 255 letters long';
    }
    if (course.requirements.trim().length === 0) {
      return 'The course requirements are required';
    }
    if (course.requirements.trim().length > 1000) {
      return 'The course requirements must be less than 1000 letters long';
    }
    if (course.startDate == null) {
      return 'The course start date is required';
    }
    if (course.finishDate == null) {
      return 'The course finish date is required';
    }
    return '';
  };
  return {
    validateCourse,
  };
};
