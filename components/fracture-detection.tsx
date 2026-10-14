"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDownloadButton } from "@/components/report-download-button";
import {
  Upload,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { User as UserType } from "@/app/page";


interface FractureDetectionProps {
  user?: UserType;
  token?: string;
  onBack: () => void;
}

type ViewState = "upload" | "analyzing" | "results";

export function FractureDetection({ user,token ,onBack }: FractureDetectionProps) {
  const [view, setView] = useState<ViewState>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    detected: false,
    confidence: 0,
    heatmapUrl: null as string | null,
    boxedImageUrl: null as string | null,
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleAnalyze = async () => {
    if (!imageFile || loading) return;

    setLoading(true);
    setView("analyzing");

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("Prediction Response:", data);

      // X-ray validation failed
      if (data.error === "INVALID_XRAY_IMAGE") {
        alert(data.message);
        setView("upload");
        return;
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "API failed");
      }

      setResults({
        detected: data.prediction === "Fracture Detected",
        confidence: Math.round(data.confidence * 100),
        heatmapUrl: `data:image/jpeg;base64,${data.heatmap}`,
        boxedImageUrl: `data:image/jpeg;base64,${data.boxed_image}`,
      });

      setView("results");
    } catch (error) {
      console.error("API Error:", error);
      alert("Backend error. Check if FastAPI is running.");
      setView("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setUploadedImage(null);
    setImageFile(null);

    setResults({
      detected: false,
      confidence: 0,
      heatmapUrl: null,
      boxedImageUrl: null,
    });

    setView("upload");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Fracture Detection</h1>
          <p className="text-muted-foreground">
            Upload an X-ray image to detect fractures
          </p>
        </div>
      </div>

      {view === "upload" && (
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Upload X-ray</CardTitle>
          </CardHeader>

          <CardContent>
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center ${
                  isDragging ? "border-primary bg-primary/5" : "border-border"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto mb-4 w-10 h-10" />

                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />

                  <Button asChild>
                    <span>Select Image</span>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <img
                  src={uploadedImage}
                  alt="Uploaded X-ray"
                  className="rounded-xl max-h-[400px] mx-auto"
                />

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedImage(null);
                      setImageFile(null);
                    }}
                  >
                    Remove
                  </Button>

                  <Button onClick={handleAnalyze} disabled={loading}>
                    Analyze
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {view === "analyzing" && (
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Analyzing X-ray...</p>
        </div>
      )}

      {view === "results" && (
        <div className="space-y-6">
          <Button variant="outline" onClick={handleNewAnalysis}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original X-ray</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                  <img
                    src={uploadedImage || ""}
                    alt="Original X-ray"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                  <img
                    src={results.heatmapUrl || ""}
                    alt="AI Heatmap"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detected Fracture Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                  <img
                    src={results.boxedImageUrl || ""}
                    alt="Fracture Bounding Box"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Detection Result</CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              {results.detected ? (
                <AlertCircle className="text-red-500 w-10 h-10 mx-auto" />
              ) : (
                <CheckCircle2 className="text-green-500 w-10 h-10 mx-auto" />
              )}

              <h2 className="text-xl font-bold">
                {results.detected ? "Fracture Detected" : "No Fracture"}
              </h2>

              <p className="text-muted-foreground">
                Confidence: {results.confidence}%
              </p>
            </CardContent>
          </Card>
          {user?.clinicName && (
            <ReportDownloadButton
              clinic={{
                clinicName: user.clinicName ?? "",
                address: user.address,
                phone: user.phone,
              }}
              token={token}
              assessmentType="FRACTURE_DETECTION"
              resultSummary={`${
                results.detected ? "Fracture detected" : "No fracture detected"
              } with ${results.confidence}% confidence`}
              resultDetails={{
                detected: results.detected,
                confidence: results.confidence,
              }}
              assessmentTitle="Fracture Detection"
              findings={[
                {
                  label: "Assessment result",
                  value: results.detected
                    ? "Fracture Detected"
                    : "No Fracture Detected",
                },
                {
                  label: "Model confidence",
                  value: `${results.confidence}%`,
                },
              ]}
              images={[
                ...(uploadedImage
                  ? [{ label: "Original X-ray", dataUrl: uploadedImage }]
                  : []),
                ...(results.heatmapUrl
                  ? [{ label: "AI Heatmap", dataUrl: results.heatmapUrl }]
                  : []),
                ...(results.boxedImageUrl
                  ? [
                      {
                        label: "Detected Fracture Region",
                        dataUrl: results.boxedImageUrl,
                      },
                    ]
                  : []),
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
}
