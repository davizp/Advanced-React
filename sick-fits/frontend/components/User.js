import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
    }
  }
`;

const USER = (props) => (
  <Query query={CURRENT_USER_QUERY} {...props}>
    {(payload) => props.children(payload.data.me)}
  </Query>
);

USER.propTypes = {
  children: PropTypes.func.isRequired,
};

export default USER;
