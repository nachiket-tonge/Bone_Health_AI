"use client";

import { useState } from "react";

import { clinicalApi, type AssessmentType } from "@/lib/clinical-api";

import {
  generateMedicalReport,
  type MedicalReportData,
  type PatientDetails,
  type ClinicDetails,
} from "@/lib/generate-medical-report";

interface ReportDownloadButtonProps {
  /**

   * Clinic details should come from the authenticated user's profile.

   * Optional temporarily so existing assessment components continue to compile

   * while you update them to pass the clinic prop.

   */

  clinic?: ClinicDetails;

  assessmentTitle: string;

  findings: MedicalReportData["findings"];

  images?: MedicalReportData["images"];

  disclaimer?: string;

  buttonLabel?: string;

  /** JWT from the authenticated clinic session. Omit for guest-only reports. */

  token?: string;

  /** Set this to persist the assessment after patient details are submitted. */

  assessmentType?: AssessmentType;

  resultSummary?: string;

  resultDetails?: Record<string, unknown>;
}

const emptyPatient: PatientDetails = {
  fullName: "",

  phone: "",

  age: "",

  sex: "",

  address: "",
};

export function ReportDownloadButton({
  clinic,

  assessmentTitle,

  findings,

  images,

  disclaimer,

  buttonLabel = "Download Report",

  token,

  assessmentType,

  resultSummary,

  resultDetails,
}: ReportDownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [patient, setPatient] = useState<PatientDetails>(emptyPatient);

  const [error, setError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [savedAssessmentId, setSavedAssessmentId] = useState<number | null>(
    null,
  );

  const updatePatient = (field: keyof PatientDetails, value: string) => {
    setPatient((current) => ({ ...current, [field]: value }));

    setError("");
  };

  const handleGenerate = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    setError("");

    if (
      !patient.fullName.trim() ||
      !patient.phone.trim() ||
      !patient.age.trim() ||
      !patient.sex
    ) {
      setError("Please complete all required fields.");

      return;
    }

    if (!/^[0-9+\\-\s()]{7,20}$/.test(patient.phone.trim())) {
      setError("Enter a valid phone number.");

      return;
    }

    const age = Number(patient.age);

    if (!Number.isInteger(age) || age < 1 || age > 120) {
      setError("Enter a valid whole-number age between 1 and 120.");

      return;
    }

    // Keep the PDF generator's required ClinicDetails property satisfied.

    // Pass real authenticated clinic data from the parent component whenever possible.

    const clinicDetails: ClinicDetails = {
      clinicName: clinic?.clinicName?.trim() ?? "",

      address: clinic?.address?.trim() ?? "",

      phone: clinic?.phone?.trim() ?? "",
    };

    // Authenticated clinic reports must include clinic information.
    // Guest reports may proceed with blank clinic fields.
    if (token && !clinicDetails.clinicName) {
      setError(
        "Clinic information is missing. Please sign in again or contact your administrator.",
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Persist once per mounted report form. Existing patients are matched by

      // exact normalized name + phone within the authenticated clinic.

      if (token && assessmentType && savedAssessmentId === null) {
        const fullName = patient.fullName.trim();

        const phone = patient.phone.trim();

        const matches = await clinicalApi.searchPatients(token, fullName);

        const normalizePhone = (value?: string | null) =>
          (value ?? "").replace(/\D/g, "");

        const existingPatient = matches.find(
          (item) =>
            item.fullName.trim().toLowerCase() === fullName.toLowerCase() &&
            normalizePhone(item.phone) === normalizePhone(phone),
        );

        const savedPatient =
          existingPatient ??
          (await clinicalApi.createPatient(token, {
            fullName,

            phone,

            age,

            sex: patient.sex,

            address: patient.address.trim() || undefined,
          }));

        const savedAssessment = await clinicalApi.saveAssessment(token, {
          patientId: savedPatient.id,

          assessmentType,

          resultSummary:
            resultSummary ?? `${assessmentTitle} completed for ${fullName}`,

          resultDetails: {
            ...(resultDetails ?? {}),

            patientAge: age,

            patientSex: patient.sex,
          },
        });

        setSavedAssessmentId(savedAssessment.id);

        window.dispatchEvent(new Event("clinical-assessment-saved"));
      }

      await generateMedicalReport({
        clinic: clinicDetails,

        assessmentTitle,

        patient: {
          ...patient,

          fullName: patient.fullName.trim(),

          phone: patient.phone.trim(),

          age: String(age),

          sex: patient.sex,

          address: patient.address.trim(),
        },

        findings,

        images,

        disclaimer,
      });

      setIsOpen(false);
    } catch (generationError) {
      console.error(
        "Report generation or persistence failed:",

        generationError,
      );

      setError(
        generationError instanceof Error
          ? `Unable to save the assessment or generate the PDF: ${generationError.message}`
          : "Unable to save the assessment or generate the PDF. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");

          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isGenerating) {
              setIsOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-form-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl"
          >
            <div className="mb-5">
              <h2
                id="report-form-title"
                className="text-xl font-semibold text-foreground"
              >
                Patient Details
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Enter the details to include in this assessment report.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="report-full-name"
                  className="text-sm font-medium"
                >
                  Patient full name *
                </label>

                <input
                  id="report-full-name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  value={patient.fullName}
                  onChange={(event) =>
                    updatePatient("fullName", event.target.value)
                  }
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="report-phone" className="text-sm font-medium">
                    Phone number *
                  </label>

                  <input
                    id="report-phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={20}
                    value={patient.phone}
                    onChange={(event) =>
                      updatePatient("phone", event.target.value)
                    }
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="report-age" className="text-sm font-medium">
                    Age (years) *
                  </label>

                  <input
                    id="report-age"
                    type="number"
                    min={1}
                    max={120}
                    step={1}
                    required
                    value={patient.age}
                    onChange={(event) =>
                      updatePatient("age", event.target.value)
                    }
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    placeholder="e.g. 45"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="report-sex" className="text-sm font-medium">
                  Sex *
                </label>

                <select
                  id="report-sex"
                  required
                  value={patient.sex}
                  onChange={(event) => updatePatient("sex", event.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select sex</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>

                  <option value="Not specified">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="report-address" className="text-sm font-medium">
                  Address
                </label>

                <textarea
                  id="report-address"
                  autoComplete="street-address"
                  rows={2}
                  maxLength={300}
                  value={patient.address}
                  onChange={(event) =>
                    updatePatient("address", event.target.value)
                  }
                  className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter address (optional)"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                These details are used to generate this PDF in your browser.
                This form does not save them to the database.
              </p>

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? "Generating PDF..." : "Generate PDF"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
