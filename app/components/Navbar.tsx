import { NavLink, useLocation } from "react-router";
import { useRef, useEffect, useState } from "react";

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
    <nav className="bg-card shadow-nav rounded-lg mx-auto max-w-[900px] px-8 flex items-center justify-between min-h-[56px] my-4">
      <div className="h-8 w-8 mr-3 rounded-lg shadow-cardDark object-cover bg-cardDark" />
      <div className="relative flex-1">
        <ul className="flex gap-4 list-none m-0 p-0">
          {navLinks.map((link, idx) => (
            <li className="rounded transition hover:bg-cardDark hover:shadow-md" key={link.to}>
              <NavLink
                className={({ isActive }) =>
                  `inline-block text-primary font-medium text-base px-3.5 py-2 rounded transition-colors ${isActive ? "text-accent" : ""} hover:bg-primary hover:text-cardDark no-underline`
                }
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
        <div
          className="absolute bottom-0 h-1 rounded bg-gradient-to-r from-accent via-primary to-indigo-400 transition-all z-10"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
        ></div>
      </div>
      <button className="relative z-10 bg-gradient-to-r from-accent via-primary to-indigo-400 bg-[length:300%_300%] text-white border-none rounded-xl px-6 py-2 text-base font-semibold cursor-pointer ml-4 h-11 shadow-btn flex items-center justify-center overflow-hidden transition-shadow animate-gradient-move disabled:bg-bg-muted disabled:text-chatBtnDisabledText disabled:cursor-not-allowed">
        SIGN IN
      </button>
    </nav>
  );
}
