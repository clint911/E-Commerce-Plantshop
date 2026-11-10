interface NavbarProps {
  cartCount: number;
}

const asset = (name: string) => `/assets/${name}`;

export default function Navbar({ cartCount }: NavbarProps) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <a className="active" href="#home">
        Home
      </a>
      <a href="#shop">Shop</a>
      <a href="#about">About Us</a>
      <a href="#contact">Contact</a>
      <a className="cart" href="#shop" aria-label={`${cartCount} items in shopping bag`}>
        <img src={asset("883a3.svg")} alt="" />
        <span>
          <img src={asset("9a5e6.svg")} alt="" />
          <b>{cartCount}</b>
        </span>
      </a>
    </nav>
  );
}
