import React, { useState, useEffect } from 'react';
import { Button, Space, message } from 'antd';
import { DeleteOutlined, InfoOutlined } from '@ant-design/icons';
import DeleteConfirmationModal from '../../../../../components/common/DeleteConfirmationModal';
import UserDetailsModal from '../details/UserDetailsModal';
import { UserRegistersService } from '../../../services/user.registers.service';
import { UserBansService } from '../../../services/user.bans.service';

const UserActions = ({ user, onUserDelete }) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [registers, setRegisters] = useState([]);
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [registerPagination, setRegisterPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0, // For registers
  });
  const [banPagination, setBanPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0, // For bans
  });
  const controller = new AbortController();

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const [registersResponse, bansResponse] = await Promise.all([
        UserRegistersService.getUserRegisters(
          user.id,
          registerPagination.current,
          registerPagination.pageSize,
          controller.signal
        ),
        UserBansService.getUserBans(
          user.id,
          banPagination.current,
          banPagination.pageSize,
          controller.signal
        ),
      ]);
      setRegisters(registersResponse.items || []);
      setBans(bansResponse.items || []);
      setRegisterPagination((prev) => ({
        ...prev,
        total: registersResponse.totalCount || 0,
      }));
      setBanPagination((prev) => ({
        ...prev,
        total: bansResponse.totalCount || 0,
      }));
    } catch (error) {
      console.error('Error fetching user details:', error);
      message.error('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = async () => {
    await fetchUserDetails();
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    controller.abort();
    setDetailsModalOpen(false);
  };

  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      await onUserDelete(user.id);
      closeDeleteModal();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleBanUser = async (banData) => {
    try {
      await UserBansService.banUser(banData);
      message.success('User banned successfully');
      await fetchUserDetails(); // Refresh both registers and bans, maintaining pagination
    } catch (error) {
      console.error('Error banning user:', error);
      message.error('Failed to ban user');
    }
  };

  const handleUnbanUser = async (banId) => {
    try {
      await UserBansService.unbanUser(banId);
      message.success('User unbanned successfully');
      await fetchUserDetails(); // Refresh both registers and bans, maintaining pagination
    } catch (error) {
      console.error('Error unbanning user:', error);
      message.error('Failed to unban user');
    }
  };

  const handleRegisterPaginationChange = (newPagination) => {
    setRegisterPagination(newPagination);
    fetchUserDetails(); // Re-fetch with new pagination for registers
  };

  const handleBanPaginationChange = (newPagination) => {
    setBanPagination(newPagination);
    fetchUserDetails(); // Re-fetch with new pagination for bans
  };

  return (
    <>
      <Space size="middle">
        <Button
          onClick={openDetailsModal}
          type="primary"
          icon={<InfoOutlined />}
          loading={loading}
        >
          Details
        </Button>
        <Button
          onClick={openDeleteModal}
          type="primary"
          danger
          icon={<DeleteOutlined />}
          loading={loading}
        >
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

      <UserDetailsModal
        open={isDetailsModalOpen}
        onClose={closeDetailsModal}
        title={`Details of user ${user.userName}`}
        registers={registers}
        bans={bans}
        loading={loading}
        userId={user.id}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        registerPagination={registerPagination} // Pass registers pagination
        banPagination={banPagination} // Pass bans pagination
        onRegisterPaginationChange={handleRegisterPaginationChange} // Pass callback for registers
        onBanPaginationChange={handleBanPaginationChange} // Pass callback for bans
      />
    </>
  );
};

export default UserActions;
