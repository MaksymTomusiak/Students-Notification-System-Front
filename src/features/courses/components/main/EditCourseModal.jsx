import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Button,
  Form,
  Flex,
  DatePicker,
  Select,
  message,
} from 'antd';
import {
  validateCourseName,
  validateImageUrl,
  validateDescription,
  validateLanguage,
  validateRequirements,
  validateDates,
} from '../../hooks/courseValidations';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EditCourseModal = ({ open, onClose, course, onSave, categories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course && open) {
      form.setFieldsValue({
        name: course.name || '',
        imageUrl: course.imageUrl || '',
        description: course.description || '',
        language: course.language || '',
        requirements: course.requirements || '',
        dates:
          course.startDate && course.finishDate
            ? [dayjs(course.startDate), dayjs(course.finishDate)]
            : null,
        categoriesIds: course.categories?.map((category) => category.id) || [],
      });
    }
  }, [course, open, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const courseData = {
        ...course, // Preserve unchanged fields like id
        ...values,
        startDate: values.dates[0].toISOString(),
        finishDate: values.dates[1].toISOString(),
      };
      const success = await onSave(courseData);
      if (success) {
        message.success('Course updated successfully');
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Course"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Course Name"
          rules={[{ validator: validateCourseName }]}
        >
          <Input placeholder="Enter course name" />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ validator: validateImageUrl }]}
        >
          <Input placeholder="Enter image URL" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ validator: validateDescription }]}
        >
          <TextArea placeholder="Enter description" rows={3} />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ validator: validateLanguage }]}
        >
          <Input placeholder="Enter language" />
        </Form.Item>

        <Form.Item
          name="requirements"
          label="Requirements"
          rules={[{ validator: validateRequirements }]}
        >
          <TextArea placeholder="Enter requirements" rows={3} />
        </Form.Item>

        <Form.Item
          name="dates"
          label="Course Duration"
          rules={[{ validator: validateDates }]}
        >
          <RangePicker />
        </Form.Item>

        <Form.Item
          name="categoriesIds"
          label="Categories"
          rules={[
            {
              required: false, // Optional field; set to true if required
              message: 'Please select at least one category',
            },
          ]}
        >
          <Select
            mode="multiple"
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            placeholder="Select categories"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify="center" gap="small">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseModal;
