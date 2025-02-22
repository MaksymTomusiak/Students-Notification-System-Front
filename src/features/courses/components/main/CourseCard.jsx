import React from 'react';
import { Card } from 'antd';
import CourseActions from './CourseActions';

const truncateText = (text = '') =>
  text.length > 100 ? text.substring(0, 100) + '...' : text;

const CourseCard = ({ course, onDelete, categories, onUpdate }) => {
  return (
    <Card
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <img
        alt="Course"
        src={course.imageUrl}
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          marginBottom: '16px',
          borderRadius: '8px',
        }}
      />

      <h3>{course.name}</h3>
      <p>{truncateText(course.description)}</p>

      <p>
        <strong>Language:</strong> {course.language}
      </p>
      <p>
        <strong>Start:</strong>{' '}
        {new Date(course.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong>End:</strong> {new Date(course.finishDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Requirements:</strong> {truncateText(course.requirements)}
      </p>

      {course.categories.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <strong>Categories:</strong>
          <div
            style={{
              display: 'flex',
              justifyContent:
                course.categories.length === 1 ? 'center' : 'space-evenly',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '8px',
            }}
          >
            {course.categories.map((cat) => (
              <p
                key={cat.id}
                style={{
                  backgroundColor: '#e6f4ff',
                  fontSize: '14px',
                  padding: '5px 15px',
                  color: '#0958d9',
                  border: '1px solid #91caff',
                  borderRadius: '10px',
                }}
              >
                {cat.name}
              </p>
            ))}
          </div>
        </div>
      )}

      <CourseActions
        course={course}
        onCourseDelete={onDelete}
        categories={categories}
        onCourseUpdate={onUpdate}
      />
    </Card>
  );
};

export default CourseCard;
