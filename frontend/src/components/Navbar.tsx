import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home",     path: "/" },
  { label: "Products", path: "/products" },
  { label: "Profile",  path: "/profile" },
];

const Navbar = () => {
  const location   = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (p: string) => location.pathname === p;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="container mx-auto ds-glass rounded-2xl flex items-center justify-between px-5 py-3">

        {/* Desktop left nav */}
        <nav className="hidden md:flex flex-1 items-center gap-2">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`font-body text-[11px] font-semibold uppercase tracking-[0.16em] transition-all px-3 py-2 rounded-full ${
                isActive(path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex flex-1 justify-start md:justify-center">
          <Link to="/" className="font-display text-2xl text-foreground tracking-tight leading-none">
            DermaSense
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            to="/login"
            className="border border-border/80 bg-background/80 rounded-full px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            Login
          </Link>
          {/* Mobile hamburger */}
          <button className="md:hidden text-muted-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 container mx-auto ds-glass rounded-2xl px-6 py-6 flex flex-col gap-3">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`font-body text-sm font-semibold uppercase tracking-widest px-3 py-2 rounded-xl ${
                isActive(path) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="font-body text-sm font-medium uppercase tracking-widest text-primary"
          >
            Login
          </Link>
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="font-body text-sm font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
