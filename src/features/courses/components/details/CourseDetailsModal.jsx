import React, { useState } from 'react';
import {
  Modal,
  Button,
  Typography,
  Card,
  Tabs,
  Flex,
  Collapse,
  Table,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import ReorderChaptersModal from './ReorderChaptersModal';
import ReorderSubChaptersModal from './ReorderSubChaptersModal';

const { Text } = Typography;

const formatTime = (minutes) => {
  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
};

const CourseDetailsModal = ({
  open,
  onClose,
  title = 'Course Details',
  feedbacks = [],
  chapters = [],
  onFeedbackDelete,
  onChapterDelete,
  onChapterAdd,
  onChapterUpdate,
  onSubChapterAdd,
  onSubChapterUpdate,
  onSubChapterDelete,
  onChaptersReorder,
  onSubChaptersReorder,
  feedbackPagination, // Receive feedbacks pagination state
  onFeedbackPaginationChange, // Receive callback for feedbacks pagination
}) => {
  const [isReorderModalOpen, setReorderModalOpen] = useState(false);
  const [isSubReorderModalOpen, setSubReorderModalOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);

  const handleSaveSubOrder = (updatedSubChapters) => {
    onSubChaptersReorder(selectedChapterId, updatedSubChapters);
    setSelectedChapterId(null);
  };

  const openSubReorderModal = (chapterId) => {
    setSelectedChapterId(chapterId);
    setSubReorderModalOpen(true);
  };

  const handleFeedbackTableChange = (newPagination) => {
    onFeedbackPaginationChange(newPagination); // Update pagination in CourseActions, which will re-fetch data
  };

  const feedbackColumns = [
    {
      title: 'User Name',
      dataIndex: ['user', 'userName'],
      key: 'userName',
      align: 'center',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <Text>{text.length > 250 ? text.substring(0, 250) + '...' : text}</Text>
      ),
      align: 'center',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Text strong style={{ color: '#faad14' }}>
          {rating}/10
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {new Date(date).toLocaleDateString('en-GB').split('/').join('-')}
        </Text>
      ),
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, feedback) => (
        <Button
          type="primary"
          danger
          onClick={() => onFeedbackDelete(feedback.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const feedbackTab = (
    <Table
      dataSource={feedbacks}
      columns={feedbackColumns}
      rowKey="id"
      pagination={{
        current: feedbackPagination.current,
        pageSize: feedbackPagination.pageSize,
        total: feedbackPagination.total,
        showSizeChanger: true,
        onChange: handleFeedbackTableChange,
      }}
      loading={false} // Loading is handled by CourseActions
      scroll={{ x: true }}
      tableLayout="auto"
      style={{ width: '100%' }}
    />
  );

  const chaptersTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Flex gap="small">
        <Button type="primary" onClick={onChapterAdd}>
          Add Chapter
        </Button>
        <Button onClick={() => setReorderModalOpen(true)}>
          Reorder Chapters
        </Button>
      </Flex>
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
        items={chapters.map((chapter) => ({
          key: chapter.id,
          label: (
            <Flex justify="space-between" align="center">
              <Text strong>{chapter.name}</Text>
              <Text type="secondary">{formatTime(chapter.estimatedTime)}</Text>
            </Flex>
          ),
          children: (
            <>
              <Flex gap="small" style={{ marginBottom: '16px' }}>
                <Button onClick={() => onChapterUpdate(chapter)}>
                  Edit Chapter
                </Button>
                <Button danger onClick={() => onChapterDelete(chapter.id)}>
                  Delete Chapter
                </Button>
              </Flex>

              {chapter.subChapters?.map((subChapter) => (
                <Card
                  key={subChapter.id}
                  style={{ marginTop: '10px', background: '#f9f9f9' }}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginBottom: '8px' }}
                  >
                    <Text strong>{subChapter.name}</Text>
                    <Text type="secondary">
                      {formatTime(subChapter.estimateTime)}
                    </Text>
                  </Flex>
                  <Text>{subChapter.content}</Text>
                  <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginTop: '12px' }}
                  >
                    <Button onClick={() => onSubChapterUpdate(subChapter)}>
                      Edit Subchapter
                    </Button>
                    <Button
                      danger
                      onClick={() => onSubChapterDelete(subChapter.id)}
                    >
                      Delete Subchapter
                    </Button>
                  </Flex>
                </Card>
              ))}
              <Flex gap="small" style={{ marginTop: '10px' }}>
                <Button onClick={() => onSubChapterAdd(chapter.id)}>
                  Add Subchapter
                </Button>
                {chapter.subChapters?.length > 0 && (
                  <Button onClick={() => openSubReorderModal(chapter.id)}>
                    Reorder Subchapters
                  </Button>
                )}
              </Flex>
            </>
          ),
        }))}
      />
    </div>
  );

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
            { key: '1', label: 'Feedbacks', children: feedbackTab },
            { key: '2', label: 'Chapters', children: chaptersTab },
          ]}
        />
      </Modal>
      <ReorderChaptersModal
        open={isReorderModalOpen}
        onClose={() => setReorderModalOpen(false)}
        chapters={chapters}
        onSave={onChaptersReorder}
      />
      <ReorderSubChaptersModal
        open={isSubReorderModalOpen}
        onClose={() => setSubReorderModalOpen(false)}
        subChapters={
          chapters.find((c) => c.id === selectedChapterId)?.subChapters || []
        }
        onSave={handleSaveSubOrder}
      />
    </>
  );
};

export default CourseDetailsModal;
