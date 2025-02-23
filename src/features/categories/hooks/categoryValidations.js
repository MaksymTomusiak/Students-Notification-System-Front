const validateCategoryName = (_, value) => {
  if (!value) {
    return Promise.reject('Please enter name');
  }
  if (value.trim() === '') {
    return Promise.reject('Please enter name');
  }
  if (value.length < 3) {
    return Promise.reject('Name must be at least 3 characters long');
  }
  return Promise.resolve();
};

export default validateCategoryName;
