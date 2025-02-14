import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Form, Flex } from 'antd';

const EditCategoryModal = ({ open, onClose, category, onSave }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category, open]);

  const handleSave = async () => {
    setLoading(true);
    const success = await onSave({ ...category, name });
    setLoading(false);
    if (success) {
      onClose();
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
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Flex justify="center" gap="small">
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} loading={loading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
