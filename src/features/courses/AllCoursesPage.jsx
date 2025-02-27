import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Spin,
  Typography,
  message,
  Input,
  Select,
  Col,
  Row,
} from 'antd';
import { CourseService } from './services/course.service';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // Store category IDs
  const [categories, setCategories] = useState([]); // Store unique category objects with IDs and names
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchCoursesAndCategories = async () => {
      try {
        setLoading(true);
        // Fetch all courses initially
        const coursesResponse = await CourseService.getAllCourses(
          controller.signal
        );
        setCourses(coursesResponse || []);

        // Fetch unique categories (deduplicate by ID to prevent duplicates)
        const uniqueCategories = [
          ...new Map(
            coursesResponse
              .flatMap(
                (course) =>
                  course.categories?.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                  })) || []
              )
              .map((item) => [item.id, item]) // Use ID as key for deduplication
          ).values(),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        message.error('Failed to load courses or categories');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndCategories();

    return () => controller.abort();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (values) => {
    setSelectedCategoryIds(values);
  };

  const handleFilter = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await CourseService.getFilteredCourses(
        searchQuery,
        selectedCategoryIds,
        controller.signal
      );
      setCourses(response || []);
    } catch (error) {
      message.error('Failed to filter courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Text
          strong
          style={{ color: '#1890ff', textAlign: 'center', display: 'block' }}
        >
          {text}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
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
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
      align: 'center',
    },
    {
      title: 'Finish Date',
      dataIndex: 'finishDate',
      key: 'finishDate',
      render: (date) => new Date(date).toLocaleDateString(),
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
            onClick={() => handleViewCourse(record.id)}
          >
            View Course
          </Button>
        </div>
      ),
      align: 'center',
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

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
        All Courses
      </Title>
      <div style={{ marginBottom: '24px', width: '100%', maxWidth: '800px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Search by course name"
              onSearch={handleSearch}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              style={{ width: '100%' }}
              enterButton
            />
          </Col>
          <Col xs={24} md={12}>
            <Select
              mode="multiple"
              placeholder="Select categories"
              onChange={handleCategoryChange}
              value={selectedCategoryIds} // Use IDs directly for value
              style={{ width: '100%' }}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Button
          type="primary"
          style={{
            marginTop: '16px',
            background: '#52c41a',
            borderColor: '#52c41a',
            width: '100%',
          }}
          onClick={handleFilter}
        >
          Filter Courses
        </Button>
      </div>
      <Table
        dataSource={courses}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        style={{ width: '100%' }}
        scroll={{ x: true }}
        tableLayout="auto"
      />
    </div>
  );
};

export default AllCoursesPage;
