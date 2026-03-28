import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { api } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { setCurrentUser } from "@/lib/session";

interface CreatedUser {
  id: number;
  fullName: string;
  email: string;
  age?: number | null;
  gender?: string | null;
}

const Auth = () => {
  const [email, setEmail]       = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge]           = useState("");
  const [gender, setGender]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const created = await api.post<CreatedUser, { email: string; fullName: string; password: string; age?: number; gender?: string }>("/auth/register", {
        email,
        fullName,
        password,
        ...(age ? { age: Number(age) } : {}),
        ...(gender ? { gender } : {}),
      });
      setCurrentUser({ id: created.id, email: created.email, fullName: created.fullName });
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md animate-fade-in">

          {/* Card */}
          <div className="ds-card p-10 md:p-14">
            {/* Icon */}
            <div className="w-14 h-14 bg-rose-light rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <div className="text-center mb-10">
              <h1 className="font-display text-4xl text-foreground mb-2">Welcome</h1>
              <p className="font-body text-xs text-muted-foreground">Sign up to save your skin profile and personalised routine.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Age (optional)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="25"
                  min={1}
                  max={120}
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Gender (optional)</label>
                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Female, Male, Non-binary, Prefer not to say"
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>

              {error && <p className="font-body text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading || !fullName || !email || !password}
                className="w-full bg-primary rounded-xl text-primary-foreground py-4 font-body text-[11px] uppercase tracking-[0.2em] disabled:opacity-60 hover:bg-primary/90 transition-all"
              >
                {loading ? "Saving..." : "Create Account"}
              </button>
            </form>

            <p className="text-center font-body text-xs text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4 hover:text-foreground">Sign in</Link>
            </p>
          </div>

          {/* CTA to skip */}
          <p className="text-center font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-6">
            or{" "}
            <a href="/routine" className="hover:text-foreground underline underline-offset-4 transition-colors">start your skin diagnostic first</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
