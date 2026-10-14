"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bone,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  LoaderCircle,
  Building2,
} from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (
    name: string,
    email: string,
    password: string,
    clinicName: string,
    address: string,
    phone: string,
  ) => Promise<void>;
  error: string | null;
}

export function AuthModal({
  onClose,
  onLogin,
  onSignup,
  error,
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await onLogin(loginEmail.trim(), loginPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await onSignup(
        contactName.trim(),
        signupEmail.trim(),
        signupPassword,
        organizationName.trim(),
        clinicAddress.trim(),
        clinicPhone.trim(),
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#10263a]/55 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="my-auto w-full max-w-md gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-2xl shadow-[#10263a]/20"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#12304a] via-[#087f8c] to-[#7bc9c0]" />

        <CardHeader className="pb-3 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12304a] text-white">
                <Bone className="h-5 w-5" />
              </span>
              <div>
                <CardTitle
                  id="auth-title"
                  className="text-lg font-bold tracking-tight text-[#14283f]"
                >
                  Bone Health AI
                </CardTitle>
                <p className="mt-1 text-xs text-slate-500">
                  Clinic & hospital workspace
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close authentication dialog"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="pb-6 pt-3">
          <div className="mb-6 rounded-xl border border-teal-100 bg-teal-50/70 p-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-800" />
              <p className="text-xs leading-5 text-teal-900">
                Access the clinic workspace to run AI-assisted bone health
                assessments and prepare reports for clinical review.
              </p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {(["login", "signup"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTab(item);
                  setShowPassword(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  tab === item
                    ? "bg-white text-[#12304a] shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item === "login" ? "Clinic sign in" : "Register clinic"}
              </button>
            ))}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800"
            >
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-login-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Work email
                </label>
                <input
                  id="clinic-login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="name@clinic.com"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-login-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="clinic-login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#087f8c] font-semibold text-white hover:bg-[#066b76]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to workspace"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Clinic or hospital name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="clinic-name"
                    required
                    value={organizationName}
                    onChange={(event) =>
                      setOrganizationName(event.target.value)
                    }
                    placeholder="Organization name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-contact-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Authorized contact name
                </label>
                <input
                  id="clinic-contact-name"
                  required
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  placeholder="Contact person's full name"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-address"
                  className="text-sm font-medium text-slate-700"
                >
                  Clinic or hospital address
                </label>
                <textarea
                  id="clinic-address"
                  required
                  value={clinicAddress}
                  onChange={(event) => setClinicAddress(event.target.value)}
                  placeholder="Full clinic address"
                  maxLength={1000}
                  className={inputClass}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Clinic contact number
                </label>
                <input
                  id="clinic-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={clinicPhone}
                  onChange={(event) => setClinicPhone(event.target.value)}
                  placeholder="Clinic phone number"
                  maxLength={30}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-signup-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Work email
                </label>
                <input
                  id="clinic-signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  placeholder="name@clinic.com"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="clinic-signup-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="clinic-signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#087f8c] font-semibold text-white hover:bg-[#066b76]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Register clinic"
                )}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            AI-generated assessments support clinical review and do not replace
            professional medical judgement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
