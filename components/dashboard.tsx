"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { tokenStore } from "@/lib/token";
import { DashboardDataPanel } from "@/components/dashboard-data-panel";
import { PatientManagement } from "@/components/patient-management";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Activity,
  ArrowRight,
  Bone,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

import { FractureDetection } from "@/components/fracture-detection";

import { BoneAgeEstimation } from "@/components/bone-age-estimation";

import { BMDRiskAssessment } from "@/components/bmd-risk-assessment";

import type { User as UserType } from "@/app/page";

interface DashboardProps {
  user: UserType;

  onLogout: () => void;

  onViewProfile: () => void;
}

type DashboardView = "overview" | "fracture" | "bone-age" | "bmd";

const assessments = [
  {
    id: "fracture" as const,

    number: "01",

    title: "Fracture Detection",

    description: "Analyze an X-ray image for AI-assisted fracture screening.",

    detail: "X-ray image",

    icon: Activity,
  },

  {
    id: "bone-age" as const,

    number: "02",

    title: "Bone Age Estimation",

    description: "Estimate skeletal maturity from a hand X-ray image.",

    detail: "Hand X-ray",

    icon: Calendar,
  },

  {
    id: "bmd" as const,

    number: "03",

    title: "BMD Risk Assessment",

    description: "Assess bone mineral density risk from patient information.",

    detail: "Patient data",

    icon: ShieldCheck,
  },
];

export function Dashboard({ user, onLogout, onViewProfile }: DashboardProps) {
  const [view, setView] = useState<DashboardView>("overview");
  const token = tokenStore.get();

  const initials =
    user.name

      .trim()

      .split(/\s+/)

      .filter(Boolean)

      .map((part) => part[0])

      .join("")

      .slice(0, 2)

      .toUpperCase() || "U";

  const scrollToAssessments = () => {
    document

      .getElementById("assessment-tools")

      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#14283f]">
      {/* Polished top navigation */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setView("overview")}
            aria-label="Go to dashboard overview"
            className="flex min-w-0 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12304a] text-white">
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

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 md:flex">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              AI-assisted tools
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Open profile menu"
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-2 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 sm:gap-3 sm:pr-3"
                >
                  <Avatar className="h-8 w-8">
                    {user.avatar && (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    )}

                    <AvatarFallback className="bg-[#e5f4f2] text-xs font-semibold text-[#087f8c]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <span className="hidden max-w-36 truncate text-sm font-semibold text-slate-700 sm:block">
                    {user.name}
                  </span>

                  <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={onViewProfile}>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setView("overview")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onLogout} variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {view === "overview" && (
          <div className="space-y-9">
            {/* Welcome panel */}

            <section className="relative overflow-hidden rounded-2xl border border-[#dce8ef] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border-[36px] border-teal-50/80" />

              <div className="pointer-events-none absolute -right-2 top-16 h-36 w-36 rounded-full border border-teal-100/90" />

              <div className="relative max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                  <Activity className="h-3.5 w-3.5" />
                  Bone health assessment workspace
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#14283f] sm:text-3xl lg:text-[2.1rem]">
                  Welcome back, {user.name}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  Choose an assessment to begin. Review AI-generated findings
                  carefully and use them to support—not replace—clinical
                  judgement.
                </p>

                <Button
                  onClick={scrollToAssessments}
                  className="mt-6 bg-[#087f8c] text-white hover:bg-[#066b76]"
                >
                  Explore assessments
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </section>

            {/* Assessment cards */}

            <section id="assessment-tools" className="scroll-mt-28 space-y-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
                    Assessment workspace
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-[#14283f] sm:text-2xl">
                    Choose an assessment
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Start a new AI-assisted bone health assessment.
                  </p>
                </div>

                <span className="text-xs font-medium text-slate-500">
                  3 assessment tools
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {assessments.map((assessment) => {
                  const Icon = assessment.icon;

                  return (
                    <Card
                      key={assessment.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open ${assessment.title}`}
                      onClick={() => setView(assessment.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          setView(assessment.id);
                        }
                      }}
                      className="group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-[#087f8c] to-[#7bc9c0]" />

                      <CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="mb-5 flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-[#087f8c] transition-colors group-hover:bg-[#087f8c] group-hover:text-white">
                            <Icon className="h-6 w-6" />
                          </div>

                          <span className="text-xs font-semibold tracking-[0.12em] text-slate-300">
                            {assessment.number}
                          </span>
                        </div>

                        <CardTitle className="flex items-center justify-between gap-3 text-base font-bold text-[#14283f]">
                          {assessment.title}

                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700" />
                        </CardTitle>

                        <CardDescription className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">
                          {assessment.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />

                            {assessment.detail}
                          </span>

                          <span className="text-xs font-semibold text-teal-700">
                            Start assessment
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Patient management and live backend dashboard data */}
            {token && (
              <section className="space-y-6">
                <PatientManagement token={token} />
                <DashboardDataPanel token={token} />
              </section>
            )}

            {/* Clinical disclaimer */}

            <div className="flex items-start gap-3 rounded-xl border border-[#dce8ef] bg-[#edf5f8] p-4 sm:p-5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#315b76] shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#193d56]">
                  Clinical decision support
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  These tools provide AI-assisted assessments and are not a
                  substitute for professional medical judgement. Findings should
                  be reviewed by a qualified healthcare professional before
                  clinical decisions are made.
                </p>
              </div>
            </div>
          </div>
        )}

        {view === "fracture" && (
          <FractureDetection
            user={user}
            token={token ?? ""}
            onBack={() => setView("overview")}
          />
        )}

        {view === "bone-age" && (
          <BoneAgeEstimation
            user={user}
            token={token ?? ""}
            onBack={() => setView("overview")}
          />
        )}

        {view === "bmd" && (
          <BMDRiskAssessment
            user={user}
            token={token ?? ""}
            onBack={() => setView("overview")}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Bone Health AI</span>

          <span>
            AI-assisted clinical support · Professional review required
          </span>
        </div>
      </footer>
    </div>
  );
}
