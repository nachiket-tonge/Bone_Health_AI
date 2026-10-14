"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Bone,
  ArrowLeft,
  Activity,
  Calendar,
  Shield,
  ChevronRight,
} from "lucide-react";
import { FractureDetection } from "@/components/fracture-detection";
import { BoneAgeEstimation } from "@/components/bone-age-estimation";
import { BMDRiskAssessment } from "@/components/bmd-risk-assessment";

interface GuestFlowProps {
  onBack: () => void;
  onLogin: () => void;
}

type FlowState = "select" | "fracture" | "bone-age" | "bmd";

export function GuestFlow({ onBack, onLogin }: GuestFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>("select");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={
                flowState === "select" ? onBack : () => setFlowState("select")
              }
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bone className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                Bone Health AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Guest Mode
            </span>
            <Button variant="outline" size="sm" onClick={onLogin}>
              Login to Save
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        {flowState === "select" && (
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
                Select Analysis Type
              </h1>
              <p className="text-muted-foreground">
                Choose an analysis to get started
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
                onClick={() => setFlowState("fracture")}
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Activity className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Fracture Detection
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    Upload an X-ray to detect bone fractures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Image-based analysis
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
                onClick={() => setFlowState("bone-age")}
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Calendar className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    Bone Age Estimation
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    Estimate skeletal maturity from hand X-ray
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Image-based analysis
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
                onClick={() => setFlowState("bmd")}
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    BMD Risk Assessment
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    Evaluate BMD risk based on patient data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Form-based assessment
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-foreground">
                    Login to save your analysis results and access them later
                  </p>
                  <Button size="sm" onClick={onLogin}>
                    Login to Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {flowState === "fracture" && (
          <FractureDetection onBack={() => setFlowState("select")} />
        )}

        {flowState === "bone-age" && (
          <BoneAgeEstimation onBack={() => setFlowState("select")} />
        )}

        {flowState === "bmd" && (
          <BMDRiskAssessment onBack={() => setFlowState("select")} />
        )}
      </main>
    </div>
  );
}
