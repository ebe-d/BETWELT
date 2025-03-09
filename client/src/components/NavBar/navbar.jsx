import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
  <div className="scryix-logo">
    <h1 className='gradient-text' style={{fontSize:60}}>
      SRYIX
    </h1>
  </div>

  <ul className="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

  );
}

export default Navbar;
