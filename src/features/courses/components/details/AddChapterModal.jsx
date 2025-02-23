import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import {
  validateChapterName,
  validateEstimatedTime,
} from '../../hooks/courseChapterValidations';

const AddChapterModal = ({ open, onClose, onSave, courseId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const newChapter = {
        courseId,
        name: values.name,
        estimatedTime: parseInt(values.estimatedTime),
      };
      const success = await onSave(newChapter);
      if (!success) {
        message.error('Failed to add chapter');
      }
    } catch (error) {
      console.error('Failed to add chapter:', error);
      message.error('Failed to add chapter');
    } finally {
      setLoading(false);
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal title="Add New Chapter" open={open} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Chapter Name"
          rules={[{ validator: validateChapterName }]}
        >
          <Input placeholder="Enter chapter name" />
        </Form.Item>
        <Form.Item
          name="estimatedTime"
          label="Estimated Time (minutes)"
          normalize={(value) => (value ? Number(value) : value)}
          rules={[{ validator: validateEstimatedTime }]}
        >
          <Input type="number" placeholder="Enter time in minutes" min={1} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Chapter
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddChapterModal;
