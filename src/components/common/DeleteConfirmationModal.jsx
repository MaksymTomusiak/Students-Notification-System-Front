import React from 'react';
import { Modal, Button, Typography, Flex } from 'antd';

const { Text } = Typography;

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Delete',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
}) => {
  return (
    <Modal
      style={{ textAlign: 'center' }}
      title={title}
      open={open}
      onCancel={onClose}
      footer={[
        <Flex gap="small" justify="center" key="footer-buttons">
          <Button key="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button key="delete" type="primary" danger onClick={onConfirm}>
            Delete
          </Button>
        </Flex>,
      ]}
    >
      <Text>{description}</Text>
    </Modal>
  );
};

export default DeleteConfirmationModal;
