import { useState, useEffect, useReducer, useCallback } from 'react';
import { useLoading } from '../../../hooks/useLoading';
import { UserService } from '../services/user.service';
import { Input, Spin, message } from 'antd';
import usersReducer from '../store/reducer';
import { UsersCrudActionTypes } from '../store/actions';
import UserTable from './table/main/UserTable';

const { Search } = Input;

const UserComponent = () => {
  const [state, dispatch] = useReducer(usersReducer, []);

  const [filterQuery, setFilterQuery] = useState('');
  const { loading, turnOnLoading, turnOffLoading } = useLoading(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchUsers = async () => {
      try {
        turnOnLoading();
        const response = await UserService.getAllUsers(abortController.signal);
        if (isMounted) {
          dispatch({
            type: UsersCrudActionTypes.SET_USERS,
            payload: response,
          });
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        turnOffLoading();
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const memoizedUserDeleteCallback = useCallback(async (id) => {
    try {
      turnOnLoading();
      await UserService.deleteUserById(id);
      dispatch({ type: UsersCrudActionTypes.DELETE_USER, payload: { id } });
      message.success('User deleted successfully');
    } catch (error) {
      message.error(error.response?.data || error.message);
    } finally {
      turnOffLoading();
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilterQuery(e.target.value);
  };

  const filteredUsers = state.filter((user) =>
    Object.entries(user).some(
      ([key, value]) =>
        key !== 'id' &&
        String(value).toLowerCase().includes(filterQuery.toLowerCase())
    )
  );

  return (
    <div>
      <Search
        placeholder="Search users..."
        value={filterQuery}
        onChange={handleFilterChange}
        allowClear
        style={{ marginBottom: '16px', width: '300px' }}
      />
      <Spin spinning={loading}>
        <UserTable
          users={filteredUsers}
          onUserDelete={memoizedUserDeleteCallback}
        />
      </Spin>
    </div>
  );
};

export default UserComponent;
