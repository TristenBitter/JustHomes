import { Link } from "react-router-dom";
import logo from "../../assets/JustHomesLogo.png";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <img src={logo} alt="JustHomes" className="site-footer__logo" />
          <p className="site-footer__tagline">
            Family-owned rental properties, proudly serving the Phoenix, Arizona area.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          <Link to="/properties">Properties</Link>
          <Link to="/map">Map</Link>
          <Link to="/apply">Apply</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>

        <p className="site-footer__copyright">© {year} JustHomes. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
