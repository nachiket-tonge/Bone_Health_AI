"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { clinicalApi, Patient, PatientPayload } from "../lib/clinical-api";

interface PatientManagementProps {
  token: string;
  onSelectPatient?: (patient: Patient) => void;
  selectedPatientId?: number;
}

export function PatientManagement({
  token,
  onSelectPatient,
  selectedPatientId,
}: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PatientPayload>({
    fullName: "",
    phone: "",
    age: undefined,
    sex: "",
    address: "",
  });

  const loadPatients = useCallback(
    async (term = search) => {
      setLoading(true);
      setError("");
      try {
        setPatients(await clinicalApi.searchPatients(token, term));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load patients.");
      } finally {
        setLoading(false);
      }
    },
    [token, search],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadPatients(search), 250);
    return () => window.clearTimeout(timer);
  }, [search, loadPatients]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.fullName?.trim()) {
      setError("Patient name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload: PatientPayload = {
        fullName: form.fullName.trim(),
        phone: form.phone?.trim() || undefined,
        age:
          form.age == null || form.age === ("" as unknown as number)
            ? undefined
            : Number(form.age),
        sex: form.sex || undefined,
        address: form.address?.trim() || undefined,
      };
      const created = await clinicalApi.createPatient(token, payload);
      setPatients((current) =>
        [...current, created].sort((a, b) =>
          a.fullName.localeCompare(b.fullName),
        ),
      );
      setForm({
        fullName: "",
        phone: "",
        age: undefined,
        sex: "",
        address: "",
      });
      setShowForm(false);
      onSelectPatient?.(created);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not register patient.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
          <p className="text-sm text-slate-500">
            Search and manage patients registered with your clinic.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-lg bg-[#12304a] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {showForm ? "Cancel" : "Add patient"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"
        >
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Full name *</span>
            <input
              required
              value={form.fullName ?? ""}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Phone</span>
            <input
              value={form.phone ?? ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Age</span>
            <input
              type="number"
              min="0"
              max="130"
              value={form.age ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  age:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="font-medium text-slate-700">Sex</span>
            <select
              value={form.sex ?? ""}
              onChange={(e) => setForm({ ...form, sex: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            >
              <option value="">Not specified</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </label>
          <label className="space-y-1 text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Address</span>
            <input
              value={form.address ?? ""}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              disabled={saving}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Register patient"}
            </button>
          </div>
        </form>
      )}

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by patient name…"
        aria-label="Search patients by name"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
      />

      {loading ? (
        <p className="py-5 text-sm text-slate-500">Loading patients…</p>
      ) : patients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
          <p className="font-medium text-slate-700">No patients found</p>
          <p className="mt-1 text-sm text-slate-500">
            Register a patient or try a different name.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <button
              type="button"
              key={patient.id}
              onClick={() => onSelectPatient?.(patient)}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50 ${
                selectedPatientId === patient.id
                  ? "bg-teal-50 ring-1 ring-teal-200"
                  : ""
              }`}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-900">
                  {patient.fullName}
                </span>
                <span className="block text-sm text-slate-500">
                  {[
                    patient.age != null ? `${patient.age} years` : null,
                    patient.sex,
                    patient.phone,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "No additional details"}
                </span>
              </span>
              {onSelectPatient && (
                <span className="shrink-0 text-sm font-medium text-teal-700">
                  {selectedPatientId === patient.id ? "Selected" : "Select"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
