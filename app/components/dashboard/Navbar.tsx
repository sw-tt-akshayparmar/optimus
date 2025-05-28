import { NavLink } from "react-router";
import '../navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink className="nav-link" to={""}>Dashboard Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"map"}>Map</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"monitor"}>Monitor</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to={"weather"}>Weather</NavLink>
        </li>
      </ul>
    </nav>
  );
}
