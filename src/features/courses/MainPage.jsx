import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Col, Row, Spin, Typography, message } from 'antd';
import { CourseService } from './services/course.service';

const { Title } = Typography;

const MainPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchPopularCourses = async () => {
      try {
        setLoading(true);
        const response = await CourseService.getPopularCourses(
          6,
          controller.signal
        );
        setCourses(response);
      } catch (error) {
        message.error('Failed to load popular courses');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();

    return () => controller.abort();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div style={{ padding: '24px', paddingTop: '64px' }}>
      <Title level={2}>Popular Courses</Title>
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} md={8} key={course.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={course.name}
                    src={course.imageUrl}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                onClick={() => handleCourseClick(course.id)}
              >
                <Card.Meta
                  title={course.name}
                  description={
                    course.description.length > 50
                      ? `${course.description.slice(0, 50)}...`
                      : course.description
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default MainPage;
