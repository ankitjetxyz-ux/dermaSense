import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { setCurrentUser } from "@/lib/session";

interface LoginUser {
  id: number;
  fullName: string;
  email: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await api.post<LoginUser, { email: string; password: string }>("/auth/login", { email, password });
      setCurrentUser(user);
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
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

          <div className="ds-card p-10 md:p-14">
            <div className="w-14 h-14 bg-rose-light rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <div className="text-center mb-10">
              <h1 className="font-display text-4xl text-foreground mb-2">Login</h1>
              <p className="font-body text-xs text-muted-foreground">
                Sign in to view your profile and saved routines.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  placeholder="Your password"
                  required
                  className="w-full border-b border-border bg-transparent outline-none py-2 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary transition-colors"
                />
              </div>

              {error && <p className="font-body text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-primary rounded-xl text-primary-foreground py-4 font-body text-[11px] uppercase tracking-[0.2em] disabled:opacity-60 hover:bg-primary/90 transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center font-body text-xs text-muted-foreground mt-8">
              New here? <Link to="/auth" className="underline underline-offset-4 hover:text-foreground">Create an account</Link>
            </p>
            <p className="text-center font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-4">
              or <Link to="/skin-analysis" className="hover:text-foreground underline underline-offset-4 transition-colors">start the skin questionnaire</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
