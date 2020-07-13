import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import UserPermissionsRow from './UserPermissionsRow';
import Table from './styles/Table';

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const permissions = [
  'ADMIN',
  'USER',
  'ITEM_CREATE',
  'ITEM_UPDATE',
  'ITEM_DELETE',
  'PERMISSION_UPDATE'
];

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, error, loading }) => {
      console.log('loading', loading);

      return (
        <div>
          <Error error={error} />
          <p>Heey</p>
          {!loading && !error && (
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {permissions.map((permission) => (
                    <th key={`permission-title-${permission}`}>
                      {permission.replace('_', ' ')}
                    </th>
                  ))}
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <UserPermissionsRow
                    key={`user-permission-${user.id}`}
                    listOfPermissions={permissions}
                    user={user}
                  />
                ))}
              </tbody>
            </Table>
          )}
        </div>
      );
    }}
  </Query>
);

export default Permissions;
