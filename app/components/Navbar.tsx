import { NavLink } from "react-router";
import './navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-logo">

      </div>
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink className="nav-link" to={"/"}>Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/dashboard"}>Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/about"}>About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"/services"}>Services</NavLink>
        </li>
      </ul>
    </nav>
  );
}
