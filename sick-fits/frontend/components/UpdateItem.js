import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import Router from 'next/router';
import Form from './styles/Form';
import Error from '../components/ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    $image: String
    $largeImage: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = event => {
    const { name, type, value } = event.target;

    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: val });
  };

  handleSubmit = updateItemMutation => async event => {
    event.preventDefault();

    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });

    Router.push({
      pathname: '/',
      // query: { id: res.data.updateItem.id },
    });
  };

  uploadFile = async event => {
    const files = event.target.files;
    const data = new FormData();

    // data.append('cloud_name', 'dvhponpbr');
    data.append('upload_preset', 'sickfits');
    data.append('file', files[0]);

    try {
      const res = await fetch(
        '//api.cloudinary.com/v1_1/dvhponpbr/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );

      const file = await res.json();

      this.setState({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url,
      });
    } catch (ex) {
      console.error(ex);
    }
  };

  render() {
    const { title, image, price, description } = this.state;
    const singleItemPayload = { id: this.props.id };

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={singleItemPayload}>
        {({ data, loading }) => {

          if (loading) {
            return <p>Loading...</p>;
          }

          if (!data.item) {
            return <p>No Item Found for ID {this.props.id}</p>;
          }

          console.log('data', data);

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={this.handleSubmit(updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={data.item.title}
                        // value={title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="file">
                      Image
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload an image"
                        onChange={this.uploadFile}
                      />
                      {data.item.image && (
                        <img
                          width="200"
                          src={data.item.image}
                          alt="Upload Preview"
                        />
                      )}
                   </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="text"
                        id="price"
                        name="price"
                        placeholder="Price"
                        // value={price}
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        type="number"
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <button>Submit</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
