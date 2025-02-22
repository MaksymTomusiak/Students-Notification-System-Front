import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../users/services/user.service';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, Form, Card, message } from 'antd';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ email: '', password: '' });

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await UserService.loginUser(user);

      if (response) {
        let decoded = jwtDecode(response);
        localStorage.setItem('token', response);
        localStorage.setItem('user', JSON.stringify(decoded));

        const params = new URLSearchParams(location.search);
        let returnUrl = params.get('returnUrl') || '/';

        // Prevent redirecting back to login
        if (returnUrl.includes('/login')) {
          returnUrl = '/';
        }

        navigate(returnUrl, { replace: true });
      }
    } catch (error) {
      message.error(error.response?.data || 'Login failed');
    }
  };

  return (
    <Card
      title="Login"
      style={{ width: 400, margin: 'auto', marginTop: '50px' }}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            name="password"
            value={user.password}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
