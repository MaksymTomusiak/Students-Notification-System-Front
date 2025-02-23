import { useState, useCallback, useRef } from 'react';
import { Button, Space, message } from 'antd';
import { DeleteOutlined, EditOutlined, InfoOutlined } from '@ant-design/icons';
import DeleteConfirmationModal from '../../../../components/common/DeleteConfirmationModal';
import EditCourseModal from './EditCourseModal';
import { CourseFeedbacksService } from '../../services/course.feedbacks.service';
import { CourseChaptersService } from '../../services/course.chapters.service';
import { CourseSubChaptersService } from '../../services/course.subchapters.service';
import CourseDetailsModal from '../details/CourseDetailsModal';
import AddChapterModal from '../details/AddChapterModal';
import AddSubChapterModal from '../details/AddSubChapterModal';
import UpdateChapterModal from '../details/UpdateChapterModal';
import UpdateSubChapterModal from '../details/UpdateSubChapterModal';

const CourseActions = ({
  course,
  onCourseDelete,
  onCourseUpdate,
  categories,
}) => {
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddChapterModalOpen, setAddChapterModalOpen] = useState(false);
  const [isAddSubChapterModalOpen, setAddSubChapterModalOpen] = useState(false);
  const [isUpdateChapterModalOpen, setUpdateChapterModalOpen] = useState(false);
  const [isUpdateSubChapterModalOpen, setUpdateSubChapterModalOpen] =
    useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedSubChapter, setSelectedSubChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const controllerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchCourseDetails = useCallback(async () => {
    if (isFetchingRef.current) {
      console.log(
        `Fetch already in progress for course ${course.id}, skipping...`
      );
      return;
    }
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const [feedbacksResponse, chaptersResponse] = await Promise.all([
        CourseFeedbacksService.getByCourse(course.id, signal),
        CourseChaptersService.getByCourse(course.id, signal),
      ]);
      setFeedbacks(feedbacksResponse);
      setChapters(chaptersResponse);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Fetch error for course ${course.id}:`, error);
        message.error('Failed to fetch course details');
      } else {
        console.log(`Fetch aborted for course ${course.id}`);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [course.id]);

  const handleChapterAdd = useCallback(async (newChapter) => {
    try {
      const response = await CourseChaptersService.createChapter(newChapter);
      setChapters((prev) => [...prev, response]);
      message.success('Chapter added successfully');
      return true;
    } catch (error) {
      message.error('Failed to add chapter');
      return false;
    }
  }, []);

  const handleSubChapterAdd = useCallback(async (newSubChapter) => {
    try {
      const response = await CourseSubChaptersService.createSubChapter(
        newSubChapter
      );
      setChapters((prev) =>
        prev.map((c) =>
          c.id === newSubChapter.chapterId
            ? { ...c, subChapters: [...(c.subChapters || []), response] }
            : c
        )
      );
      message.success('Subchapter added successfully');
      return true;
    } catch (error) {
      if (error.response?.status === 409) {
        message.error(error.response.data);
      } else {
        message.error('Failed to add subchapter');
      }
      return false;
    }
  }, []);

  const handleChapterUpdate = useCallback(async (updatedChapter) => {
    try {
      const response = await CourseChaptersService.updateChapter(
        updatedChapter
      );
      setChapters((prev) =>
        prev.map((c) => (c.id === updatedChapter.id ? response : c))
      );
      message.success('Chapter updated successfully');
      return true;
    } catch (error) {
      message.error('Failed to update chapter');
      return false;
    }
  }, []);

  const handleSubChapterUpdate = useCallback(async (updatedSubChapter) => {
    try {
      const response = await CourseSubChaptersService.updateSubChapter(
        updatedSubChapter
      );
      setChapters((prev) =>
        prev.map((c) => ({
          ...c,
          subChapters: c.subChapters?.map((sc) =>
            sc.id === updatedSubChapter.id ? response : sc
          ),
        }))
      );
      message.success('Subchapter updated successfully');
      return true;
    } catch (error) {
      message.error('Failed to update subchapter');
      return false;
    }
  }, []);

  const handleSubChapterDelete = useCallback(async (subChapterId) => {
    try {
      await CourseSubChaptersService.deleteSubChapterById(subChapterId);
      setChapters((prev) =>
        prev.map((c) => ({
          ...c,
          subChapters: c.subChapters?.filter((sc) => sc.id !== subChapterId),
        }))
      );
      message.success('Subchapter deleted successfully');
    } catch (error) {
      message.error('Failed to delete subchapter');
    }
  }, []);

  const handleChapterDelete = useCallback(async (chapterId) => {
    try {
      await CourseChaptersService.deleteChapterById(chapterId);
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      message.success('Chapter deleted successfully');
    } catch (error) {
      message.error('Failed to delete chapter');
    }
  }, []);

  const handleChaptersReorder = useCallback((updatedChapters) => {
    setChapters(updatedChapters);
  }, []);

  const handleSubChaptersReorder = useCallback(
    (chapterId, updatedSubChapters) => {
      setChapters((prev) =>
        prev.map((c) =>
          c.id === chapterId ? { ...c, subChapters: updatedSubChapters } : c
        )
      );
    },
    []
  );

  const handleDelete = useCallback(async () => {
    try {
      await onCourseDelete(course.id);
      closeDeleteModal();
    } catch (error) {
      message.error('Failed to delete course');
    }
  }, [course.id, onCourseDelete]);

  const handleFeedbackDelete = useCallback(async (feedbackId) => {
    try {
      await CourseFeedbacksService.deleteFeedbackById(feedbackId);
      setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
      message.success('Feedback deleted successfully');
    } catch (error) {
      message.error('Failed to delete feedback');
    }
  }, []);

  const handleUpdate = useCallback(
    async (updatedCourse) => {
      const success = await onCourseUpdate(updatedCourse);
      if (success) {
        closeEditModal();
      }
      return success; // Ensure this returns the success value
    },
    [onCourseUpdate]
  );

  const openDetailsModal = useCallback(async () => {
    await fetchCourseDetails();
    setDetailsModalOpen(true);
  }, [fetchCourseDetails]);

  const closeDetailsModal = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    setDetailsModalOpen(false);
  }, []);

  const openEditModal = useCallback(() => setEditModalOpen(true), []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  const openDeleteModal = useCallback(() => setDeleteModalOpen(true), []);
  const closeDeleteModal = useCallback(() => setDeleteModalOpen(false), []);

  const openAddChapterModal = useCallback(
    () => setAddChapterModalOpen(true),
    []
  );
  const closeAddChapterModal = useCallback(
    () => setAddChapterModalOpen(false),
    []
  );

  const openAddSubChapterModal = useCallback((chapterId) => {
    setSelectedChapterId(chapterId);
    setAddSubChapterModalOpen(true);
  }, []);

  const closeAddSubChapterModal = useCallback(() => {
    setAddSubChapterModalOpen(false);
    setSelectedChapterId(null);
  }, []);

  const openUpdateChapterModal = useCallback((chapter) => {
    setSelectedChapter(chapter);
    setUpdateChapterModalOpen(true);
  }, []);

  const closeUpdateChapterModal = useCallback(() => {
    setUpdateChapterModalOpen(false);
    setSelectedChapter(null);
  }, []);

  const openUpdateSubChapterModal = useCallback((subChapter) => {
    setSelectedSubChapter(subChapter);
    setUpdateSubChapterModalOpen(true);
  }, []);

  const closeUpdateSubChapterModal = useCallback(() => {
    setUpdateSubChapterModalOpen(false);
    setSelectedSubChapter(null);
  }, []);

  return (
    <>
      <Space size="middle" style={{ marginTop: '16px' }}>
        <Button
          onClick={openDetailsModal}
          type="primary"
          icon={<InfoOutlined />}
        >
          Details
        </Button>
        <Button onClick={openEditModal} type="primary" icon={<EditOutlined />}>
          Edit
        </Button>
        <Button
          onClick={openDeleteModal}
          type="primary"
          danger
          icon={<DeleteOutlined />}
        >
          Delete
        </Button>
      </Space>

      <EditCourseModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        course={course}
        onSave={handleUpdate}
        categories={categories}
      />

      <CourseDetailsModal
        open={isDetailsModalOpen}
        onClose={closeDetailsModal}
        feedbacks={feedbacks}
        title={'Details of course ' + course.name}
        chapters={chapters}
        onFeedbackDelete={handleFeedbackDelete}
        onChapterDelete={handleChapterDelete}
        onChapterAdd={openAddChapterModal}
        onChapterUpdate={openUpdateChapterModal}
        onSubChapterAdd={openAddSubChapterModal}
        onSubChapterUpdate={openUpdateSubChapterModal}
        onSubChapterDelete={handleSubChapterDelete}
        onChaptersReorder={handleChaptersReorder}
        onSubChaptersReorder={handleSubChaptersReorder}
      />

      <AddChapterModal
        open={isAddChapterModalOpen}
        onClose={closeAddChapterModal}
        onSave={handleChapterAdd}
        courseId={course.id}
      />

      <AddSubChapterModal
        open={isAddSubChapterModalOpen}
        onClose={closeAddSubChapterModal}
        onSave={handleSubChapterAdd}
        chapterId={selectedChapterId}
      />

      <UpdateChapterModal
        open={isUpdateChapterModalOpen}
        onClose={closeUpdateChapterModal}
        onSave={handleChapterUpdate}
        chapter={selectedChapter}
      />

      <UpdateSubChapterModal
        open={isUpdateSubChapterModalOpen}
        onClose={closeUpdateSubChapterModal}
        onSave={handleSubChapterUpdate}
        subChapter={selectedSubChapter}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete the course "${course.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default CourseActions;
