"use client";

import { useCallback, useEffect, useState } from "react";
import { clinicalApi, DashboardSummary } from "@/lib/clinical-api";

interface DashboardDataPanelProps {
  token: string;
}

const typeLabels: Record<string, string> = {
  FRACTURE_DETECTION: "Fracture Detection",
  BONE_AGE: "Bone Age Estimation",
  BMD_RISK: "BMD Risk Assessment",
};

export function DashboardDataPanel({ token }: DashboardDataPanelProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await clinicalApi.getDashboardSummary(token, 5));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();

    const handleAssessmentSaved = () => {
      void refresh();
    };

    window.addEventListener("clinical-assessment-saved", handleAssessmentSaved);
    return () => {
      window.removeEventListener(
        "clinical-assessment-saved",
        handleAssessmentSaved,
      );
    };
  }, [refresh]);

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total assessments</p>
          <p className="mt-2 text-3xl font-bold text-[#12304a]">
            {loading ? "…" : (summary?.totalScans ?? "—")}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Last assessment</p>
          <p className="mt-2 text-lg font-semibold text-[#12304a]">
            {loading
              ? "Loading…"
              : summary?.lastAssessmentAt
                ? new Date(summary.lastAssessmentAt).toLocaleString()
                : "No assessments yet"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent assessments
          </h2>
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            Refresh
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p className="py-6 text-sm text-slate-500">
            Loading assessment history…
          </p>
        ) : !summary?.recentAssessments.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-medium text-slate-700">No assessments yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Saved assessments will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {summary.recentAssessments.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.patientName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {typeLabels[item.assessmentType] ?? item.assessmentType}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.resultSummary}
                  </p>
                </div>
                <time className="shrink-0 text-xs text-slate-500">
                  {new Date(item.performedAt).toLocaleString()}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
