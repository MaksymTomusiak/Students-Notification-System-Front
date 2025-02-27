import { useState, useEffect, useCallback, useReducer } from 'react';
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0, // Will be updated from backend response
  });
  const { loading, turnOnLoading, turnOffLoading } = useLoading(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchUsers = async () => {
      try {
        turnOnLoading();
        const response = await UserService.getAllUsers(
          pagination.current,
          pagination.pageSize,
          filterQuery, // Send filterQuery as searchQuery to backend
          abortController.signal
        );
        if (isMounted) {
          dispatch({
            type: UsersCrudActionTypes.SET_USERS,
            payload: response.items || response.Items || [], // Adjust based on response structure
          });
          setPagination((prev) => ({
            ...prev,
            total: response.totalCount || response.TotalCount || 0, // Adjust based on response structure
          }));
        }
      } catch (error) {
        message.error(error.response?.data || error.message);
      } finally {
        turnOffLoading();
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [pagination.current, pagination.pageSize, filterQuery]); // Re-fetch when page, pageSize, or filterQuery changes

  const memoizedUserDeleteCallback = useCallback(
    async (id) => {
      try {
        turnOnLoading();
        await UserService.deleteUserById(id);
        message.success('User deleted successfully');

        const response = await UserService.getAllUsers(
          pagination.current,
          pagination.pageSize,
          filterQuery,
          new AbortController().signal
        );

        // Check if the current page has any elements after deletion
        const currentPageItems = response.items || response.Items || [];
        if (currentPageItems.length === 0 && pagination.current > 1) {
          // If current page is empty and not the first page, navigate to the previous page
          const newCurrentPage = pagination.current - 1;
          const prevPageResponse = await UserService.getAllUsers(
            newCurrentPage,
            pagination.pageSize,
            filterQuery,
            new AbortController().signal
          );
          dispatch({
            type: UsersCrudActionTypes.SET_USERS,
            payload: prevPageResponse.items || prevPageResponse.Items || [],
          });
          setPagination((prev) => ({
            ...prev,
            current: newCurrentPage,
            total:
              prevPageResponse.totalCount || prevPageResponse.TotalCount || 0,
          }));
        } else {
          // If current page has elements or it's the first page, update with current page data
          dispatch({
            type: UsersCrudActionTypes.SET_USERS,
            payload: currentPageItems,
          });
          setPagination((prev) => ({
            ...prev,
            total: response.totalCount || response.TotalCount || 0,
          }));
        }
      } catch (error) {
        message.error(error.response?.data || error.message);
      } finally {
        turnOffLoading();
      }
    },
    [filterQuery, pagination.current, pagination.pageSize]
  );

  const handleFilterChange = (e) => {
    setFilterQuery(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  // Remove client-side filtering since it's now handled server-side
  const usersToDisplay = state;

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
          users={usersToDisplay}
          onUserDelete={memoizedUserDeleteCallback}
          pagination={pagination}
          onTableChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default UserComponent;
