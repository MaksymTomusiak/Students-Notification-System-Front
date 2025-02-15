export const UsersCrudActionTypes = {
  DELETE_USER: 'DELETE_USER',
  SET_USERS: 'SET_USERS',
};
export const deleteUserAction = (payload) => ({
  type: UsersCrudActionTypes.DELETE_USER,
  payload,
});

export const setUsersAction = (payload) => ({
  type: UsersCrudActionTypes.SET_USERS,
  payload,
});
