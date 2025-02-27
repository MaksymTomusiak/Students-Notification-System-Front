import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useLoading } from '../../../hooks/useLoading';
import { CourseService } from '../services/course.service';
import { Button, Flex, Input, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import coursesReducer from '../store/reducer';
import { CoursesCrudActionTypes } from '../store/actions';
import CourseCard from './main/CourseCard';
import AddCourseModal from './main/AddCourseModal';
import { CategoryService } from '../../categories/services/category.service';

const { Search } = Input;

function CourseComponent() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [state, dispatch] = useReducer(coursesReducer, []);
  const [filterQuery, setFilterQuery] = useState('');
  const { loading, turnOnLoading, turnOffLoading } = useLoading(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCourses = async () => {
      try {
        turnOnLoading();
        const response = await CourseService.getAllCourses(
          abortController.signal
        );
        if (isMounted) {
          dispatch({
            type: CoursesCrudActionTypes.SET_COURSES,
            payload: response,
          });
        }
      } catch (error) {
        message.error(error.message);
      } finally {
        turnOffLoading();
      }
    };

    fetchCourses();

    const fetchCategories = async () => {
      try {
        turnOnLoading();
        const response = await CategoryService.getAllCategories(
          abortController.signal
        );
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:' + error.message);
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

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const memoizedCourseCreateCallback = useCallback(async (newCourse) => {
    try {
      turnOnLoading();
      const response = await CourseService.createCourse(newCourse);
      dispatch({
        type: CoursesCrudActionTypes.CREATE_COURSE,
        payload: response,
      });
      closeAddModal();
      return true;
    } catch (error) {
      message.error(error.response?.data || error.message);
      return false;
    } finally {
      turnOffLoading();
    }
  }, []);

  const memoizedCourseUpdateCallback = useCallback(async (updatedCourse) => {
    try {
      turnOnLoading();
      const response = await CourseService.updateCourse(updatedCourse);
      dispatch({
        type: CoursesCrudActionTypes.UPDATE_COURSE,
        payload: response,
      });
      message.success('Course updated successfully');
      return true;
    } catch (error) {
      message.error(error.response?.data || error.message);
      return false;
    } finally {
      turnOffLoading();
    }
  }, []);

  const memoizedCourseDeleteCallback = useCallback(
    async (id) => {
      if (!id) return;
      try {
        turnOnLoading();
        await CourseService.deleteCourseById(id);
        dispatch({
          type: CoursesCrudActionTypes.DELETE_COURSE,
          payload: { id },
        });
        message.success('Course deleted successfully');
      } catch (error) {
        message.error(error.response?.data || error.message);
      } finally {
        turnOffLoading();
      }
    },
    [turnOnLoading, turnOffLoading, dispatch]
  );

  const handleFilterChange = (e) => {
    setFilterQuery(e.target.value);
  };

  const filteredCourses = state.filter((course) =>
    Object.entries(course).some(
      ([key, value]) =>
        key !== 'id' &&
        String(value).toLowerCase().includes(filterQuery.toLowerCase())
    )
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Flex justify="center" vertical={false} gap="large">
        <Search
          placeholder="Search courses..."
          value={filterQuery}
          onChange={handleFilterChange}
          allowClear
          style={{ marginBottom: '16px', width: '300px' }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Create
        </Button>
      </Flex>

      <Spin spinning={loading}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{ flex: '1 1 calc(50% - 20px)', minWidth: '350px' }}
            >
              <CourseCard
                course={course}
                onDelete={memoizedCourseDeleteCallback}
                categories={categories}
                onUpdate={memoizedCourseUpdateCallback}
              />
            </div>
          ))}
        </div>
      </Spin>

      <AddCourseModal
        open={isAddModalOpen}
        onClose={closeAddModal}
        onSave={memoizedCourseCreateCallback}
        categories={categories}
      />
    </div>
  );
}

export default CourseComponent;
