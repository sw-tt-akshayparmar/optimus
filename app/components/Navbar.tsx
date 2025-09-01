import { NavLink, useLocation } from "react-router";
import { useRef, useEffect, useState } from "react";
import "./navbar.css";
export default function Navbar() {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chat" },
    { to: "/h6502", label: "H6502" },
    { to: "/workspace", label: "Workspace" },
  ];

  const location = useLocation();
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const activeIdx = navLinks.findIndex(link => link.to === location.pathname);
    const activeRef = linkRefs.current[activeIdx];
    if (activeRef) {
      const rect = activeRef.getBoundingClientRect();
      const parentRect = activeRef.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setUnderlineStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [location.pathname]);

  return (
    <nav className="nav">
      <div className="nav-logo"></div>
      <div className="nav-list-wrapper" style={{ position: "relative", flex: 1 }}>
        <ul className="nav-list">
          {navLinks.map((link, idx) => (
            <li className="nav-item" key={link.to}>
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " nav-link-active" : "")}
                to={link.to}
                ref={el => {
                  linkRefs.current[idx] = el;
                }}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-underline" style={underlineStyle}></div>
      </div>
      <button className="nav-signin-btn">SIGN IN</button>
    </nav>
  );
}
