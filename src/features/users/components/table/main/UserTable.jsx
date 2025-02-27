import React from 'react';
import { Table, Tag, Typography } from 'antd';
import UserActions from './UserActions';

const { Text } = Typography;

function UserTable({ users, onUserDelete, pagination, onTableChange }) {
  if (users.length === 0) {
    return <p style={{ textAlign: 'center' }}>No data</p>;
  }

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: 'Phone Number',
      key: 'phoneNumber',
      align: 'center',
      render: (_, user) => (
        <Text style={{ textAlign: 'center', display: 'block' }}>
          {user.phoneNumber || 'N/A'}
        </Text>
      ),
    },
    {
      title: 'Roles',
      key: 'roles',
      align: 'center',
      render: (_, user) => (
        <>
          {user.roles.map((role) => {
            let color = 'gray';

            if (role === 'Admin') color = 'red';
            else if (role === 'User') color = 'blue';

            return (
              <Tag
                color={color}
                key={role}
                style={{ display: 'inline-block', margin: '0 4px' }}
              >
                {role}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, user) => (
        <UserActions key={user.id} user={user} onUserDelete={onUserDelete} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{
        ...pagination,
        showSizeChanger: true,
        onChange: (page, pageSize) =>
          onTableChange({ current: page, pageSize }),
      }}
      loading={false} // Loading is handled by UserComponent
      scroll={{ x: true }} // Enable horizontal scrolling if table is too wide
      tableLayout="auto"
      style={{ width: '100%' }}
    />
  );
}

export default UserTable;
