import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import Register from '../features/auth/Register';
import Login from '../features/auth/Login';
import NotFoundPage from '../components/common/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import CategoryPage from '../features/categories/CategoryPage';
import UserPage from '../features/users/UserPage';
import CoursePage from '../features/courses/CoursePage';
import MainPage from '../features/courses/MainPage';
import CourseDetailsPage from '../features/courses/CourseDetailsPage';
import MyCoursesPage from '../features/courses/MyCoursesPage';
import AllCoursesPage from '../features/courses/AllCoursesPage';

const Router = () => {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          {/* Public main page */}
          <Route index element={<MainPage />} />
          {/* Public course details page */}
          <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
          {/* User-only routes (protected) */}
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={['User', 'Admin']}>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-courses"
            element={
              <ProtectedRoute allowedRoles={['User', 'Admin']}>
                <AllCoursesPage />
              </ProtectedRoute>
            }
          />
          {/* Admin-only routes */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <CoursePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
