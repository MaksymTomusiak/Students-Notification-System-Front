import React, { useMemo } from 'react';
import { Table } from 'antd';
import CategoryActions from './CategoryActions';

const CategoriesTable = ({
  categories,
  onCategoryItemDelete,
  onSaveCategoryButtonClick,
  pagination,
  onTableChange,
}) => {
  if (categories.length === 0) {
    return <p style={{ textAlign: 'center' }}>No data</p>;
  }

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        render: (_, category) => (
          <CategoryActions
            key={category.id}
            category={category}
            onCategoryDelete={onCategoryItemDelete}
            onCategoryUpdate={onSaveCategoryButtonClick}
          />
        ),
      },
    ],
    [onCategoryItemDelete, onSaveCategoryButtonClick]
  );

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="id"
      pagination={{
        ...pagination,
        showSizeChanger: true,
        onChange: (page, pageSize) =>
          onTableChange({ current: page, pageSize }),
      }}
      loading={false} // Loading is handled by CategoryComponent
      scroll={{ x: true }} // Enable horizontal scrolling if table is too wide
      tableLayout="auto"
      style={{ width: '100%' }}
    />
  );
};

export default CategoriesTable;
