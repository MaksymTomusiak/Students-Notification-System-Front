import React from 'react';
import { Modal, Input } from 'antd';

const BanReasonModal = ({
  isBanModalOpen,
  closeBanModal,
  banReason,
  onReasonChange,
  handleConfirmBan,
}) => {
  return (
    <Modal
      title="Enter Ban Reason"
      open={isBanModalOpen}
      onCancel={closeBanModal}
      onOk={handleConfirmBan}
    >
      <Input.TextArea
        value={banReason}
        onChange={onReasonChange}
        placeholder="Enter reason for banning the user..."
        rows={4}
      />
    </Modal>
  );
};

export default BanReasonModal;
