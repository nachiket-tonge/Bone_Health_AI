
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export type UserRole = "PATIENT" | "DOCTOR" | "CLINIC_ADMIN"

export interface AuthResponse {
  token: string
  email: string
  name: string
  role: UserRole
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  clinicName: string
  address: string
  phone: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ProfileResponse {
  id: number
  name: string
  email: string
  role: UserRole
  clinicId?: number
  clinicName?: string
  address?: string
  phone?: string
}

export const api = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || "Signup failed")
    }

    return res.json()
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || "Invalid credentials")
    }

    return res.json()
  },

  getProfile: async (token: string): Promise<ProfileResponse> => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch profile")
    }

    return res.json()
  },


getDashboardSummary: async (token: string, limit = 5) => {
  const response = await fetch(
    `${BASE_URL}/dashboard/summary?recentLimit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("Dashboard summary API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });

    throw new Error(
      `Dashboard summary failed (${response.status}): ${
        errorBody || response.statusText
      }`
    );
  }

  return response.json();
},

}
