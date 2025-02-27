import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { Input, Spin, message } from 'antd';
import CategoriesTable from './CategoriesTable';
import AddCategoryForm from '../AddCategoryForm';
import categoriesReducer from '../../store/reducer';
import { CategoriesCrudActionTypes } from '../../store/actions';
import { CategoryService } from '../../services/category.service';
import { useLoading } from '../../../../hooks/useLoading';

const { Search } = Input;

const CategoryComponent = () => {
  const [state, dispatch] = useReducer(categoriesReducer, []);
  const [filterQuery, setFilterQuery] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3, // Keep as specified
    total: 0, // Will be updated from backend response
  });
  const { loading, turnOnLoading, turnOffLoading } = useLoading(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        turnOnLoading();
        const response = await CategoryService.getAllCategoriesPaginated(
          pagination.current,
          pagination.pageSize,
          filterQuery, // Send filterQuery as searchQuery to backend
          abortController.signal
        );
        if (isMounted) {
          dispatch({
            type: CategoriesCrudActionTypes.SET_CATEGORIES,
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

    fetchCategories();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [pagination.current, pagination.pageSize, filterQuery]); // Re-fetch when page, pageSize, or filterQuery changes

  const memoizedCategoryItemDeleteCallback = useCallback(
    async (id) => {
      try {
        turnOnLoading();
        await CategoryService.deleteCategoryById(id);
        message.success('Category deleted successfully');

        // Refetch the current page to get updated data
        const response = await CategoryService.getAllCategoriesPaginated(
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
          const prevPageResponse =
            await CategoryService.getAllCategoriesPaginated(
              newCurrentPage,
              pagination.pageSize,
              filterQuery,
              new AbortController().signal
            );
          dispatch({
            type: CategoriesCrudActionTypes.SET_CATEGORIES,
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
            type: CategoriesCrudActionTypes.SET_CATEGORIES,
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

  const memoizedSaveCategoryButtonClickCallback = useCallback(
    async (editCategory) => {
      try {
        turnOnLoading();
        await CategoryService.updateCategory(editCategory);
        message.success('Category updated successfully');
        const refreshResponse = await CategoryService.getAllCategoriesPaginated(
          pagination.current,
          pagination.pageSize,
          filterQuery,
          new AbortController().signal
        );
        dispatch({
          type: CategoriesCrudActionTypes.SET_CATEGORIES,
          payload: refreshResponse.items || refreshResponse.Items || [],
        });
        setPagination((prev) => ({
          ...prev,
          total: refreshResponse.totalCount || refreshResponse.TotalCount || 0,
        }));
        return true;
      } catch (error) {
        message.error(error.response?.data || 'Failed to update category');
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [filterQuery]
  );

  const handleAddCategory = useCallback(
    async (newCategory) => {
      try {
        turnOnLoading();
        await CategoryService.createCategory(newCategory);
        message.success('Category added successfully');
        // Refetch only the current page, maintaining pagination and filterQuery
        const response = await CategoryService.getAllCategoriesPaginated(
          pagination.current,
          pagination.pageSize,
          filterQuery,
          new AbortController().signal
        );
        dispatch({
          type: CategoriesCrudActionTypes.SET_CATEGORIES,
          payload: response.items || response.Items || [],
        });
        setPagination((prev) => ({
          ...prev,
          total: response.totalCount || response.TotalCount || 0,
        }));
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
  const categoriesToDisplay = state;

  return (
    <div>
      <Search
        placeholder="Search categories..."
        value={filterQuery}
        onChange={handleFilterChange}
        allowClear
        style={{ marginBottom: '16px', width: '300px' }}
      />
      <AddCategoryForm onAddCategory={handleAddCategory} />
      <Spin spinning={loading}>
        <CategoriesTable
          categories={categoriesToDisplay}
          onCategoryItemDelete={memoizedCategoryItemDeleteCallback}
          onSaveCategoryButtonClick={memoizedSaveCategoryButtonClickCallback}
          pagination={pagination}
          onTableChange={handleTableChange}
        />
      </Spin>
    </div>
  );
};

export default CategoryComponent;
