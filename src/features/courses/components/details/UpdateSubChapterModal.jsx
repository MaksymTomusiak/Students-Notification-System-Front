import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const UpdateSubChapterModal = ({ open, onClose, onSave, subChapter }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (subChapter) {
      form.setFieldsValue({
        name: subChapter.name,
        content: subChapter.content,
        estimateTime: subChapter.estimateTime,
      });
    }
  }, [subChapter, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedSubChapter = {
        ...subChapter,
        name: values.name,
        content: values.content,
        estimateTime: parseInt(values.estimateTime),
      };
      await onSave(updatedSubChapter);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Update Subchapter"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update Subchapter
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Subchapter Name"
          rules={[
            { required: true, message: 'Subchapter name is required' },
            { min: 5, message: 'Name must be at least 5 characters' },
            { max: 255, message: 'Name cannot exceed 255 characters' },
          ]}
        >
          <Input placeholder="Enter subchapter name" />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          rules={[
            { required: true, message: 'Content is required' },
            { min: 5, message: 'Content must be at least 5 characters' },
            { max: 2000, message: 'Content cannot exceed 2000 characters' },
          ]}
        >
          <Input.TextArea
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
          rules={[
            { required: true, message: 'Estimated time is required' },
            { type: 'number', min: 1, message: 'Time must be positive' },
          ]}
        >
          <Input type="number" placeholder="Enter time in minutes" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSubChapterModal;
