import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Spin, Typography, message } from 'antd';
import { UserRegistersService } from '../users/services/user.registers.service';

const { Title, Text } = Typography;

const MyCoursesPage = () => {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || !user.sub) {
      message.error('User not logged in');
      setLoading(false);
      return;
    }

    const fetchUserRegisters = async () => {
      try {
        setLoading(true);
        const response = await UserRegistersService.getUserRegisters(
          user.sub,
          pagination.current,
          pagination.pageSize,
          controller.signal
        );

        setRegisters(response.items || response.Items || []);
        setPagination((prev) => ({
          ...prev,
          total: response.totalCount || response.TotalCount || 0,
        }));
      } catch (error) {
        message.error('Failed to load registered courses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRegisters();

    return () => controller.abort();
  }, [pagination.current, pagination.pageSize]);

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleUnregister = async (courseId) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || !user.sub) {
      message.error('User not logged in');
      return;
    }

    try {
      setLoading(true);
      await UserRegistersService.unregister(
        courseId,
        new AbortController().signal
      );
      message.success('Successfully unregistered from the course');

      const response = await UserRegistersService.getUserRegisters(
        user.sub,
        pagination.current,
        pagination.pageSize,
        new AbortController().signal
      );
      setRegisters(response.items || response.Items || []);
      setPagination((prev) => ({
        ...prev,
        total: response.totalCount || response.TotalCount || 0, // Adjust based on response structure
      }));
    } catch (error) {
      message.error('Failed to unregister from the course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: ['course', 'name'],
      key: 'name',
      render: (text) => (
        <Text
          strong
          style={{ color: '#1890ff', textAlign: 'center', display: 'block' }}
        >
          {text || 'Course not available'}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Image',
      dataIndex: ['course', 'imageUrl'],
      key: 'imageUrl',
      render: (imageUrl) => (
        <img
          alt="Course Image"
          src={imageUrl || ''}
          style={{
            maxHeight: '100px',
            objectFit: 'cover',
            borderRadius: '4px',
            width: '100px',
            display: 'block',
            margin: '0 auto',
          }}
        />
      ),
      align: 'center',
    },
    {
      title: 'Registered On',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (date) => new Date(date).toLocaleDateString(),
      align: 'center',
    },
    {
      title: 'Course Duration',
      key: 'duration',
      render: (_, record) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {new Date(record.course?.startDate).toLocaleDateString()} -{' '}
          {new Date(record.course?.finishDate).toLocaleDateString()}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button
            type="primary"
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            onClick={() => handleViewCourse(record.courseId)}
          >
            View Course
          </Button>
          <Button
            type="default"
            danger
            onClick={() => handleUnregister(record.courseId)}
          >
            Unregister
          </Button>
        </div>
      ),
      align: 'center',
    },
  ];

  return (
    <div
      style={{
        padding: '24px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Title
        level={2}
        style={{ color: '#1890ff', textAlign: 'center', marginBottom: '24px' }}
      >
        My Courses
      </Title>
      {registers.length > 0 ? (
        <Table
          dataSource={registers}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) =>
              handleTableChange({ current: page, pageSize }),
            showSizeChanger: true,
          }}
          loading={loading}
          style={{ width: '100%' }}
          scroll={{ x: true }}
          tableLayout="auto"
        />
      ) : (
        <Text
          style={{
            color: '#8c8c8c',
            textAlign: 'center',
            display: 'block',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            fontSize: '16px',
          }}
        >
          You are not registered for any courses.
        </Text>
      )}
    </div>
  );
};

export default MyCoursesPage;
