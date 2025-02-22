import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, DatePicker, Select } from 'antd';
import { useValidateCourse } from '../../hooks/useValidateCourse';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const AddCourseModal = ({ open, onClose, onSave, categories }) => {
  const userId = JSON.parse(localStorage.getItem('user')).sub;
  const initialState = {
    name: '',
    imageUrl: '',
    description: '',
    creatorId: userId,
    startDate: null,
    finishDate: null,
    language: '',
    requirements: '',
    categoriesIds: [],
  };

  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState(initialState);
  const { validateCourse } = useValidateCourse();

  const turnOnLoading = () => {
    setLoading(true);
  };

  const turnOffLoading = () => {
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setNewCourse((prev) => ({
        ...prev,
        startDate: dates[0].toISOString(),
        finishDate: dates[1].toISOString(),
      }));
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day'); // Disable past dates
  };

  const handleCategoryChange = (values) => {
    setNewCourse((prev) => ({ ...prev, categoriesIds: values }));
  };

  const handleSave = async () => {
    const validationError = validateCourse(newCourse);
    if (validationError) {
      message.error(validationError);
      return;
    }

    setLoading(true);
    const success = await onSave(newCourse);
    setLoading(false);
    if (success) {
      onClose();
      setNewCourse(initialState);
    }
  };

  return (
    <Modal
      title="Add New Course"
      open={open}
      onCancel={onClose}
      footer={null}
      style={{ textAlign: 'center' }}
    >
      <Form layout="vertical">
        <Form.Item label="Course Name">
          <Input
            name="name"
            value={newCourse.name}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item label="Image URL">
          <Input
            name="imageUrl"
            value={newCourse.imageUrl}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Input.TextArea
            name="description"
            value={newCourse.description}
            onChange={handleInputChange}
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Language">
          <Input
            name="language"
            value={newCourse.language}
            onChange={handleInputChange}
          />
        </Form.Item>

        <Form.Item label="Requirements">
          <Input.TextArea
            name="requirements"
            value={newCourse.requirements}
            onChange={handleInputChange}
            rows={3}
          />
        </Form.Item>

        <Form.Item label="Course Duration">
          <RangePicker
            onChange={handleDateChange}
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item label="Categories">
          <Select
            mode="multiple"
            value={newCourse.categoriesIds}
            onChange={handleCategoryChange}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            placeholder="Select categories"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
