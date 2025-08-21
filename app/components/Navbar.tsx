import { NavLink } from "react-router";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-logo"></div>
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink className="nav-link" to={"/"}>
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/chat"}>
            Chat
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/h6502"}>
            H6502
          </NavLink>
        </li>
      </ul>
      <button className="nav-signin-btn">SIGN IN</button>
    </nav>
  );
}
