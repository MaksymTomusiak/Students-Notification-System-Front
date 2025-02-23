import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Flex } from 'antd';

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
    await form.validateFields();
    const success = await onSave({ ...category, ...values });
    setLoading(false);
    if (success) {
      onClose();
      form.resetFields();
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
      <Form layout="vertical" form={form} onFinish={handleSave}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              validator: (_, value) => value.trim() !== '',
              message: 'Please enter name',
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
