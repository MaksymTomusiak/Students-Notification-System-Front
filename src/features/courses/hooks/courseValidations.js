export const validateCourseName = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter course name');
  }
  if (value.trim().length < 5) {
    return Promise.reject('Name must be at least 5 characters long');
  }
  if (value.trim().length > 255) {
    return Promise.reject('Name must be less than 255 characters long');
  }
  return Promise.resolve();
};

export const validateDescription = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter description');
  }
  if (value.trim().length < 10) {
    return Promise.reject('Description must be at least 10 characters long');
  }
  if (value.trim().length > 1000) {
    return Promise.reject('Description must be less than 1000 characters long');
  }
  return Promise.resolve();
};

export const validateLanguage = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter language');
  }
  if (value.trim().length > 255) {
    return Promise.reject('Language must be less than 255 characters long');
  }
  return Promise.resolve();
};

export const validateRequirements = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter requirements');
  }
  if (value.trim().length > 1000) {
    return Promise.reject(
      'Requirements must be less than 1000 characters long'
    );
  }
  return Promise.resolve();
};

export const validateDates = (_, dates) => {
  if (!dates || !dates[0] || !dates[1]) {
    return Promise.reject('Please select both start and finish dates');
  }
  return Promise.resolve();
};
