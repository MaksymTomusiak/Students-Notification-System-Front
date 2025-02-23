import React, { useState } from 'react';
import { Modal, Input, Button, Form, DatePicker, Select, message } from 'antd';
import {
  validateCourseName,
  validateImageUrl,
  validateDescription,
  validateLanguage,
  validateRequirements,
  validateDates,
} from '../../hooks/courseValidations';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const AddCourseModal = ({ open, onClose, onSave, categories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user')).sub;

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const courseData = {
        ...values,
        creatorId: userId,
        startDate: values.dates[0].toISOString(),
        finishDate: values.dates[1].toISOString(),
      };
      const success = await onSave(courseData);
      if (success) {
        message.success('Course added successfully');
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error('Failed to add course');
    } finally {
      setLoading(false);
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Course Name"
          rules={[{ validator: validateCourseName }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ validator: validateImageUrl }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ validator: validateDescription }]}
        >
          <TextArea placeholder="Enter description" rows={3} />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ validator: validateLanguage }]}
        >
          <Input placeholder="Enter language" />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Requirements"
          rules={[{ validator: validateRequirements }]}
        >
          <TextArea placeholder="Enter requirements" rows={3} />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Course Duration"
          rules={[{ validator: validateDates }]}
        >
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="categoriesIds"
          label="Categories"
          rules={[
            {
              required: false,
              message: 'Please select at least one category',
            },
          ]}
        >
          <Select
            mode="multiple"
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
