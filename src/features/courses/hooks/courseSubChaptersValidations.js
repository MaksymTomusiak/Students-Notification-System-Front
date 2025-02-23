export const validateSubChapterName = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter subchapter name');
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

export const validateSubChapterContent = (_, value) => {
  if (!value || value.trim() === '') {
    return Promise.reject('Please enter subchapter content');
  }
  if (value.trim().length < 10) {
    return Promise.reject('Content must be at least 10 characters long');
  }
  if (value.trim().length > 2000) {
    return Promise.reject('Content cannot exceed 2000 characters');
  }
  return Promise.resolve();
};
