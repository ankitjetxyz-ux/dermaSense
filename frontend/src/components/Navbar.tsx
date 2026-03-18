import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Shop",        path: "/products"      },
  { label: "Routine",     path: "/routine"       },
  { label: "AI Analysis", path: "/skin-analysis" },
  { label: "Account",     path: "/auth"          },
];

const Navbar = () => {
  const location   = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (p: string) => location.pathname === p;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">

        {/* Desktop left nav */}
        <nav className="hidden md:flex flex-1 items-center gap-10">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`font-body text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                isActive(path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <div className="flex flex-1 justify-start md:justify-center">
          <Link to="/" className="font-display text-[1.6rem] italic text-foreground tracking-wide">
            DermaSense
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="hidden md:flex items-center gap-2 border-b border-border pb-1 focus-within:border-primary transition-colors">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              placeholder="Search"
              className="w-20 bg-transparent font-body text-[11px] text-foreground outline-none placeholder:text-muted-foreground/60 focus:w-32 transition-all"
            />
          </div>
          <Link to="/profile" aria-label="Profile" className="text-muted-foreground hover:text-primary transition-colors">
            <User className="h-4 w-4" />
          </Link>
          <button aria-label="Cart" className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag className="h-4 w-4" />
          </button>
          {/* Mobile hamburger */}
          <button className="md:hidden text-muted-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border/40 px-6 py-6 flex flex-col gap-6">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`font-body text-sm font-medium uppercase tracking-widest ${isActive(path) ? "text-primary" : "text-muted-foreground"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
