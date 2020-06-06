import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  handleDelete = (deleteItemMutation) => async () => {
    const confirmDeletion = confirm('Are you sure you want to delete this item?');

    if (confirmDeletion) {
      await deleteItemMutation();
    }
  }

  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

    // 2. Filter the delete itemout of the page
    data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);

    // 3. Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  }

  render() {
    const deleteItemVariables = { id: this.props.id };

    return (
      <Mutation mutation={DELETE_ITEM_MUTATION} variables={deleteItemVariables} update={this.update}>
        {(deleteItemMutation, { error }) => (
          <button onClick={this.handleDelete(deleteItemMutation)}>{this.props.children}</button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
