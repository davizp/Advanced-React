import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $password: String!
    $confirmPassword: String!
    $resetToken: String!
  ) {
    resetPassword(
      password: $password
      confirmPassword: $confirmPassword
      resetToken: $resetToken
    ) {
      id
      name
      email
      # permissions
    }
  }
`;

class ResetPassword extends Component {
  state = {
    password: '',
    confirmPassword: ''
  };

  handleSubmit = (signUp) => async (event) => {
    event.preventDefault();

    const response = await signUp();

    console.log(response);

    this.setState({ password: '', confirmPassword: '' });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { password, confirmPassword } = this.state;
    const { resetToken } = this.props;
    const requestResetVariables = { password, confirmPassword, resetToken };

    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={requestResetVariables} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(requestResetMutation, { error, loading, called }) => {
          return (
            <Form
              method="POST"
              onSubmit={this.handleSubmit(requestResetMutation)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <Error error={error} />
                {!error && !loading && called && (
                  <p>Success!</p>
                )}
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleChange}
                  />
                </label>

                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={this.handleChange}
                  />
                </label>

                <button type="submit">Reset Password!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPassword;
