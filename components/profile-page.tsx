"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  LogOut,
  UserRound,
  BriefcaseBusiness,
  Bone,
  Clock3,
} from "lucide-react";
import type { User } from "@/app/page";

interface ProfilePageProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ user, onBack, onLogout }: ProfilePageProps) {
  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const staffDetails = [
    { label: "Full name", value: user.name, icon: UserRound },
    { label: "Work email", value: user.email, icon: Mail },
    { label: "Account role", value: user.role, icon: BriefcaseBusiness },
  ];

  const clinicDetails = [
    {
      label: "Clinic or hospital",
      value: user.clinicName,
      icon: Building2,
    },
    { label: "Registered address", value: user.address, icon: MapPin },
    { label: "Contact number", value: user.phone, icon: Phone },
  ];

  const isStaff =
    user.role === "Clinic Administrator" || user.role === "Doctor";

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#14283f]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onBack}
            aria-label="Return to dashboard"
            className="flex items-center gap-3 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12304a] text-white shadow-sm">
              <Bone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                Bone Health AI
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                CLINICAL ASSESSMENT SUITE
              </span>
            </span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="rounded-xl border-slate-200 bg-white px-3 text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
              <ShieldCheck className="h-3.5 w-3.5" />
              Account settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#12304a] sm:text-4xl">
              Your workspace
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your clinic identity, staff account, and assessment
              activity.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Authenticated workspace
          </div>
        </div>

        {isStaff && (
          <Card className="mb-7 overflow-hidden rounded-2xl border-0 bg-[#12304a] py-0 text-white shadow-lg shadow-[#12304a]/10">
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-white/10" />

                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <Building2 className="h-6 w-6 text-[#7bc9c0]" />
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9edbd4]">
                    Registered organization
                  </p>

                  <h2 className="mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                    {user.clinicName || "Clinic details unavailable"}
                  </h2>

                  <div className="mt-5 flex items-start gap-2.5 text-sm leading-6 text-slate-200">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#7bc9c0]" />
                    <span>{user.address || "Address not provided"}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2.5 text-sm text-slate-200">
                    <Phone className="h-4 w-4 shrink-0 text-[#7bc9c0]" />
                    <span>{user.phone || "Contact number not provided"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Signed-in staff member
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-white/20 ring-2 ring-teal-300/20">
                    {user.avatar && (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-[#dff3ef] text-lg font-bold text-[#087f8c]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold">
                      {user.name}
                    </h3>
                    <p className="mt-1 break-all text-sm text-slate-300">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-teal-300/10 px-3 py-2 text-sm font-semibold text-[#b7eee6]">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {user.role}
                </div>

                <div className="mt-7 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-[#7bc9c0]" />
                    Clinic workspace account
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <CardTitle className="flex items-center gap-3 text-base font-bold text-[#12304a]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5f3] text-teal-700">
                    <UserRound className="h-5 w-5" />
                  </span>
                  Staff account
                </CardTitle>
                <p className="pl-[52px] text-sm text-slate-500">
                  Your authenticated account details
                </p>
              </CardHeader>

              <CardContent className="divide-y divide-slate-100 px-5 sm:px-6">
                {staffDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={detail.label}
                      className="flex items-start gap-3 py-4"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500">
                          {detail.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {detail.value || "Not provided"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {isStaff && (
              <Card className="rounded-2xl border-slate-200/80 bg-white py-0 shadow-sm">
                <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6">
                  <CardTitle className="flex items-center gap-3 text-base font-bold text-[#12304a]">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5f3] text-teal-700">
                      <Building2 className="h-5 w-5" />
                    </span>
                    Organization details
                  </CardTitle>
                </CardHeader>

                <CardContent className="divide-y divide-slate-100 px-5 sm:px-6">
                  {clinicDetails.map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <div
                        key={detail.label}
                        className="flex items-start gap-3 py-4"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-500">
                            {detail.label}
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {detail.value || "Not provided"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="overflow-hidden rounded-2xl border-slate-200/80 bg-white py-0 shadow-sm">
            <CardHeader className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <CardTitle className="flex items-center gap-3 text-base font-bold text-[#12304a]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5f3] text-teal-700">
                  <Activity className="h-5 w-5" />
                </span>
                Assessment activity
              </CardTitle>
              <p className="pl-[52px] text-sm text-slate-500">
                A summary of your assessment workspace
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200/70 bg-[#f7fafc] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Activity className="h-4 w-4 text-teal-700" />
                    <span className="text-xs font-medium">Total scans</span>
                  </div>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-[#12304a]">
                    {user.totalScans ?? 0}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-[#f7fafc] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-4 w-4 text-teal-700" />
                    <span className="text-xs font-medium">Last assessment</span>
                  </div>
                  <p className="mt-3 text-base font-bold text-[#12304a]">
                    {user.lastScanDate || "No assessments yet"}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#12304a]">
                    <FileText className="h-4 w-4 text-teal-700" />
                    Recent reports
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {user.recentReports.length}
                  </span>
                </div>

                {user.recentReports.length > 0 ? (
                  <div className="space-y-2">
                    {user.recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-teal-200 hover:bg-teal-50/40"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {report.type}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <Clock3 className="h-3 w-3" />
                            {report.date}
                          </p>
                        </div>
                        <span className="max-w-[40%] text-right text-xs font-medium text-slate-600">
                          {report.result}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-800">
                      No reports yet
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
                      Completed assessment reports will appear here when
                      available.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#dce8ef] bg-white p-4 shadow-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
          <div>
            <p className="text-sm font-semibold text-[#12304a]">
              Clinical review remains essential
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              AI-assisted assessment results should be reviewed by a qualified
              healthcare professional.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
