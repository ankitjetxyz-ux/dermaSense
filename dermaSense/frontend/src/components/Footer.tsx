import { Link } from "react-router-dom";

const footerLinks = {
  shop: [
    { label: "Find My Routine", path: "/routine" },
    { label: "Products", path: "/products" },
  ],
  company: [
    { label: "About Us", path: "/" },
    { label: "FAQ", path: "/" },
  ],
  legal: [
    { label: "Privacy Policy", path: "/" },
    { label: "Terms of Use", path: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background/98">
      <div className="container mx-auto px-6 py-10 md:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="gradient-text text-xl font-black tracking-tight">
              DermaSense
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Skincare, but smarter. Curated routines and products for real skin.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground">SHOP</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.shop.map((item) => (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className="text-sm font-semibold text-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground">COMPANY</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.company.map((item) => (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className="text-sm font-semibold text-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-muted-foreground">LEGAL</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {footerLinks.legal.map((item) => (
                <li key={item.path + item.label}>
                  <Link
                    to={item.path}
                    className="text-sm font-semibold text-foreground transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DermaSense. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
