import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ShieldCheck, Leaf, RefreshCw } from "lucide-react";

const PRODUCTS: Record<number, { name: string; category: string; price: number; image: string; description: string; ingredients: string; benefits: string[] }> = {
  1: { name: "Hyaluronic Serum",     category: "Skincare", price: 45, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", description: "A high-potency restorative serum engineered with triple-weight hyaluronic molecules for multi-depth cellular hydration and architectural skin support.", ingredients: "Sodium Hyaluronate (3 molecular weights), Ceramide NP, Panthenol, Niacinamide", benefits: ["Deep multi-layer hydration", "Plumps fine lines", "Strengthens skin barrier", "Suitable for all skin types"] },
  2: { name: "Vitamin C Complex",    category: "Skincare", price: 65, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80", description: "Bio-available 20% Vitamin C complex combined with ferulic acid and vitamin E for visible brightening and oxidative stress protection.", ingredients: "L-Ascorbic Acid 20%, Ferulic Acid, Tocopherol, Rosa Canina Extract", benefits: ["Visibly reduces dark spots", "Boosts collagen synthesis", "Antioxidant protection", "Evens skin tone"] },
  3: { name: "Matte Foundation",     category: "Makeup",   price: 52, image: "https://images.unsplash.com/photo-1596704017254-9b121068f044?auto=format&fit=crop&w=1200&q=80", description: "Skin-matching foundation with invisible coverage and a breathable, second-skin matte finish that lasts all day.", ingredients: "Aqua, Cyclopentasiloxane, SPF 15, Kaolin, Hyaluronic Acid", benefits: ["All-day wear", "Breathable formula", "SPF 15 protection", "20 shades available"] },
  4: { name: "Body Oil Tint",        category: "Bodycare", price: 38, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1200&q=80", description: "A sheer, luminous body oil with a soft tint that hydrates, nourishes and imparts structural luster.", ingredients: "Argan Oil, Jojoba Esters, Iron Oxides, Vitamin E, Rosehip Seed Oil", benefits: ["24h hydration", "Natural luminance", "Non-greasy absorption", "Vegan formula"] },
  5: { name: "Niacinamide Toner",    category: "Skincare", price: 34, image: "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=1200&q=80", description: "10% Niacinamide concentration for visible pore refinement, sebum regulation and skin barrier restoration.", ingredients: "Niacinamide 10%, Zinc PCA, Hyaluronic Acid, Allantoin", benefits: ["Minimises pore appearance", "Controls excess sebum", "Evens skin texture", "Brightens complexion"] },
  6: { name: "Satin Lip Treatment",  category: "Makeup",   price: 22, image: "https://images.unsplash.com/photo-1631730486134-c99a59e2ebea?auto=format&fit=crop&w=1200&q=80", description: "Tinted moisture with a satin finish that conditions, plumps and defines lips throughout the day.", ingredients: "Shea Butter, Vitamin E, Rosehip Oil, Natural Pigments, Hyaluronic Acid", benefits: ["Plumping effect", "12h moisture", "8 natural shades", "Cruelty-free"] },
  7: { name: "Peptide Eye Cream",    category: "Skincare", price: 72, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80", description: "Multi-peptide complex targeting fine lines, dark circles and puffiness in the delicate periorbital zone.", ingredients: "Argireline, Leuphasyl, Caffeine, Vitamin K, Hyaluronic Acid", benefits: ["Reduces crow's feet", "Diminishes dark circles", "Depuffs eye area", "Clinically tested"] },
  8: { name: "Rose Facial Mist",     category: "Skincare", price: 28, image: "https://images.unsplash.com/photo-1607748851687-ba9a10438621?auto=format&fit=crop&w=1200&q=80", description: "Antioxidant thermal mist with pure rose water for instant hydration and skin-setting throughout the day.", ingredients: "Rosa Damascena Water, Glycerin, Aloe Vera, Panthenol, Centella Extract", benefits: ["Instant skin reset", "Sets makeup", "Antioxidant boost", "Travel-friendly 100ml"] },
};

const ProductDetails = () => {
  const { id } = useParams();
  const product = PRODUCTS[Number(id)];

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center flex-col gap-6 px-6">
          <p className="font-display text-3xl italic text-muted-foreground">Product not found.</p>
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
            <div className="aspect-square overflow-hidden bg-secondary/40 border border-border/40">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex flex-col h-full">
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.3em] text-accent mb-3">{product.category}</p>
              <h1 className="font-display text-5xl italic text-foreground mb-5">{product.name}</h1>
              <p className="font-display text-3xl italic text-primary mb-8">${product.price}.00</p>

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
              <button className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-5 font-body text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-primary/90 transition-all">
                <ShoppingBag className="h-4 w-4" /> Add to Bag
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
