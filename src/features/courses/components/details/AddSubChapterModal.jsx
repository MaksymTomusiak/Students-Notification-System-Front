import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import {
  validateSubChapterName,
  validateSubChapterContent,
  validateEstimatedTime,
} from '../../hooks/courseSubChaptersValidations';

const { TextArea } = Input;

const AddSubChapterModal = ({ open, onClose, onSave, chapterId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const newSubChapter = {
        chapterId: chapterId,
        name: values.name,
        content: values.content,
        estimateTime: parseInt(values.estimateTime),
      };
      const success = await onSave(newSubChapter);
      if (success) {
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to add subchapter');
      }
    } catch (error) {
      console.error('Failed to add subchapter:', error);
      message.error('Failed to add subchapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Subchapter"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Subchapter Name"
          rules={[{ validator: validateSubChapterName }]}
        >
          <Input placeholder="Enter subchapter name" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          rules={[{ validator: validateSubChapterContent }]}
        >
          <TextArea
            placeholder="Enter subchapter content"
            rows={4}
            showCount
            maxLength={2000}
          />
        </Form.Item>
        <Form.Item
          name="estimateTime"
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
            Add Subchapter
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSubChapterModal;
