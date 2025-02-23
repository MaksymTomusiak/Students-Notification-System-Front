import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import {
  validateChapterName,
  validateEstimatedTime,
} from '../../hooks/courseChapterValidations';

const UpdateChapterModal = ({ open, onClose, onSave, chapter }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chapter && open) {
      form.setFieldsValue({
        name: chapter.name,
        estimatedTime: chapter.estimatedTime,
      });
    }
  }, [chapter, open, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedChapter = {
        ...chapter,
        name: values.name,
        estimatedTime: parseInt(values.estimatedTime),
      };
      const success = await onSave(updatedChapter);
      if (success) {
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to update chapter');
      }
    } catch (error) {
      console.error('Failed to update chapter:', error);
      message.error('Failed to update chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Update Chapter" open={open} onCancel={onClose} footer={null}>
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
            Update Chapter
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateChapterModal;
