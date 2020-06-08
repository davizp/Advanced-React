import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $email: String!
    $password: String!
    $name: String!
  ) {
    signUp(email: $email, password: $password, name: $name) {
      id
      name
      email
      password
      permissions
    }
  }
`;

class SignUp extends Component {
  state = {
    name: '',
    password: '',
    email: '',
  };

  handleSubmit = (signUp) => async (event) => {
    event.preventDefault();

    const response = await signUp();

    console.log(response);

    this.setState({ name: '', email: '', password: '' });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <Mutation mutation={SIGN_UP_MUTATION} variables={this.state}>
        {(signUp, { error, loading }) => {
          return (
            <Form method="POST" onSubmit={this.handleSubmit(signUp)}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for An Account</h2>
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
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={this.state.name}
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

export default SignUp;
