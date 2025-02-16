import React from 'react';
import { Table, Tag } from 'antd';
import UserActions from './UserActions';

function UserTable({ users, onUserDelete }) {
  if (users.length === 0) {
    return <p>No data</p>;
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
      render: (_, user) => user.phoneNumber || 'N/A',
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
              <Tag color={color} key={role}>
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
      pagination={{ pageSize: 10 }}
    />
  );
}

export default UserTable;
