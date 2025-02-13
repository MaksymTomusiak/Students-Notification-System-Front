import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../users/services/user.service';
import { Button, Input, Form, Card, message } from 'antd';

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    userName: '',
  });

  const navigate = useNavigate();

  const handleUserChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must include at least one lowercase letter.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must include at least one uppercase letter.';
    }
    if (!/\d/.test(password)) {
      return 'Password must include at least one digit.';
    }
    if (!/[^a-zA-Z\d]/.test(password)) {
      return 'Password must include at least one special character.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validatePassword(user.password);
    if (errorMessage) {
      message.error(errorMessage);
      return;
    }

    try {
      const response = await UserService.registerUser(user);

      if (response) {
        message.success('Registration successful!');
        navigate('/login');
      }
    } catch (error) {
      message.error(error.response.data);
    }
  };

  return (
    <Card
      title="Register"
      style={{ width: 400, margin: 'auto', marginTop: '50px' }}
    >
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item
          label="Username"
          name="userName"
          rules={[{ required: true, message: 'Please enter your username' }]}
        >
          <Input
            type="text"
            name="userName"
            value={user.userName}
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;
