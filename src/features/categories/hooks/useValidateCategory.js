export const useValidateCategory = () => {
  const validateCategory = (name) => {
    if (name.trim().length < 3) {
      return 'The category name must be at least 3 letters long';
    }
    if (name.trim().length > 255) {
      return 'The category name must be less than 255 letters long';
    }
    return '';
  };
  return {
    validateCategory,
  };
};
