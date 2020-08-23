import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
      item {
        id
        title
      }
    }
  }
`;

class AddToCart extends Component {
  render() {
    const { id } = this.props;
    return (
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
        {(addToCart, { error, loading }) => {
          if (loading) {
            return <button>Adding To Cart...</button>;
          }

          if (error) {
            alert(error.message);
          }

          return (<button onClick={addToCart}>Add To Cart 🛒</button>)

        }}
      </Mutation>
    );
  }
}

export default AddToCart;
