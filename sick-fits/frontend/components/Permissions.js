import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

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
          {(!loading && !error) &&
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {permissions.map(permission => <th>{permission.replace('_', ' ')}</th>)}
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {permissions.map(permission => (
                      <td>
                        <label htmlFor={`${user.id}-permission-${permission}`}>
                          <input type="checkbox" defaultChecked={user.permissions.includes(permission)} />
                        </label>
                      </td>
                    ))}
                    <td><SickButton>Update</SickButton></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        </div>
      );
    }}
  </Query>
);

export default Permissions;
