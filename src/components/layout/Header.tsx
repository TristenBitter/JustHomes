import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  { to: "/properties", label: "Properties" },
  { to: "/map", label: "Map" },
  { to: "/apply", label: "Apply" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-brand" onClick={() => setMenuOpen(false)}>
          <span className="site-brand__mark" aria-hidden="true">
            🏡
          </span>
          JustHomes
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `site-nav__link ${isActive ? "site-nav__link--active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/apply" className="btn btn-primary site-nav__cta" onClick={() => setMenuOpen(false)}>
            Start Application
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
