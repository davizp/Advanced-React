import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: '',
  };

  handleSubmit = (requestResetMutation) => async (event) => {
    event.preventDefault();

    const response = await requestResetMutation();

    this.setState({ email: '' });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestResetMutation, { error, loading, called }) => {
          return (
            <Form
              method="POST"
              onSubmit={this.handleSubmit(requestResetMutation)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request a password reset</h2>
                <Error error={error} />
                {!error && !loading && called && (
                  <p>Success! Check your email for a reset link!</p>
                )}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>

                <button type="submit">Request Reset!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
