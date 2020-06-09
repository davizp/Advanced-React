import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { CURRENT_USER_QUERY } from './User';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGN_IN_MUTATION = gql`
  mutation SING_IN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class SignIn extends Component {
  state = {
    password: '',
    email: '',
  };

  handleSubmit = (signUp) => async (event) => {
    event.preventDefault();

    const response = await signUp();

    console.log(response);

    this.setState({ email: '', password: '' });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation mutation={SIGN_IN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signUp, { error, loading }) => {
          return (
            <Form method="POST" onSubmit={this.handleSubmit(signUp)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign In for An Account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </label>

                <button type="submit">Submit</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default SignIn;
