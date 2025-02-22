import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const UpdateChapterModal = ({ open, onClose, onSave, chapter }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (chapter) {
      form.setFieldsValue({
        name: chapter.name,
        estimatedTime: chapter.estimatedTime,
      });
    }
  }, [chapter, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedChapter = {
        ...chapter,
        name: values.name,
        estimatedTime: parseInt(values.estimatedTime),
      };
      await onSave(updatedChapter);
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Update Chapter"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update Chapter
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Chapter Name"
          rules={[
            { required: true, message: 'Chapter name is required' },
            { min: 5, message: 'Name must be at least 5 characters' },
            { max: 255, message: 'Name cannot exceed 255 characters' },
          ]}
        >
          <Input placeholder="Enter chapter name" />
        </Form.Item>
        <Form.Item
          name="estimatedTime"
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

export default UpdateChapterModal;
