import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from './Cart';

const Nav = () => (
  <User>
    {(me) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {me && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Account</a>
            </Link>
            <SignOut />
          </>
        )}
        {!me && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {(toggleCart) => (
            <button onClick={toggleCart}>My Cart</button>
          )}
        </Mutation>
      </NavStyles>
    )}
  </User>
);

export default Nav;
