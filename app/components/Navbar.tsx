import { NavLink } from "react-router";
import { useRef, useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  const valid = validateEmail(email) && password.length >= 6;

  function handleOpen() {
    setShowPopup(true);
    setTouched(false);
  }
  function handleClose() {
    setShowPopup(false);
    setEmail("");
    setPassword("");
    setTouched(false);
    btnRef.current?.focus();
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (valid) {
      // TODO: Replace with real sign-in logic
      alert("Signed in!");
      handleClose();
    }
  }

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
      </ul> 
      <button className="nav-signin-btn">
        SIGN IN
      </button>
    </nav>
  );
}
