import React, { useState } from 'react';
import { Button, Space } from 'antd';
import EditCategoryModal from '../EditCategoryModal';
import DeleteConfirmationModal from '../../../../components/common/DeleteConfirmationModal';

const CategoryActions = ({ category, onCategoryDelete, onCategoryUpdate }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleSave = async (updatedCategory) => {
    const success = await onCategoryUpdate(updatedCategory);
    if (success) {
      closeEditModal();
    }
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = () => {
    onCategoryDelete(category.id);
    closeDeleteModal();
  };

  return (
    <>
      <Space size="middle">
        <Button onClick={openEditModal} type="primary">
          Edit
        </Button>
        <Button onClick={openDeleteModal} type="primary" danger>
          Delete
        </Button>
      </Space>

      <EditCategoryModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        category={category}
        onSave={handleSave}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default CategoryActions;
