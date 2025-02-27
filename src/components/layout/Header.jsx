import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space } from 'antd';

const { Header } = Layout;

const adminPages = [
  { label: 'Home', key: 'home', path: '/' },
  { label: 'Users', key: 'users', path: '/users' },
  { label: 'Categories', key: 'categories', path: '/categories' },
  { label: 'Courses', key: 'courses', path: '/courses' },
  { label: 'All Courses', key: 'all-courses', path: '/all-courses' },
  { label: 'My Courses', key: 'my-courses', path: '/my-courses' },
];

const userPages = [
  { label: 'Home', key: 'home', path: '/' },
  { label: 'All Courses', key: 'all-courses', path: '/all-courses' },
  { label: 'My Courses', key: 'my-courses', path: '/my-courses' },
];

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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#001529',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['home']}
        items={pages.map((page) => ({
          key: page.key,
          label: <Link to={page.path}>{page.label}</Link>,
        }))}
        style={{
          flex: 'none',
          minWidth: 0,
          backgroundColor: 'transparent',
          borderBottom: 'none',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          maxWidth: '70%',
        }}
      />

      <Space
        style={{
          flexShrink: 0,
          marginLeft: 'auto',
        }}
      >
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
            <span style={{ color: 'white', marginRight: '10px' }}>
              Welcome, {user.name}
            </span>
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
