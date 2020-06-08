import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => (
  <NavStyles>
    <User>
      {({ me }) => (
        !!me.name && <p>{me.name}</p>
      )}
    </User>
    <Link href="/items">
      <a href="">Shop</a>
    </Link>
    <Link href="/sell">
      <a href="">sell</a>
    </Link>
    <Link href="/signup">
      <a href="">signup</a>
    </Link>
    <Link href="/orders">
      <a href="">orders</a>
    </Link>
    <Link href="/me">
      <a href="">Account</a>
    </Link>
  </NavStyles>
);

export default Nav;
