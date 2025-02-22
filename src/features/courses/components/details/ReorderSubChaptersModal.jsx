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
import { CourseSubChaptersService } from '../../services/course.subchapters.service';

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

const ReorderSubChaptersModal = ({
  open = false,
  onClose = () => {},
  subChapters = [],
  onSave = () => {},
}) => {
  const [orderedSubChapters, setOrderedSubChapters] = useState([]);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const sortedSubChapters = [...subChapters].sort(
      (a, b) => a.number - b.number
    );
    setOrderedSubChapters(sortedSubChapters);
  }, [subChapters]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = orderedSubChapters.findIndex(
      (subChapter) => subChapter.id === active.id
    );
    const newIndex = orderedSubChapters.findIndex(
      (subChapter) => subChapter.id === over.id
    );

    const newSubChapters = Array.from(orderedSubChapters);
    const [reorderedItem] = newSubChapters.splice(oldIndex, 1);
    newSubChapters.splice(newIndex, 0, reorderedItem);

    const updatedSubChapters = newSubChapters.map((subChapter, index) => ({
      ...subChapter,
      number: index + 1,
    }));

    setOrderedSubChapters(updatedSubChapters);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const subChaptersIds = orderedSubChapters.map(
        (subChapter) => subChapter.id
      );
      const numbers = orderedSubChapters.map((subChapter) => subChapter.number);
      await CourseSubChaptersService.updateSubChaptersOrder(
        subChaptersIds,
        numbers
      );
      message.success('Subchapter order updated successfully');
      onSave(orderedSubChapters);
      onClose();
    } catch (error) {
      message.error('Failed to update subchapter order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Reorder Subchapters"
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
            JSON.stringify(orderedSubChapters) === JSON.stringify(subChapters)
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
          items={orderedSubChapters.map((subChapter) => subChapter.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ minHeight: '100px' }}>
            {orderedSubChapters.map((subChapter) => (
              <SortableItem
                key={subChapter.id}
                id={subChapter.id}
                name={subChapter.name}
                number={subChapter.number}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </Modal>
  );
};

export default ReorderSubChaptersModal;
