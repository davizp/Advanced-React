import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';

export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Items extends Component {
  render() {
    const allItemsVariables = {
      skip: this.props.page * perPage - perPage
    };

    return (
      <div>
        <Pagination page={this.props.page} />
        <Query query={ALL_ITEMS_QUERY} variables={allItemsVariables} fetchPolicy="network-only">
          {({ data, error, loading }) => {
            if (loading) {
              return <p>Loading...</p>;
            }

            if (error) {
              return <p>Error: {error.message}</p>;
            }

            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </div>
    );
  }
}

export default Items;
