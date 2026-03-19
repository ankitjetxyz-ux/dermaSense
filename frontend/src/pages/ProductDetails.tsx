import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck, Leaf, RefreshCw } from "lucide-react";
import { PRODUCTS } from "@/lib/catalog";
import { addToCart } from "@/lib/session";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const product = PRODUCTS.find((item) => item.id === Number(id));
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center flex-col gap-6 px-6">
          <p className="font-display text-3xl text-muted-foreground">Product not found.</p>
          <Link to="/products" className="font-body text-[11px] uppercase tracking-widest text-primary underline underline-offset-4">← Back to Catalog</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <Link to="/products" className="inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="h-3.5 w-3.5" /> Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-secondary/40 border border-border/40 rounded-3xl shadow-lg">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex flex-col h-full">
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.3em] text-accent mb-3">{product.category}</p>
              <h1 className="font-display text-5xl text-foreground mb-5">{product.name}</h1>
              <p className="font-display text-3xl text-primary mb-8">${product.price}.00</p>

              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Benefits */}
              <ul className="space-y-2 mb-10">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 font-body text-sm text-foreground">
                    <span className="h-1 w-4 bg-primary inline-block shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Trust badges */}
              <div className="flex gap-6 mb-10 pb-10 border-b border-border/40">
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-accent" /> Dermatologist Tested
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Leaf className="h-4 w-4 text-accent" /> Clean Formula
                </div>
                <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-widest text-muted-foreground">
                  <RefreshCw className="h-4 w-4 text-accent" /> 30-Day Returns
                </div>
              </div>

              {/* Add to bag */}
              <button
                onClick={() => {
                  addToCart(product);
                  window.dispatchEvent(new Event("cart-updated"));
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1000);
                }}
                className="w-full flex items-center justify-center gap-3 bg-primary rounded-xl text-primary-foreground py-5 font-body text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
              >
                <ShoppingBag className="h-4 w-4" /> {added ? "Added to Bag" : "Add to Bag"}
              </button>

              {/* Ingredients */}
              <div className="mt-10">
                <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Key Ingredients</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{product.ingredients}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
