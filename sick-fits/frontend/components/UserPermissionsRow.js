import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SickButton from './styles/SickButton';

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

  handlePermissionChange = (event) => {
    const checkbox = event.target;
    let updatedPermissions = [...this.state.permissions];
    let index;

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      index = updatedPermissions.findIndex(permission => permission === checkbox.value);

      updatedPermissions.splice(index, 1);
    }

    this.setState({ permissions: updatedPermissions });
  }

  render() {
    const { user, listOfPermissions } = this.props;

    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {listOfPermissions.map((permission) => (
          <td key={`${user.id}-permission-${permission}`}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default UserPermissionsRow;