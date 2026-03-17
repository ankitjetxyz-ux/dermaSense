import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm animate-fade-in">
          <div className="text-xs font-bold tracking-widest text-muted-foreground">DERMASENSE</div>
          <div className="gradient-text mt-4 text-6xl font-black">404</div>
          <p className="mt-4 text-muted-foreground">
            This page doesn’t exist. Try heading back to the store.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-gradient px-6 py-3 text-sm">
              Go to Home
            </Link>
            <Link to="/products" className="btn-outline px-6 py-3">
              Browse Products
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
