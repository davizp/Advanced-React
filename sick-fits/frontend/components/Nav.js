import Link from 'next/link';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <NavStyles>
    <Link href="/items">
      <a href="">items</a>
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
