import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Col,
  Descriptions,
  List,
  Row,
  Spin,
  Typography,
  message,
} from 'antd';
import { CourseService } from './services/course.service';
import { UserRegistersService } from '../users/services/user.registers.service';

const { Title, Text } = Typography;

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch course details
        const courseResponse = await CourseService.getCourseById(
          courseId,
          controller.signal
        );
        setCourse(courseResponse);

        // Check if user is registered for this course
        const userJson = localStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        if (user && user.sub) {
          const registersResponse = await UserRegistersService.getUserRegisters(
            user.sub,
            controller.signal
          );
          const registers = registersResponse || [];
          const isUserRegistered = registers.some(
            (register) => register.courseId === courseId
          );
          setIsRegistered(isUserRegistered);
        }
      } catch (error) {
        message.error('Failed to load course or registration details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [courseId]);

  const handleRegister = async () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || !user.sub) {
      message.error('Please log in to register for this course');
      return;
    }

    if (isCourseFinished) {
      message.error('This course has already finished');
      return;
    }

    try {
      setLoading(true);
      await UserRegistersService.register(
        courseId,
        new AbortController().signal
      );
      message.success('Successfully registered for the course');
      setIsRegistered(true);
    } catch (error) {
      message.error('Failed to register for the course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isCourseFinished = new Date(course?.finishDate) < new Date();

  if (loading) {
    return (
      <Spin
        size="large"
        style={{ display: 'block', textAlign: 'center', marginTop: '50px' }}
      />
    );
  }

  if (!course) {
    return <Title level={3}>Course not found</Title>;
  }

  return (
    <div
      style={{
        padding: 0,
        background: '#f0f2f5',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        margin: 0,
        paddingTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
      }}
    >
      {/* Main Course Data - Centered and taking most of the screen */}
      <div style={{ width: '90%', maxWidth: '1200px', padding: '16px' }}>
        <img
          alt={course.name}
          src={course.imageUrl}
          style={{
            maxHeight: '400px', // Increased for prominence
            objectFit: 'cover',
            borderBottom: '4px solid #1890ff',
            width: '100%',
            marginBottom: '16px',
          }}
        />
        <Title
          level={1}
          style={{
            color: '#1890ff',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          {course.name}
        </Title>
        <Text
          strong
          style={{
            color: '#595959',
            display: 'block',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Description:
        </Text>
        <Text
          style={{
            color: '#595959',
            display: 'block',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          {course.description}
        </Text>
        <Descriptions
          style={{ marginBottom: '24px' }}
          column={1}
          bordered
          label={{
            background: '#fafafa',
            fontWeight: 'bold',
            color: '#262626',
          }}
          content={{
            background: '#ffffff',
            color: '#595959',
          }}
        >
          <Descriptions.Item label="Start Date">
            {new Date(course.startDate).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Finish Date">
            {new Date(course.finishDate).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Language">
            {course.language}
          </Descriptions.Item>
          <Descriptions.Item label="Requirements">
            {course.requirements}
          </Descriptions.Item>
          <Descriptions.Item label="Categories">
            {course.categories.map((cat) => cat.name).join(', ')}
          </Descriptions.Item>
        </Descriptions>

        {!isCourseFinished && (
          <Button
            type="primary"
            style={{
              marginBottom: '24px',
              background: '#52c41a',
              borderColor: '#52c41a',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto', // Center the button
            }}
            onClick={handleRegister}
            disabled={isRegistered || !localStorage.getItem('token')} // Disable if already registered or not logged in
          >
            {isRegistered ? 'Already Registered' : 'Register'}
          </Button>
        )}
        {isCourseFinished && (
          <p
            style={{
              marginBottom: '24px',
              color: '#f5222d',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            This course has finished.
          </p>
        )}
      </div>

      {/* Chapters Section - Below main data */}
      <div
        style={{
          width: '90%',
          maxWidth: '1200px',
          padding: '16px',
          marginTop: '24px',
        }}
      >
        <Title level={4} style={{ color: '#fa8c16', marginBottom: '16px' }}>
          Chapters
        </Title>
        {course.chapters && course.chapters.length > 0 ? (
          <List
            dataSource={course.chapters}
            renderItem={(chapter) => (
              <List.Item
                style={{
                  background: '#fff7e6',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  padding: '12px',
                }}
              >
                <List.Item.Meta
                  title={
                    <Text
                      strong
                      style={{ color: '#d46b08' }}
                    >{`${chapter.number}. ${chapter.name}`}</Text>
                  }
                  description={
                    <>
                      <Text style={{ color: '#595959' }}>
                        Estimated Time: {chapter.estimatedTime} minutes
                      </Text>
                      {chapter.subChapters &&
                        chapter.subChapters.length > 0 && (
                          <>
                            <br />
                            <Text type="secondary" style={{ color: '#fa8c16' }}>
                              Subchapters:
                            </Text>
                            <ul
                              style={{
                                margin: '8px 0 0 16px',
                                color: '#595959',
                              }}
                            >
                              {chapter.subChapters.map((subChapter, index) => (
                                <li key={index}>{subChapter.name}</li>
                              ))}
                            </ul>
                          </>
                        )}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text style={{ color: '#8c8c8c' }}>
            No chapters available for this course.
          </Text>
        )}
      </div>

      {/* Feedbacks Section - Below chapters */}
      <div
        style={{
          width: '90%',
          maxWidth: '1200px',
          padding: '16px',
          marginTop: '24px',
        }}
      >
        <Title level={3} style={{ color: '#13c2c2', marginBottom: '16px' }}>
          Feedbacks
        </Title>
        {course.feedbacks && course.feedbacks.length > 0 ? (
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              background: '#e6fffb',
              padding: '16px',
              border: '1px solid #b5f5ec',
            }}
          >
            <List
              dataSource={course.feedbacks.slice(0, 10)} // Limit to first 10 feedbacks
              renderItem={(feedback) => (
                <List.Item
                  style={{
                    background: '#ffffff',
                    marginBottom: '8px',
                    borderRadius: '4px',
                    padding: '12px',
                    border: '1px solid #b5f5ec',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong style={{ color: '#08979c' }}>
                        {feedback.user
                          ? feedback.user.name
                          : `User ${feedback.userId}`}
                      </Text>
                    }
                    description={
                      <>
                        <Text style={{ color: '#262626' }}>
                          {feedback.content}
                        </Text>
                        <br />
                        <Text strong style={{ color: '#13c2c2' }}>
                          Rating: {feedback.rating} / 10
                        </Text>
                        <br />
                        <Text type="secondary" style={{ color: '#595959' }}>
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <Text
            style={{
              color: '#8c8c8c',
              background: '#e6fffb',
              padding: '16px',
              border: '1px solid #b5f5ec',
              display: 'block',
            }}
          >
            No feedbacks available for this course.
          </Text>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
