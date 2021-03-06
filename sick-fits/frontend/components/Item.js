import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import Title from './styles/Title';
import formatMoney from '../lib/formatMoney';
import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';
// import styled from 'styled-components';

class Item extends Component {
  render() {
    const { item } = this.props;

    return (
      <ItemStyles>
        <Title>
          {item.image && <img src={item.image} alt={item.title} />}
          <Link href={{ pathname: '/update', query: { id: item.id } }}>
            <a>{item.title}</a>
          </Link>
        </Title>
        <PriceTag>{formatMoney(item.price)}</PriceTag>

        <div className="buttonList">
          <Link href={{ pathname: '/update', query: { id: item.id } }}>
            <a>Edit ✏️</a>
          </Link>
          <button>Add To Cart</button>
          <DeleteItem id={item.id}>Delete This Item</DeleteItem>
          <AddToCart id={item.id} />
        </div>
      </ItemStyles>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
