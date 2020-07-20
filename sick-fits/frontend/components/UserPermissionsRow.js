import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import SickButton from './styles/SickButton';
import Error from './ErrorMessage';

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

class UserPermissionsRow extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = (updatePermissions) => (event) => {
    const checkbox = event.target;
    let updatedPermissions = [...this.state.permissions];
    let index;

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      index = updatedPermissions.findIndex(
        (permission) => permission === checkbox.value
      );

      updatedPermissions.splice(index, 1);
    }

    this.setState({ permissions: updatedPermissions }, updatePermissions);
  };

  render() {
    const { user, listOfPermissions } = this.props;

    const updatePermissionsMutationVars = {
      permissions: this.state.permissions,
      userId: user.id
    };

    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={updatePermissionsMutationVars}>
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colspan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {listOfPermissions.map((permission) => (
                <td key={`${user.id}-permission-${permission}`}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange(updatePermissions)}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton type="button" disabled={loading} onClick={updatePermissions}>
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default UserPermissionsRow;
