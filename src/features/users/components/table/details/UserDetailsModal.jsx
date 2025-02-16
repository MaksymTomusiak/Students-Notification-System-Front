import React, { useState } from 'react';
import { Modal, Input, Button, Typography, message, Tabs, Table } from 'antd';
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

  const registerColumns = [
    {
      title: 'Register ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Course Name',
      key: 'courseName',
      render: (_, record) => <Text>{record.course.name}</Text>,
    },
    {
      title: 'Registered At',
      key: 'registeredAt',
      render: (_, record) => (
        <Text>
          {new Date(record.registeredAt)
            .toLocaleDateString('en-GB')
            .split('/')
            .join('-')}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleBanClick(record.course.id)}
        >
          Ban
        </Button>
      ),
    },
  ];

  const banColumns = [
    {
      title: 'Ban ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Course Name',
      key: 'courseName',
      render: (_, record) => <Text>{record.course.name}</Text>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Banned At',
      key: 'bannedAt',
      render: (_, record) => (
        <Text>
          {new Date(record.bannedAt)
            .toLocaleDateString('en-GB')
            .split('/')
            .join('-')}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => onUnbanUser(record.id)}>
          Unban
        </Button>
      ),
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
                  pagination={false}
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
                  pagination={false}
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
