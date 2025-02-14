import React, { useMemo } from 'react';
import { Table } from 'antd';
import CategoryTableRow from './CategoryTableRow';

const CategoriesTable = ({
  categories,
  onCategoryItemDelete,
  onSaveCategoryButtonClick,
}) => {
  if (categories.length === 0) {
    return <p>No data</p>;
  }

  const columns = [
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
        <CategoryTableRow
          key={category.id}
          category={category}
          onCategoryDelete={onCategoryItemDelete}
          onCategoryUpdate={onSaveCategoryButtonClick}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default CategoriesTable;
