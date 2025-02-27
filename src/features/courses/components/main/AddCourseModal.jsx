import React, { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  Form,
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

const AddCourseModal = ({ open, onClose, onSave, categories }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))?.sub; // Use optional chaining for safety

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const courseData = {
        Name: values.name, // Match backend field name
        Description: values.description,
        Language: values.language,
        Requirements: values.requirements,
        CreatorId: userId,
        StartDate: values.dates[0].toISOString(),
        FinishDate: values.dates[1].toISOString(),
        CategoriesIds: values.categoriesIds || [],
        Image:
          values.image && values.image[0].originFileObj
            ? values.image[0].originFileObj
            : null, // Include the file object directly
      };

      const success = await onSave(courseData); // Pass the object to onSave, maintaining the structure
      if (success) {
        message.success('Course added successfully');
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error('Failed to add course: ' + (error.message || error));
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
      title="Add New Course"
      open={open}
      onCancel={handleCancel}
      footer={null}
      style={{ textAlign: 'center' }}
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
                  return Promise.reject('Please upload an image');
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
          <RangePicker disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item
          name="categoriesIds"
          label="Categories"
          rules={[
            {
              required: false,
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

        <Form.Item style={{ textAlign: 'center' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
