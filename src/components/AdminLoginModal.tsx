import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/images/logo.webp";

interface AdminLoginModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: (session: { email: string }) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginModal({
  show,
  onClose,
  onSuccess,
}: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((field: "email" | "password", value: string) => {
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!EMAIL_RE.test(value)) return "Enter a valid email address";
    }
    if (field === "password") {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
    }
    return undefined;
  }, []);

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRemember(false);
    setLoading(false);
    setSubmitError(null);
    setErrors({});
    setTouched({});
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    resetForm();
    onClose();
  }, [loading, resetForm, onClose]);

  useEffect(() => {
    if (!show) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [show, handleClose]);

  useEffect(() => {
    if (!show || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    const t = setTimeout(() => emailRef.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", handleTab);
      clearTimeout(t);
    };
  }, [show]);

  const handleFieldBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  };

  const handleFieldChange = (field: "email" | "password", value: string) => {
    if (field === "email") setEmail(value);
    else setPassword(value);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validate("email", email);
    const passErr = validate("password", password);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setSubmitError("Invalid email or password.");
        } else if (res.status === 429) {
          setSubmitError("Too many attempts. Please try again in a moment.");
        } else if (res.status === 404) {
          setSubmitError("Admin portal is not yet available.");
        } else {
          setSubmitError("Sign in failed. Please try again.");
        }
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { email?: string };
      onSuccess?.({ email: data.email ?? email });
      resetForm();
      onClose();
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-login-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden font-montserrat border border-gray-200"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close admin login"
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberred focus-visible:ring-offset-2 transition-colors disabled:opacity-50"
            >
              <X size={22} />
            </button>

            <div className="px-6 sm:px-8 pt-8 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <img
                  src={logo}
                  alt="Cybernest Logo"
                  className="w-32 mb-4"
                />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyberlightred text-cyberred text-[11px] font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </div>
                <h2
                  id="admin-login-title"
                  className="text-2xl font-extrabold text-cyberred"
                >
                  Sign in to continue
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Authorized personnel only.
                </p>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-semibold text-cyberviolet mb-1.5"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyberred/70" />
                    <input
                      ref={emailRef}
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@cybernestsolution.com"
                      value={email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleFieldBlur("email")}
                      disabled={loading}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "admin-email-error" : undefined}
                      className={`w-full rounded-lg bg-cyberlightred pl-9 pr-3 py-2.5 text-sm text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
                        errors.email
                          ? "ring-2 ring-red-400 focus:ring-red-400"
                          : "focus:ring-cyberred"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="admin-email-error"
                      role="alert"
                      className="mt-1 text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-semibold text-cyberviolet"
                    >
                      Password
                    </label>
                    <a
                      href="mailto:cns@cybernestsolution.com?subject=Admin%20password%20reset"
                      className="text-[11px] font-semibold text-cyberred underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberred focus-visible:ring-offset-2 rounded"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyberred/70" />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => handleFieldChange("password", e.target.value)}
                      onBlur={() => handleFieldBlur("password")}
                      disabled={loading}
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "admin-password-error" : undefined}
                      className={`w-full rounded-lg bg-cyberlightred pl-9 pr-10 py-2.5 text-sm text-cyberdark placeholder-cyberred/50 focus:outline-none focus:ring-2 transition-colors disabled:opacity-60 ${
                        errors.password
                          ? "ring-2 ring-red-400 focus:ring-red-400"
                          : "focus:ring-cyberred"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-cyberred/70 hover:text-cyberred hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberred transition-colors disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="admin-password-error"
                      role="alert"
                      className="mt-1 text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <label
                  htmlFor="admin-remember"
                  className="inline-flex items-center gap-2 py-1 text-sm text-cyberviolet cursor-pointer select-none"
                >
                  <input
                    id="admin-remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 accent-cyberred cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberred focus-visible:ring-offset-2 rounded"
                  />
                  Keep me signed in on this device
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 rounded-full bg-cyberred py-2.5 text-sm font-bold text-white shadow-[0_2px_2px_0_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyberred focus-visible:ring-offset-2 transition-opacity ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="mt-5 text-[11px] text-center text-gray-600 leading-relaxed">
                Protected by Cybernest. Unauthorized access is prohibited and
                may be logged.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
