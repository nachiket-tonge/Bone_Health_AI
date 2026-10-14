"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { User as UserType } from "@/app/page";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { ArrowLeft, Shield, Loader2, Download, RefreshCw } from "lucide-react";

import { ReportDownloadButton } from "@/components/report-download-button";

interface BMDRiskAssessmentProps {
  user?: UserType;

  token?: string;
  onBack: () => void;
}

type ViewState = "form" | "analyzing" | "results";

type RiskLevel = "low" | "medium" | "high";

interface FormData {
  age: string;

  gender: string;

  weight: string;

  height: string;

  fracture: string;

  medication: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function BMDRiskAssessment({
  user,
  token,
  onBack,
}: BMDRiskAssessmentProps) {
  const [view, setView] = useState<ViewState>("form");

  const [formData, setFormData] = useState<FormData>({
    age: "",

    gender: "",

    weight: "",

    height: "",

    fracture: "",

    medication: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [result, setResult] = useState<any>(null);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (
      !formData.age ||
      isNaN(Number(formData.age)) ||
      Number(formData.age) <= 0
    ) {
      newErrors.age = "Please enter a valid age";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (
      !formData.weight ||
      isNaN(Number(formData.weight)) ||
      Number(formData.weight) <= 0
    ) {
      newErrors.weight = "Please enter a valid weight";
    }

    if (
      !formData.height ||
      isNaN(Number(formData.height)) ||
      Number(formData.height) <= 0
    ) {
      newErrors.height = "Please enter a valid height";
    }

    if (!formData.fracture) {
      newErrors.fracture = "Select fracture history";
    }

    if (!formData.medication) {
      newErrors.medication = "Select medication";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAssess = async () => {
    if (!validateForm()) return;

    setView("analyzing");

    try {
      const response = await fetch(`${API_URL}/bmd/predict`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          age: Number(formData.age),

          sex: formData.gender === "male" ? "M" : "F",

          fracture: formData.fracture,

          weight_kg: Number(formData.weight),

          height_cm: Number(formData.height),

          medication: formData.medication,
        }),
      });

      const data = await response.json();

      setResult(data);

      setView("results");
    } catch (err) {
      console.error(err);

      alert("Prediction Failed");

      setView("form");
    }
  };

  const handleNewAssessment = () => {
    setFormData({
      age: "",

      gender: "",

      weight: "",

      height: "",

      fracture: "",

      medication: "",
    });

    setErrors({});

    setResult(null);

    setView("form");
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const riskConfig = {
    low: {
      label: "Low Risk",

      color: "text-success",

      bgColor: "bg-success",

      description:
        "Normal bone density. Continue regular health monitoring and maintain a healthy lifestyle.",
    },

    medium: {
      label: "Medium Risk",

      color: "text-warning-foreground",

      bgColor: "bg-warning",

      description:
        "Moderate risk detected. Consider lifestyle modifications and consult with your healthcare provider.",
    },

    high: {
      label: "High Risk",

      color: "text-destructive",

      bgColor: "bg-destructive",

      description:
        "Elevated risk. Please consult with a healthcare professional for further evaluation and treatment options.",
    },
  };

  return (
    <div className="space-y-6">
      {/*Header \*/}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            BMD Risk Assessment
          </h1>

          <p className="text-muted-foreground">
            Evaluate bone mineral density risk based on patient data
          </p>
        </div>
      </div>

      {/*Form State \*/}

      {view === "form" && (
        <Card className="mx-auto w-full max-w-lg">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>

            <CardDescription>
              Enter the patient details to assess BMD risk
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/*Age \*/}

            <div className="space-y-2">
              <label
                htmlFor="age"
                className="text-sm font-medium text-foreground"
              >
                Age
              </label>

              <input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.age ? "border-destructive" : "border-input"
                }`}
              />

              {errors.age && (
                <p className="text-xs text-destructive">{errors.age}</p>
              )}
            </div>

            {/*Gender \*/}

            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-foreground"
              >
                Gender
              </label>

              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.gender ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">Select gender</option>

                <option value="male">Male</option>

                <option value="female">Female</option>
              </select>

              {errors.gender && (
                <p className="text-xs text-destructive">{errors.gender}</p>
              )}
            </div>

            {/*Weight \*/}

            <div className="space-y-2">
              <label
                htmlFor="weight"
                className="text-sm font-medium text-foreground"
              >
                Weight (kg)
              </label>

              <input
                id="weight"
                type="number"
                placeholder="Enter weight in kg"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.weight ? "border-destructive" : "border-input"
                }`}
              />

              {errors.weight && (
                <p className="text-xs text-destructive">{errors.weight}</p>
              )}
            </div>

            {/*Height \*/}

            <div className="space-y-2">
              <label
                htmlFor="height"
                className="text-sm font-medium text-foreground"
              >
                Height (cm)
              </label>

              <input
                id="height"
                type="number"
                placeholder="Enter height in cm"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.height ? "border-destructive" : "border-input"
                }`}
              />

              {errors.height && (
                <p className="text-xs text-destructive">{errors.height}</p>
              )}
            </div>

            {/*Fracture History \*/}

            <div className="space-y-2">
              <label
                htmlFor="fracture"
                className="text-sm font-medium text-foreground"
              >
                Fracture History
              </label>

              <select
                id="fracture"
                value={formData.fracture}
                onChange={(e) => handleInputChange("fracture", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.fracture ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">Select fracture history</option>

                <option value="fracture">Yes</option>

                <option value="no fracture">No</option>
              </select>

              {errors.fracture && (
                <p className="text-xs text-destructive">{errors.fracture}</p>
              )}
            </div>

            {/*Medication \*/}

            <div className="space-y-2">
              <label
                htmlFor="medication"
                className="text-sm font-medium text-foreground"
              >
                Medication
              </label>

              <select
                id="medication"
                value={formData.medication}
                onChange={(e) =>
                  handleInputChange("medication", e.target.value)
                }
                className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  errors.medication ? "border-destructive" : "border-input"
                }`}
              >
                <option value="">Select medication</option>

                <option value="No medication">No medication</option>

                <option value="Anticonvulsant">Anticonvulsant</option>

                <option value="Glucocorticoids">Glucocorticoids</option>
              </select>

              {errors.medication && (
                <p className="text-xs text-destructive">{errors.medication}</p>
              )}
            </div>

            {/*Waiting Time \*/}

            <Button className="w-full mt-6" onClick={handleAssess}>
              Assess BMD Risk
            </Button>
          </CardContent>
        </Card>
      )}

      {/*Analyzing State \*/}

      {view === "analyzing" && (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />

              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-2">
              Calculating Risk...
            </h2>

            <p className="text-muted-foreground">
              Analyzing bone mineral density risk factors
            </p>
          </CardContent>
        </Card>
      )}

      {/*Results State \*/}

      {view === "results" &&
        result &&
        (() => {
          const riskLevel: RiskLevel =
            result.predicted_bmd >= 0.8
              ? "low"
              : result.predicted_bmd >= 0.6
                ? "medium"
                : "high";

          return (
            <div className="space-y-6 max-w-lg">
              {/*Action Buttons \*/}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleNewAssessment}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Assessment
                </Button>

                <ReportDownloadButton
                  clinic={{
                    clinicName: user?.clinicName ?? "",

                    address: user?.address,

                    phone: user?.phone,
                  }}
                  token={token}
                  assessmentType="BMD_RISK"
                  resultSummary={`BMD: ${result?.predicted_bmd}; ${
                    result?.predicted_bmd >= 0.8
                      ? "Low Risk"
                      : result?.predicted_bmd >= 0.6
                        ? "Medium Risk"
                        : "High Risk"
                  }`}
                  resultDetails={{
                    predictedBmd: result?.predicted_bmd,
                    riskCategory:
                      result?.predicted_bmd >= 0.8
                        ? "Low Risk"
                        : result?.predicted_bmd >= 0.6
                          ? "Medium Risk"
                          : "High Risk",
                    age: formData.age,
                    sex: formData.gender,
                    weightKg: formData.weight,
                    heightCm: formData.height,
                    fractureHistory: formData.fracture,
                    medication: formData.medication,
                  }}
                  assessmentTitle="Bone Mineral Density Risk Assessment"
                  findings={[
                    {
                      label: "Predicted BMD",

                      value: result?.predicted_bmd,
                    },

                    {
                      label: "Risk category",

                      value:
                        result?.predicted_bmd >= 0.8
                          ? "Low Risk"
                          : result?.predicted_bmd >= 0.6
                            ? "Medium Risk"
                            : "High Risk",
                    },

                    { label: "Age", value: `${formData.age} years` },

                    { label: "Sex", value: formData.gender },

                    { label: "Weight", value: `${formData.weight} kg` },

                    { label: "Height", value: `${formData.height} cm` },

                    { label: "Fracture history", value: formData.fracture },

                    { label: "Medication", value: formData.medication },
                  ]}
                />
              </div>

              {/*Result Card \*/}

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <CardTitle>BMD Risk Assessment Result</CardTitle>

                      <CardDescription>
                        Based on provided patient data
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/*Risk Level Badge \*/}

                  <div className="text-center py-6">
                    <div
                      className={`inline-flex items-center px-6 py-3 rounded-full text-xl font-bold ${riskConfig[riskLevel].bgColor} text-white`}
                    >
                      {riskConfig[riskLevel].label}
                    </div>
                  </div>

                  {/* Predicted BMD \*/}

                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      Predicted BMD
                    </div>

                    <div className="text-3xl font-bold text-foreground">
                      {result.predicted_bmd}
                    </div>
                  </div>

                  {/* Risk Scale */}

                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low Risk</span>

                      <span>Medium Risk</span>

                      <span>High Risk</span>
                    </div>

                    <div className="h-3 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-success" />

                      <div className="flex-1 bg-warning" />

                      <div className="flex-1 bg-destructive" />
                    </div>

                    <div className="relative h-4">
                      <div
                        className="absolute top-0 w-4 h-4 bg-foreground rounded-full -translate-x-1/2 border-2 border-background"
                        style={{
                          left:
                            riskLevel === "low"
                              ? "16.67%"
                              : riskLevel === "medium"
                                ? "50%"
                                : "83.33%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}

                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center">
                      {result.predicted_bmd >= 0.8
                        ? "Healthy Bone Density. Continue regular health monitoring and maintain a healthy lifestyle."
                        : result.predicted_bmd >= 0.6
                          ? "Low Bone Density. Consider lifestyle modifications and consult with your healthcare provider."
                          : "Very Low Bone Density. Please consult with a healthcare professional for further evaluation and treatment options."}
                    </p>
                  </div>

                  {/* Disclaimer */}
                </CardContent>
              </Card>
            </div>
          );
        })()}
    </div>
  );
}
