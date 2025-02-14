import { useState } from 'react';
import { Form, Input, Button, Flex, message } from 'antd';
import { CategoryService } from '../services/category.service';
import { useValidateCategory } from '../hooks/useValidateCategory';

const AddCategoryForm = ({ onAddCategory }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { validateCategory } = useValidateCategory();

  const onSubmit = async (values) => {
    const { name } = values;

    const validationError = validateCategory(name);
    if (validationError) {
      message.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await CategoryService.createCategory(values);
      message.success('Category created successfully');
      onAddCategory(response);
      form.resetFields();
    } catch (error) {
      if (error.response?.status === 409) {
        message.error(error.response.data);
      } else {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onSubmit}
      style={{ marginBottom: '1rem' }}
    >
      <Flex
        gap="small"
        align="center"
        justify="center"
        style={{ width: '100%' }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter name' }]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add
        </Button>
      </Flex>
    </Form>
  );
};

export default AddCategoryForm;
