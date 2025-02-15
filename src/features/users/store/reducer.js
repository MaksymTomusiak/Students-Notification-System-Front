import { UsersCrudActionTypes } from './actions';

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case UsersCrudActionTypes.DELETE_USER:
      return state.filter((user) => user.id !== action.payload.id);
    case UsersCrudActionTypes.SET_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default usersReducer;
