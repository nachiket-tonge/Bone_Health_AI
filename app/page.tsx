
"use client";

import { useState, useEffect, useCallback } from "react";
import { LandingPage } from "@/components/landing-page";
import { GuestFlow } from "@/components/guest-flow";
import { Dashboard } from "@/components/dashboard";
import { ProfilePage } from "@/components/profile-page";
import { AuthModal } from "@/components/auth-modal";
import { api } from "@/lib/api";
import { tokenStore } from "@/lib/token";

type View = "landing" | "guest" | "dashboard" | "profile";

interface AssessmentSummary {
  id: number;
  patientId: number;
  patientName: string;
  assessmentType: string;
  performedAt: string;
  resultSummary: string;
  resultDetails?: Record<string, unknown>;
}

interface DashboardSummary {
  totalScans: number;
  lastAssessmentAt: string | null;
  recentAssessments: AssessmentSummary[];
}

export interface User {
  name: string;
  email: string;
  role: "Clinic Administrator" | "Doctor" | "Unsupported account";

  clinicId?: number;
  clinicName?: string;
  address?: string;
  phone?: string;

  avatar?: string;
  totalScans: number;
  lastScanDate: string | null;
  recentReports: {
    id: string;
    type: string;
    date: string;
    result: string;
  }[];
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Map backend profile to the frontend User shape.
  const buildUser = (profile: {
    name: string;
    email: string;
    role: string;
    clinicId?: number;
    clinicName?: string;
    address?: string;
    phone?: string;
  }): User => ({
    name: profile.name,
    email: profile.email,
    role:
      profile.role === "CLINIC_ADMIN"
        ? "Clinic Administrator"
        : profile.role === "DOCTOR"
          ? "Doctor"
          : "Unsupported account",
    clinicId: profile.clinicId,
    clinicName: profile.clinicName,
    address: profile.address,
    phone: profile.phone,
    totalScans: 0,
    lastScanDate: null,
    recentReports: [],
  });

  // Fetch assessment activity from the backend.
  const refreshAssessmentActivity = useCallback(async () => {
    const token = tokenStore.get();
    if (!token) return;

    try {
      const summary: DashboardSummary =
        await api.getDashboardSummary(token, 5);

      setUser((current) => {
        if (!current) return current;

        return {
          ...current,
          totalScans: summary.totalScans ?? 0,
          lastScanDate: summary.lastAssessmentAt
            ? new Date(summary.lastAssessmentAt).toLocaleString()
            : null,
          recentReports: (summary.recentAssessments ?? []).map((item) => ({
            id: String(item.id),
            type: item.assessmentType
              .replaceAll("_", " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase()),
            date: new Date(item.performedAt).toLocaleString(),
            result: item.resultSummary,
          })),
        };
      });
    } catch (error) {
      console.error("Failed to load assessment activity:", error);
    }
  }, []);

  // Restore the authenticated session.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) return;

    api
      .getProfile(token)
      .then((profile) => {
        const restoredUser = buildUser(profile);

        if (restoredUser.role === "Unsupported account") {
          tokenStore.clear();
          return;
        }

        setUser(restoredUser);
        setCurrentView("dashboard");
      })
      .catch(() => tokenStore.clear());
  }, []);

  // Refresh stats whenever the user opens the profile.
  useEffect(() => {
    if (currentView === "profile" && user) {
      void refreshAssessmentActivity();
    }
  }, [currentView, user?.email, refreshAssessmentActivity]);

  const handleLoginSubmit = async (
    email: string,
    password: string,
  ) => {
    setAuthError(null);

    try {
      const res = await api.login({ email, password });
      tokenStore.set(res.token);

      const profile = await api.getProfile(res.token);
      const loggedInUser = buildUser(profile);

      if (loggedInUser.role === "Unsupported account") {
        tokenStore.clear();
        setAuthError(
          "This account does not have a supported staff role. Please contact the administrator.",
        );
        return;
      }

      setUser(loggedInUser);
      setShowAuthModal(false);
      setCurrentView("dashboard");
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  };

  const handleSignupSubmit = async (
    name: string,
    email: string,
    password: string,
    clinicName: string,
    address: string,
    phone: string,
  ) => {
    setAuthError(null);

    try {
      const res = await api.signup({
        name,
        email,
        password,
        clinicName,
        address,
        phone,
      });

      tokenStore.set(res.token);

      const profile = await api.getProfile(res.token);
      const registeredUser = buildUser(profile);

      if (registeredUser.role === "Unsupported account") {
        tokenStore.clear();
        setAuthError(
          "Clinic registration did not return a valid staff role.",
        );
        return;
      }

      setUser(registeredUser);
      setShowAuthModal(false);
      setCurrentView("dashboard");
    } catch (error: unknown) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Clinic registration failed",
      );
    }
  };

  const handleLogout = () => {
    tokenStore.clear();
    setUser(null);
    setCurrentView("landing");
  };

  return (
    <main className="min-h-screen bg-background">
      {currentView === "landing" && (
        <LandingPage
          onGuestAccess={() => setCurrentView("guest")}
          onLogin={() => setShowAuthModal(true)}
          user={user}
          onLogout={handleLogout}
          onViewProfile={() => setCurrentView("profile")}
          onViewReports={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "guest" && (
        <GuestFlow
          onBack={() => setCurrentView("landing")}
          onLogin={() => setShowAuthModal(true)}
        />
      )}

      {currentView === "dashboard" && user && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onViewProfile={() => setCurrentView("profile")}
        />
      )}

      {currentView === "profile" && user && (
        <ProfilePage
          user={user}
          onBack={() => setCurrentView("dashboard")}
          onLogout={handleLogout}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setAuthError(null);
          }}
          onLogin={handleLoginSubmit}
          onSignup={handleSignupSubmit}
          error={authError}
        />
      )}
    </main>
  );
}
;
