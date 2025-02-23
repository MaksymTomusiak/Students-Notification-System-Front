import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import {
  validateSubChapterName,
  validateSubChapterContent,
  validateEstimatedTime,
} from '../../hooks/courseSubChaptersValidations';

const { TextArea } = Input;

const UpdateSubChapterModal = ({ open, onClose, onSave, subChapter }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subChapter && open) {
      form.setFieldsValue({
        name: subChapter.name,
        content: subChapter.content,
        estimateTime: subChapter.estimateTime,
      });
    }
  }, [subChapter, open, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatedSubChapter = {
        ...subChapter,
        name: values.name,
        content: values.content,
        estimateTime: parseInt(values.estimateTime),
      };
      const success = await onSave(updatedSubChapter);
      if (success) {
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to update subchapter');
      }
    } catch (error) {
      console.error('Failed to update subchapter:', error);
      message.error('Failed to update subchapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Update Subchapter"
      open={open}
      onCancel={onClose}
      footer={null} // Removed footer to match other modals
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
            Update Subchapter
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSubChapterModal;
