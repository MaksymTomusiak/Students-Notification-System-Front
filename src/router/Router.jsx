import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import Register from '../features/auth/Register';
import Login from '../features/auth/Login';
import NotFoundPage from '../components/common/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import CategoryPage from '../features/categories/CategoryPage';
import UserPage from '../features/users/UserPage';

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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
