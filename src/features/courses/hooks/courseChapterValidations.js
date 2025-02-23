export const validateChapterName = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter chapter name');
  }
  if (value.trim().length < 5) {
    return Promise.reject('Name must be at least 5 characters long');
  }
  if (value.trim().length > 255) {
    return Promise.reject('Name cannot exceed 255 characters');
  }
  return Promise.resolve();
};

export const validateEstimatedTime = (_, value) => {
  if (!value) {
    return Promise.reject('Please enter estimated time');
  }
  const numValue = Number(value);
  if (isNaN(numValue) || numValue < 1) {
    return Promise.reject('Time must be a positive number');
  }
  return Promise.resolve();
};
