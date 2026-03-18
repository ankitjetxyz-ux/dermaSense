import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-secondary/30 border-t border-border/50">
    {/* Newsletter strip */}
    <div className="bg-rose-light/50 border-b border-border/50 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl italic text-foreground mb-1">Join the Ritual</h3>
          <p className="font-body text-xs text-muted-foreground">Skincare routines, ingredient science and exclusive offers.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="font-body text-sm border border-border/60 bg-background px-5 py-3 outline-none focus:border-primary transition-colors w-full sm:w-64"
          />
          <button className="bg-primary text-primary-foreground px-8 py-3 font-body text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </div>

    {/* Links */}
    <div className="container mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <Link to="/" className="font-display text-2xl italic text-foreground mb-4 block">DermaSense</Link>
        <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-[200px]">
          Advanced dermaceutical research meets personalised botanical skincare.
        </p>
      </div>
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/60 font-medium mb-4">Explore</p>
        <ul className="space-y-3">
          {[["Catalog", "/products"], ["Routine Finder", "/routine"], ["Account", "/auth"], ["My Profile", "/profile"]].map(([l, h]) => (
            <li key={l}><Link to={h} className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/60 font-medium mb-4">Science</p>
        <ul className="space-y-3">
          {["Methodology", "Diagnostics", "Ingredients", "Clinical Trials"].map((item) => (
            <li key={item}><a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.2em] text-foreground/60 font-medium mb-4">Support</p>
        <ul className="space-y-3">
          {["Contact Us", "Shipping Policy", "Returns", "FAQ"].map((item) => (
            <li key={item}><a href="#" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</a></li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-border/40 py-6">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">© 2026 DermaSense. All rights reserved.</p>
        <div className="flex gap-8">
          {["Privacy", "Terms", "Cookies"].map((item) => (
            <a key={item} href="#" className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-foreground transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
