import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

// Returns a time-of-day greeting and picks how "risen" the horizon
// graphic should look — this is the page's signature detail: the
// brand panel visually reflects whatever time the person is checking in.
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: "Still working late?", lift: 0.15 };
  if (hour < 12) return { text: "Good morning", lift: 0.85 };
  if (hour < 17) return { text: "Good afternoon", lift: 0.6 };
  if (hour < 21) return { text: "Good evening", lift: 0.35 };
  return { text: "Working late tonight?", lift: 0.1 };
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const greeting = getGreeting();

  const [form, setForm] = useState({ loginId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.loginId.trim() || !form.password) {
      setError("Enter your employee ID or email, and your password.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(form.loginId.trim(), form.password);
      navigate("/dashboard", { replace: true });
      // eslint-disable-next-line no-unused-expressions
      user;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "That employee ID/email or password didn't match. Try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper font-body">
      {/* Brand panel — horizon graphic, hidden on small screens */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-horizon p-12 text-paper">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gold/90 blur-3xl transition-all duration-700"
          style={{ opacity: greeting.lift * 0.5, height: `${greeting.lift * 55}%` }}
        />
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
          viewBox="0 0 500 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle
            cx="250"
            cy={260 - greeting.lift * 190}
            r="46"
            fill="#FFB84D"
            opacity="0.9"
          />
          <path
            d="M0,190 C80,150 160,150 250,170 C340,190 420,150 500,170 L500,260 L0,260 Z"
            fill="#171923"
            opacity="0.55"
          />
        </svg>

        <div className="relative z-10">
          <span className="font-display text-xl font-semibold tracking-tight">
            Dayflow
          </span>
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="font-display text-4xl leading-tight font-semibold">
            {greeting.text}.
          </p>
          <p className="mt-4 text-paper/80">
            Check in, track today's tasks, and see how the team is doing —
            all in one place.
          </p>
        </div>

        <p className="relative z-10 text-sm text-paper/50">
          © {new Date().getFullYear()} Dayflow. Built for people-first teams.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="font-display text-xl font-semibold text-ink">
              Dayflow
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Use the employee ID or email your company gave you.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Employee ID or email
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                autoComplete="username"
                placeholder="OT-JODO-2023-0001 or you@company.com"
                value={form.loginId}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-dusk hover:text-coral transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 pr-10 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink py-2.5 font-medium text-white transition-colors hover:bg-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Setting up your company for the first time?{" "}
            <Link
              to="/register"
              className="font-medium text-dusk hover:text-coral transition-colors"
            >
              Create an account
            </Link>
          </p>

          <p className="mt-2 text-center text-xs text-slate-400">
            Employee accounts are created by your HR admin, not here.
          </p>
        </div>
      </div>
    </div>
  );
}
