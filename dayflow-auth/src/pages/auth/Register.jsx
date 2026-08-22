import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2, Upload, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Company logo must be an image file.");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreview(null);
  }

  function validate() {
    if (
      !form.companyName.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill in every field before continuing.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Enter a valid email address.";
    }
    if (form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords don't match.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      // Sent as multipart/form-data so the optional logo file can ride
      // along with the rest of the registration fields.
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "confirmPassword") payload.append(key, value);
      });
      if (logoFile) payload.append("companyLogo", logoFile);

      await register(payload);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "We couldn't create that account. That email may already be in use.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper font-body">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-horizon p-12 text-paper">
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full"
          viewBox="0 0 500 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <circle cx="250" cy="120" r="46" fill="#FFB84D" opacity="0.9" />
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
            Set your team up in minutes.
          </p>
          <p className="mt-4 text-paper/80">
            You're creating the first admin account for your company. Add
            employees, assign tasks, and track performance right after.
          </p>
        </div>

        <p className="relative z-10 text-sm text-paper/50">
          © {new Date().getFullYear()} Dayflow. Built for people-first teams.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <span className="font-display text-xl font-semibold text-ink">
              Dayflow
            </span>
          </div>

          <h1 className="font-display text-2xl font-semibold text-ink">
            Create your company account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            This becomes the admin account for your organization.
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
            {/* Company logo upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Company logo{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 rounded-lg border border-dashed border-slate-100 bg-white flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload size={18} className="text-slate-400" />
                  )}
                </div>
                <label
                  htmlFor="companyLogo"
                  className="cursor-pointer rounded-lg border border-slate-100 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-card hover:bg-slate-50 transition-colors"
                >
                  Choose file
                  <input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-slate-400 hover:text-coral transition-colors"
                    aria-label="Remove logo"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Company name
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Orion Tech Pvt. Ltd."
                value={form.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jordan"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doyle"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 pr-9 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-100 bg-white px-3.5 py-2.5 pr-9 text-ink placeholder:text-slate-400 shadow-card focus:outline-none focus:ring-2 focus:ring-coral/40 focus:border-coral"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-dusk hover:text-coral transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
