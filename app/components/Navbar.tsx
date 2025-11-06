"use client";
import { useEffect, useState } from "react";

const sections = ["about", "experience", "skills", "projects", "contact"];

export default function Navbar() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 150) {
          current = id;
        }
      });
      setActive(current);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        <span className="text-xl font-semibold">Kushagra Kanaujia</span>
        <div className="flex gap-8 text-sm">
          {sections.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`capitalize hover:text-cyan-400 transition ${
                active === id ? "nav-active" : ""
              }`}
            >
              {id}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

