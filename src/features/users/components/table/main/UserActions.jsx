import { useState } from 'react';
import { Button, Space } from 'antd';
import DeleteConfirmationModal from '../../../../../components/common/DeleteConfirmationModal';

const UserActions = ({ user, onUserDelete }) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const openDetailsModal = () => setDetailsModalOpen(true);
  const closeDetailsModal = () => setDetailsModalOpen(false);

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = () => {
    onUserDelete(user.id);
    closeDeleteModal();
  };

  return (
    <>
      <Space size="middle">
        <Button onClick={openDetailsModal} type="primary">
          Details
        </Button>
        <Button onClick={openDeleteModal} type="primary" danger>
          Delete
        </Button>
      </Space>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the user "${user.userName}"? This action cannot be undone.`}
      />
    </>
  );
};

export default UserActions;
