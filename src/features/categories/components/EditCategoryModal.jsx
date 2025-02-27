import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, Flex, message } from 'antd';

const EditCategoryModal = ({ open, onClose, category, onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && open) {
      form.setFieldsValue({ name: category.name });
    }
  }, [category, open, form]);

  const handleSave = async (values) => {
    setLoading(true);
    try {
      await form.validateFields();
      const updatedCategory = {
        id: category.id,
        name: values.name.trim(),
      };
      const success = await onSave(updatedCategory);
      if (success) {
        onClose();
        form.resetFields();
      }
    } catch (error) {
      console.error('Validation or save error:', error);
      message.error(
        'Failed to update category: ' + (error.message || 'Unknown error')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Category"
      open={open}
      onCancel={onClose}
      footer={null}
      style={{ textAlign: 'center' }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSave}
        onFinishFailed={(errorInfo) => {
          message.error('Please fix the form errors before submitting.');
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.trim() === '') {
                  return Promise.reject('Please enter a name');
                }
                return Promise.resolve();
              },
            },
            { min: 3, message: 'Name must be at least 3 characters' },
            { max: 255, message: 'Name cannot exceed 255 characters' },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item>
          <Flex justify="center" gap="small">
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
