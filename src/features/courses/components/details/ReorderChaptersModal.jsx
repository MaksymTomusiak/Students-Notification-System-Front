import React, { useState, useEffect } from 'react';
import { Modal, Button, Flex, message } from 'antd';
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CourseChaptersService } from '../../services/course.chapters.service';

const SortableItem = ({ id, name, number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    userSelect: 'none',
    padding: '8px',
    margin: '0 0 8px 0',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Flex justify="space-between" align="center">
        <span>{name}</span>
        <span>{`#${number}`}</span>
      </Flex>
    </div>
  );
};

const ReorderChaptersModal = ({
  open = false,
  onClose = () => {},
  chapters = [],
  onSave = () => {},
}) => {
  const [orderedChapters, setOrderedChapters] = useState([]);
  const [saving, setSaving] = useState(false);

  // Sensors for drag functionality
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before starting drag
      },
    })
  );

  useEffect(() => {
    const sortedChapters = [...chapters].sort((a, b) => a.number - b.number);
    setOrderedChapters(sortedChapters);
  }, [chapters]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedChapters.findIndex(
      (chapter) => chapter.id === active.id
    );
    const newIndex = orderedChapters.findIndex(
      (chapter) => chapter.id === over.id
    );

    const newChapters = Array.from(orderedChapters);
    const [reorderedItem] = newChapters.splice(oldIndex, 1);
    newChapters.splice(newIndex, 0, reorderedItem);

    const updatedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      number: index + 1,
    }));

    setOrderedChapters(updatedChapters);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const chaptersIds = orderedChapters.map((chapter) => chapter.id);
      const numbers = orderedChapters.map((chapter) => chapter.number);
      await CourseChaptersService.updateChaptersOrder(chaptersIds, numbers);
      message.success('Chapter order updated successfully');
      onSave(orderedChapters);
      onClose();
    } catch (error) {
      message.error('Failed to update chapter order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Reorder Chapters"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSaveOrder}
          loading={saving}
          disabled={
            JSON.stringify(orderedChapters) === JSON.stringify(chapters)
          }
        >
          Save Order
        </Button>,
      ]}
      width={600}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedChapters.map((chapter) => chapter.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ minHeight: '100px' }}>
            {orderedChapters.map((chapter) => (
              <SortableItem
                key={chapter.id}
                id={chapter.id}
                name={chapter.name}
                number={chapter.number}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

export default ReorderChaptersModal;
