import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Flex, DatePicker, Select } from 'antd';
import { useValidateCourse } from '../../hooks/useValidateCourse';
import dayjs from 'dayjs';

const { TextArea } = Input;

const EditCourseModal = ({ open, onClose, course, onSave, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    description: '',
    startDate: null,
    finishDate: null,
    language: '',
    requirements: '',
    categoriesIds: [],
  });
  const [loading, setLoading] = useState(false);
  const { validateCourse } = useValidateCourse();

  useEffect(() => {
    if (course) {
      setFormData({
        id: course.id || null,
        name: course.name || '',
        imageUrl: course.imageUrl || '',
        description: course.description || '',
        startDate: course.startDate ? dayjs(course.startDate) : null,
        finishDate: course.finishDate ? dayjs(course.finishDate) : null,
        language: course.language || '',
        requirements: course.requirements || '',
        categoriesIds: course.categories.map((category) => category.id) || [],
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field, date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleCategoryChange = (categoriesIds) => {
    setFormData({ ...formData, categoriesIds });
  };

  const handleSave = async () => {
    const validationError = validateCourse(formData);
    if (validationError) {
      message.error(validationError);
      return;
    }
    setLoading(true);
    await onSave({ ...course, ...formData });
    setLoading(false);
  };

  return (
    <Modal
      title="Edit Course"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical">
        <Form.Item label="Course Name">
          <Input name="name" value={formData.name} onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Image URL">
          <Input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Start Date">
          <DatePicker
            value={formData.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
          />
        </Form.Item>
        <Form.Item label="Finish Date">
          <DatePicker
            value={formData.finishDate}
            onChange={(date) => handleDateChange('finishDate', date)}
          />
        </Form.Item>
        <Form.Item label="Language">
          <Input
            name="language"
            value={formData.language}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Requirements">
          <TextArea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Categories">
          <Select
            mode="multiple"
            placeholder="Select categories"
            value={formData.categoriesIds}
            onChange={handleCategoryChange}
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Flex justify="center" gap="small">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;
