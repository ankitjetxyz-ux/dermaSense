import { Link, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";

const navItems = [
  { label: "HOME", path: "/" },
  { label: "ROUTINE", path: "/routine" },
  { label: "PRODUCTS", path: "/products" },
];

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center gap-6 px-6 py-3">
        <Link to="/" className="gradient-text text-2xl font-black tracking-tight">
          DermaSense
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative py-2 text-xs font-bold tracking-widest transition ${
                isActive(item.path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {isActive(item.path) ? (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-foreground/90" />
              ) : null}
            </Link>
          ))}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 rounded-md border border-border bg-white/10 backdrop-blur px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              placeholder="Search for products, brands and more"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
              aria-label="Search"
            />
          </div>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-foreground"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          PROFILE
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
