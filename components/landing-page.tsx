"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bone,
  Building2,
  ShieldCheck,
  Brain,
  Activity,
  User,
  FileText,
  LogOut,
  ArrowRight,
  Stethoscope,
  ClipboardCheck,
} from "lucide-react";
import type { User as UserType } from "@/app/page";

interface LandingPageProps {
  onGuestAccess: () => void;
  onLogin: () => void;
  user: UserType | null;
  onLogout: () => void;
  onViewProfile: () => void;
  onViewReports: () => void;
}

export function LandingPage({
  onGuestAccess,
  onLogin,
  user,
  onLogout,
  onViewProfile,
  onViewReports,
}: LandingPageProps) {
  const initials =
    user?.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8fb] text-[#14283f]">
      {/* Clinic-focused top navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="Bone Health AI home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12304a] text-white shadow-sm">
              <Bone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                Bone Health AI
              </span>
              <span className="hidden text-[11px] font-medium tracking-[0.14em] text-slate-500 sm:block">
                CLINICAL ASSESSMENT SUITE
              </span>
            </span>
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
                  <Avatar className="h-8 w-8">
                    {user.avatar && (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-[#e5f4f2] text-xs font-semibold text-[#087f8c]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-40 truncate text-sm font-semibold text-slate-700 sm:block">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={onViewProfile}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Clinic Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewReports}>
                  <FileText className="mr-2 h-4 w-4" />
                  Assessment Reports
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={onLogin}
              className="rounded-xl bg-[#087f8c] px-5 text-white hover:bg-[#066b76]"
            >
              <Building2 className="mr-2 h-4 w-4" />
              Clinic login
            </Button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute -right-24 top-8 -z-10 h-96 w-96 rounded-full border-[48px] border-teal-100/50" />
          <div className="pointer-events-none absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full border-[36px] border-slate-200/60" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-3.5 py-2 text-xs font-semibold text-teal-800 shadow-sm">
                <Activity className="h-4 w-4" />
                AI-assisted bone health assessment
              </div>

              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#14283f] sm:text-5xl lg:text-[3.5rem]">
                Clinical insights for
                <span className="block text-[#087f8c]">better bone health</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                A clinical support workspace for clinics and hospitals to run
                bone health assessments, review AI-generated findings, and
                prepare reports for professional review.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={onLogin}
                  size="lg"
                  className="h-12 rounded-xl bg-[#087f8c] px-6 font-semibold text-white shadow-sm hover:bg-[#066b76]"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Clinic / Hospital Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  onClick={onGuestAccess}
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-xl border-slate-300 bg-white px-6 font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                >
                  Try the demo
                </Button>
              </div>

              <p className="mt-4 max-w-xl text-xs leading-5 text-slate-500">
                Demo mode is for evaluation only. Demo results are not a
                permanent patient record. AI findings require qualified
                healthcare professional review.
              </p>
            </div>

            {/* Feature overview panel */}
            <div className="mx-auto w-full max-w-lg">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
                      Workspace overview
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[#14283f]">
                      Assessment tools
                    </h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#12304a] text-white">
                    <Stethoscope className="h-5 w-5" />
                  </span>
                </div>

                <div className="space-y-3 pt-5">
                  <FeatureRow
                    icon={<Activity className="h-5 w-5" />}
                    title="Fracture Detection"
                    description="AI-assisted X-ray screening"
                    number="01"
                  />
                  <FeatureRow
                    icon={<Brain className="h-5 w-5" />}
                    title="Bone Age Estimation"
                    description="Skeletal maturity estimation"
                    number="02"
                  />
                  <FeatureRow
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="BMD Risk Assessment"
                    description="Risk assessment from patient data"
                    number="03"
                  />
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-3.5">
                  <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-800" />
                  <p className="text-xs leading-5 text-teal-900">
                    Designed to support clinical workflows—not to replace
                    diagnosis or professional judgement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-slate-200 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-9 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                Clinical support tools
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#14283f] sm:text-3xl">
                One workspace, three assessment capabilities
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                Start with the assessment that fits your clinical workflow.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <CapabilityCard
                icon={<Activity className="h-5 w-5" />}
                title="Fracture Detection"
                description="AI-assisted fracture screening with visual results when available."
              />
              <CapabilityCard
                icon={<Brain className="h-5 w-5" />}
                title="Bone Age Estimation"
                description="Estimate skeletal maturity from an appropriate hand X-ray."
              />
              <CapabilityCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="BMD Risk Assessment"
                description="Review bone mineral density risk estimates based on entered information."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-[#f5f8fb] px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span className="font-semibold text-slate-600">
            Bone Health AI · Clinical Assessment Suite
          </span>
          <span>
            AI-assisted support only. All findings require professional review.
          </span>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-teal-100 hover:bg-teal-50/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-[#087f8c]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#14283f]">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <span className="text-xs font-semibold tracking-wider text-slate-300">
        {number}
      </span>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md">
      <CardContent className="p-5 sm:p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-[#087f8c]">
          {icon}
        </div>
        <h3 className="mt-4 text-base font-bold text-[#14283f]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}
