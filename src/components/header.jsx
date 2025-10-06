import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/header.css"; // CSS'i aşağıda vereceğiz

export default function Header() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { to: "/", label: "Anasayfa" },
    { to: "/AboutCongress", label: "About Congress" },
    { to: "/abstractSubmJuryEva", label: "Abstract Submission Jury Evaluation" },
    { to: "/accomodation", label: "Accomodation" },
    { to: "/scientificProgram", label: "Scientific Program" },
    { to: "/workshops", label: "Workshops" },
    { to: "/socialProgram", label: "Social Program" },
    { to: "/partnersAndSponsors", label: "Partners & Sponsors" },
    { to: "/pastCongresses", label: "Past Congresses" },
  ];

  return (
    <>
      <header className="header">
        {/* Menü butonu */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        {menuItems.map((item, i) => (
          <Link
            key={i}
            to={item.to}
            onClick={() => setOpen(false)} // tıklanınca sidebar kapanır
            className="sidebar-link"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Arka plan karartması */}
      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}
