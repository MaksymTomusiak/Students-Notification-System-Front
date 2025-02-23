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

  const { loading, turnOnLoading, turnOffLoading } = useLoading(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        turnOnLoading();
        const response = await CategoryService.getAllCategories(
          abortController.signal
        );
        if (isMounted) {
          dispatch({
            type: CategoriesCrudActionTypes.SET_CATEGORIES,
            payload: response,
          });
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        turnOffLoading();
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const memoizedCategoryItemDeleteCallback = useCallback(async (id) => {
    try {
      turnOnLoading();
      await CategoryService.deleteCategoryById(id);
      dispatch({
        type: CategoriesCrudActionTypes.DELETE_CATEGORY,
        payload: { id },
      });
      message.success('Category deleted successfully');
    } catch (error) {
      message.error(error.response?.data || error.message);
    } finally {
      turnOffLoading();
    }
  }, []);

  const memoizedSaveCategoryButtonClickCallback = useCallback(
    async (editCategory) => {
      try {
        const response = await CategoryService.updateCategory(editCategory);
        dispatch({ type: 'UPDATE_CATEGORY', payload: response });
        message.success('Category updated successfully');
      } catch (error) {
        message.error(error.response?.data || error.message);
      }
      return true;
    },
    []
  );

  const handleAddCategory = async (newCategory) => {
    dispatch({
      type: CategoriesCrudActionTypes.CREATE_CATEGORY,
      payload: newCategory,
    });
  };

  const handleFilterChange = (e) => {
    setFilterQuery(e.target.value);
  };

  const filteredCategories = state.filter((category) =>
    Object.entries(category).some(
      ([key, value]) =>
        key !== 'id' &&
        String(value).toLowerCase().includes(filterQuery.toLowerCase())
    )
  );

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
          categories={filteredCategories}
          onCategoryItemDelete={memoizedCategoryItemDeleteCallback}
          onSaveCategoryButtonClick={memoizedSaveCategoryButtonClickCallback}
        />
      </Spin>
    </div>
  );
};

export default CategoryComponent;
