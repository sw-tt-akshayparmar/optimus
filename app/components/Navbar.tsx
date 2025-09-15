import { NavLink, useLocation } from "react-router";
import { useRef, useEffect, useState } from "react";
import { Button } from "primereact/button";

export default function Navbar() {
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chat" },
    // { to: "/h6502", label: "H6502" },
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
    <nav className="bg-surface-card shadow-md rounded-md mx-auto max-w-3xl px-content flex items-center justify-between min-h-[56px] my-4">
      <div className="h-8 w-8 mr-inline rounded-md shadow-md object-cover bg-surface-d" />
      <div className="relative flex-1">
        <ul className="flex gap-4 list-none m-0 p-0">
          {navLinks.map((link, idx) => (
            <li className="rounded-md transition-colors hover:bg-surface-d" key={link.to}>
              <NavLink
                className={({ isActive }) =>
                  `inline-block font-inter font-medium text-base px-3.5 py-2 rounded-md transition-colors text-text ${isActive ? "text-primary" : "text-text-secondary"} hover:bg-primary hover:text-primary-color-text focus:outline-none focus:ring-2 focus:ring-primary`
                }
                to={link.to}
                ref={el => {
                  linkRefs.current[idx] = el;
                }}
                tabIndex={0}
                aria-current={location.pathname === link.to ? "page" : undefined}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div
          className="absolute bottom-0 h-1 rounded-md bg-gradient-to-r from-accent via-primary to-indigo-400 transition-all z-10"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
        ></div>
      </div>
      <Button
        icon="pi pi-user-plus"
        label="Sign in"
        className="font-inter bg-primary text-primary-color-text px-4 py-2 border-none shadow focus:ring-2 focus:ring-primary"
      />
    </nav>
  );
}
