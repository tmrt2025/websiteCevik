import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/header.css"; // CSS'i aşağıda vereceğiz

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({}); // 👈 Her alt menü için ayrı state

  const menuItems = [
    { to: "/", label: "Homepage" },
    { 
      to: "/AboutCongress", 
      label: "About Congress",
      subItems: [
        { to: "/AboutUs", label: "About Us" },
        { to: "/organizationCommit", label: "Organization Commite" },
      ]
    },
    { to: "/registration", label: "Registration" },
    { to: "/abstractSubmJuryEva", label: "Abstract Submission Jury Evaluation" },
    { to: "/accomodation", label: "Accomodation" },
    { to: "/scientificProgram", label: "Scientific Program" },
    { to: "/workshops", label: "Workshops" },
    { to: "/socialProgram", label: "Social Program" },
    { to: "/partnersAndSponsors", label: "Partners & Sponsors" },
  ];

  // Alt menüyü açıp kapatan fonksiyon
  const toggleSubMenu = (index) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Menüyü kapattığımızda alt menüleri de sıfırla
  const closeMenu = () => {
    setOpen(false);
    setOpenSubMenus({});
  };

  return (
    <div>
      <header className="header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </header>
      <div className={`sidebar ${open ? "open" : ""}`}>
        {menuItems.map((item, i) =>
          item.subItems ? (
            <div key={i} className="submenu-container">
              {/* Üst başlık */}
              <button
                className="sidebar-link submenu-btn"
                onClick={() => toggleSubMenu(i)}
              >
                {item.label} {openSubMenus[i] ? "▲" : "▼"}
              </button>

              {/* Alt menüler */}
              <div className={`submenu ${openSubMenus[i] ? "show" : ""}`}>
                {item.subItems.map((sub, j) => (
                  <Link
                    key={j}
                    to={sub.to}
                    onClick={closeMenu}
                    className="sidebar-sublink"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={i}
              to={item.to}
              onClick={closeMenu}
              className="sidebar-link"
            >
              {item.label}
            </Link>
          )
        )}
      </div>

      {open && <div className="overlay" onClick={closeMenu}></div>}
    </div>
  );
}
