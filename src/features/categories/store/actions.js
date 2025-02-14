export const CategoriesCrudActionTypes = {
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_CATEGORIES: 'SET_CATEGORIES',
};

export const createCategoryAction = (payload) => ({
  type: CategoriesCrudActionTypes.CREATE_CATEGORY,
  payload,
});

export const updateCategoryAction = (payload) => ({
  type: CategoriesCrudActionTypes.UPDATE_CATEGORY,
  payload,
});

export const deleteCategoryAction = (payload) => ({
  type: CategoriesCrudActionTypes.DELETE_CATEGORY,
  payload,
});

export const setCategoriesAction = (payload) => ({
  type: CategoriesCrudActionTypes.SET_CATEGORIES,
  payload,
});
