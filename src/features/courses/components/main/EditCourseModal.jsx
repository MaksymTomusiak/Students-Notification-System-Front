import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Button,
  Form,
  Flex,
  DatePicker,
  Select,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  validateCourseName,
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
        Name: values.name,
        Description: values.description,
        Language: values.language,
        Requirements: values.requirements,
        startDate: values.dates[0].toISOString(),
        finishDate: values.dates[1].toISOString(),
        CategoriesIds: values.categoriesIds || [],
        Image:
          values.image && values.image[0]?.originFileObj
            ? values.image[0].originFileObj
            : null, // Include the file object directly
      };

      const success = await onSave(courseData); // Pass the object to onSave, maintaining the structure
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error('Failed to update course: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Edit Course"
      open={open}
      onCancel={handleCancel}
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
          name="image"
          label="Image"
          valuePropName="file"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[
            {
              validator: async (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.resolve();
                }
                const file = value[0]?.originFileObj;
                if (file) {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    return Promise.reject('File must be an image');
                  }
                  const isLt2M = file.size / 1024 / 1024 < 2; // Limit to 2MB
                  if (!isLt2M) {
                    return Promise.reject('Image must be smaller than 2MB');
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
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
