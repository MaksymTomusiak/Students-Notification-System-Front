import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space } from 'antd';

const { Header } = Layout;

const adminPages = [
  { label: 'Home', key: 'home', path: '/' },
  { label: 'Users', key: 'users', path: '/users' },
  { label: 'Categories', key: 'categories', path: '/categories' },
  { label: 'Courses', key: 'courses', path: '/courses' },
];

const userPages = [{ label: 'Home', key: 'home', path: '/' }];

const AppHeader = () => {
  const navigate = useNavigate();

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const pages = user?.role === 'Admin' ? adminPages : userPages;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(0);
  };

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{ flex: 1 }}
        items={pages.map((page) => ({
          key: page.key,
          label: <Link to={page.path}>{page.label}</Link>,
        }))}
      />

      <Space>
        {!user ? (
          <>
            <Button type="default">
              <Link to="/login">Login</Link>
            </Button>
            <Button type="primary">
              <Link to="/register">Register</Link>
            </Button>
          </>
        ) : (
          <>
            <span style={{ color: 'white' }}>Welcome, {user.name}</span>
            <Button type="default" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;
