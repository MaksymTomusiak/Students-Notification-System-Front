import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, message, Tabs, Table } from 'antd';
import BanReasonModal from './BanReasonModal';

const { Text } = Typography;

const UserDetailsModal = ({
  open,
  onClose,
  title = 'User Details',
  bans = [],
  registers = [],
  onBanUser,
  onUnbanUser,
  userId,
  loading, // Receive loading state
  registerPagination, // Receive registers pagination state
  banPagination, // Receive bans pagination state
  onRegisterPaginationChange, // Receive callback for registers pagination
  onBanPaginationChange, // Receive callback for bans pagination
}) => {
  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleBanClick = (courseId) => {
    setSelectedCourseId(courseId);
    setBanModalOpen(true);
  };

  const handleConfirmBan = () => {
    if (!banReason.trim()) {
      message.error('Please enter a reason for banning the user.');
      return;
    }

    onBanUser({
      userId,
      courseId: selectedCourseId,
      reason: banReason,
    });

    closeBanModal();
  };

  const closeBanModal = () => {
    setBanModalOpen(false);
    setBanReason('');
  };

  const handleReasonChange = (e) => setBanReason(e.target.value);

  const handleRegisterTableChange = (newPagination) => {
    onRegisterPaginationChange(newPagination); // Update registers pagination in UserActions
  };

  const handleBanTableChange = (newPagination) => {
    onBanPaginationChange(newPagination); // Update bans pagination in UserActions
  };

  const registerColumns = [
    {
      title: 'Register ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Course Name',
      key: 'courseName',
      render: (_, record) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {record.course.name}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Registered At',
      key: 'registeredAt',
      render: (_, record) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {new Date(record.registeredAt)
            .toLocaleDateString('en-GB')
            .split('/')
            .join('-')}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => handleBanClick(record.course.id)}
          loading={loading}
        >
          Ban
        </Button>
      ),
      align: 'center',
    },
  ];

  const banColumns = [
    {
      title: 'Ban ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Course Name',
      key: 'courseName',
      render: (_, record) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {record.course.name}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center',
    },
    {
      title: 'Banned At',
      key: 'bannedAt',
      render: (_, record) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {new Date(record.bannedAt)
            .toLocaleDateString('en-GB')
            .split('/')
            .join('-')}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() => onUnbanUser(record.id)}
          loading={loading}
        >
          Unban
        </Button>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <Modal
        style={{ textAlign: 'center' }}
        title={title}
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'Registers',
              children: (
                <Table
                  dataSource={registers}
                  columns={registerColumns}
                  rowKey="id"
                  pagination={{
                    current: registerPagination.current,
                    pageSize: registerPagination.pageSize,
                    total: registerPagination.total,
                    showSizeChanger: true,
                    onChange: handleRegisterTableChange,
                  }}
                  loading={loading}
                  scroll={{ x: true }}
                  tableLayout="auto"
                  style={{ width: '100%' }}
                />
              ),
            },
            {
              key: '2',
              label: 'Bans',
              children: (
                <Table
                  dataSource={bans}
                  columns={banColumns}
                  rowKey="id"
                  pagination={{
                    current: banPagination.current,
                    pageSize: banPagination.pageSize,
                    total: banPagination.total,
                    showSizeChanger: true,
                    onChange: handleBanTableChange,
                  }}
                  loading={loading}
                  scroll={{ x: true }}
                  tableLayout="auto"
                  style={{ width: '100%' }}
                />
              ),
            },
          ]}
        />
      </Modal>

      <BanReasonModal
        isBanModalOpen={isBanModalOpen}
        closeBanModal={closeBanModal}
        banReason={banReason}
        onReasonChange={handleReasonChange}
        handleConfirmBan={handleConfirmBan}
      />
    </>
  );
};

export default UserDetailsModal;
