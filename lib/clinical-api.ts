const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export type AssessmentType = "FRACTURE_DETECTION" | "BONE_AGE" | "BMD_RISK";

export interface Patient {
  id: number;
  fullName: string;
  phone?: string | null;
  age?: number | null;
  sex?: string | null;
  address?: string | null;
  clinicId: number;
  createdAt: string;
}

export interface PatientPayload {
  fullName: string;
  phone?: string;
  age?: number;
  sex?: string;
  address?: string;
}

export interface AssessmentRecord {
  id: number;
  assessmentType: AssessmentType;
  patientId: number;
  patientName: string;
  resultSummary: string;
  resultDetails: Record<string, unknown>;
  performedAt: string;
}

export interface DashboardSummary {
  totalScans: number;
  lastAssessmentAt: string | null;
  recentAssessments: AssessmentRecord[];
}

export interface SaveAssessmentPayload {
  patientId: number;
  assessmentType: AssessmentType;
  resultSummary: string;
  resultDetails?: Record<string, unknown>;
}

async function request<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const clinicalApi = {
  searchPatients(token: string, search = "") {
    const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
    return request<Patient[]>(`/patients${query}`, token);
  },

  createPatient(token: string, payload: PatientPayload) {
    return request<Patient>("/patients", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getPatient(token: string, id: number) {
    return request<Patient>(`/patients/${id}`, token);
  },

  saveAssessment(token: string, payload: SaveAssessmentPayload) {
    return request<AssessmentRecord>("/assessments", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAssessments(token: string, options: { patientId?: number; limit?: number } = {}) {
    const params = new URLSearchParams();
    if (options.patientId != null) params.set("patientId", String(options.patientId));
    if (options.limit != null) params.set("limit", String(options.limit));
    const query = params.size ? `?${params.toString()}` : "";
    return request<AssessmentRecord[]>(`/assessments${query}`, token);
  },

  getDashboardSummary(token: string, recentLimit = 5) {
    return request<DashboardSummary>(
      `/dashboard/summary?recentLimit=${encodeURIComponent(String(recentLimit))}`,
      token,
    );
  },
};