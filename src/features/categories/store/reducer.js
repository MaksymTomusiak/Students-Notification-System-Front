import { CategoriesCrudActionTypes } from './actions';

const categoriesReducer = (state = [], action) => {
  switch (action.type) {
    case CategoriesCrudActionTypes.CREATE_CATEGORY:
      return [
        ...state,
        {
          id: action.payload.id,
          name: action.payload.name,
          description: action.payload.description,
        },
      ];
    case CategoriesCrudActionTypes.UPDATE_CATEGORY:
      return state.map((category) =>
        category.id === action.payload.id
          ? {
              ...category,
              name: action.payload.name,
              description: action.payload.description,
            }
          : category
      );
    case CategoriesCrudActionTypes.DELETE_CATEGORY:
      return state.filter((category) => category.id !== action.payload.id);
    case CategoriesCrudActionTypes.SET_CATEGORIES:
      return action.payload;
    default:
      return state;
  }
};

export default categoriesReducer;
