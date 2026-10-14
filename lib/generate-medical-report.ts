import { jsPDF } from "jspdf";

export interface PatientDetails {
  fullName: string;
  phone: string;
  age: string;
  sex: string;
  address: string;
}

export interface ClinicDetails {
  clinicName: string;
  address?: string;
  phone?: string;
}

export interface ReportImage {
  label: string;
  dataUrl: string;
}

export interface MedicalReportData {
  assessmentTitle: string;
  clinic: ClinicDetails;
  patient: PatientDetails;
  findings: Array<{
    label: string;
    value: string | number | null | undefined;
  }>;
  images?: ReportImage[];
  disclaimer?: string;
}

const COLORS = {
  navy: [24,  54,  82] as [number, number, number],
  teal: [26, 132, 137] as [number, number, number],
  ink: [38, 48, 58] as [number, number, number],
  muted: [103, 115, 127] as [number, number, number],
  line: [220, 227, 233] as [number, number, number],
  pale: [243, 247, 250] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

function createReportId(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BHAI-${date}-${random}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function generateMedicalReport(data: MedicalReportData): Promise<void> {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 11;
  const reportId = createReportId();
  const generatedAt = new Date();
  let y = 15;

  const setText = (color: [number, number, number]) => pdf.setTextColor(...color);
  const addFooter = () => {
    const pages = pdf.getNumberOfPages();
    for (let page = 1; page <= pages; page++) {
      pdf.setPage(page);
      pdf.setDrawColor(...COLORS.line);
      pdf.setLineWidth(0.25);
      pdf.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      setText(COLORS.muted);
      pdf.text(reportId, margin, footerY);
      pdf.text(`Page ${page} of ${pages}`, pageWidth - margin, footerY, { align: "right" });
    }
  };

  const addPage = () => {
    pdf.addPage();
    y = 18;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 22) addPage();
  };

  const sectionTitle = (title: string) => {
    ensureSpace(13);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    setText(COLORS.navy);
    pdf.text(title.toUpperCase(), margin, y);
    pdf.setDrawColor(...COLORS.line);
    pdf.setLineWidth(0.35);
    pdf.line(margin, y + 2.5, pageWidth - margin, y + 2.5);
    y += 9;
  };

  const drawLabelValue = (label: string, value: string, labelWidth = 42) => {
    const valueLines = pdf.splitTextToSize(value || "Not provided", contentWidth - labelWidth - 3);
    const rowHeight = Math.max(6, valueLines.length * 4.5);
    ensureSpace(rowHeight + 3);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setText(COLORS.muted);
    pdf.text(label, margin, y);
    pdf.setFont("helvetica", "normal");
    setText(COLORS.ink);
    pdf.text(valueLines, margin + labelWidth, y);
    y += rowHeight + 2.5;
  };

  // Header banner
  pdf.setFillColor(...COLORS.navy);
  pdf.rect(0, 0, pageWidth, 37, "F");
  pdf.setFillColor(...COLORS.teal);
  pdf.rect(0, 37, pageWidth, 1.8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(19);
  setText(COLORS.white);
  pdf.text("BONE HEALTH AI", margin, 16);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.text("AI-ASSISTED CLINICAL ASSESSMENT REPORT", margin, 24);
  pdf.setFontSize(8);
  pdf.text(`Generated ${formatDate(generatedAt)}`, pageWidth - margin, 30, { align: "right" });
  y = 48;

  // Clinic identity panel
  pdf.setFillColor(...COLORS.pale);
  pdf.roundedRect(margin, y - 5, contentWidth, 25, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  setText(COLORS.navy);
  const clinicName = data.clinic?.clinicName?.trim() || "Clinic name unavailable";
  pdf.text(pdf.splitTextToSize(clinicName, contentWidth - 8), margin + 4, y + 1);
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  setText(COLORS.ink);
  const clinicLines: string[] = [];
  if (data.clinic?.address?.trim()) clinicLines.push(`Address: ${data.clinic.address.trim()}`);
  if (data.clinic?.phone?.trim()) clinicLines.push(`Phone: ${data.clinic.phone.trim()}`);
  if (!clinicLines.length) clinicLines.push("Clinic contact details not provided");
  const clinicText = pdf.splitTextToSize(clinicLines.join("  |  "), contentWidth - 8);
  pdf.text(clinicText, margin + 4, y + 1);
  y = 79;

  // Report metadata
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  setText(COLORS.muted);
  pdf.text(`REPORT ID  ${reportId}`, margin, y);
  pdf.text(`DATE  ${formatDate(generatedAt)}`, pageWidth - margin, y, { align: "right" });
  y += 9;

  // Assessment title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  setText(COLORS.ink);
  const titleLines = pdf.splitTextToSize(data.assessmentTitle, contentWidth);
  ensureSpace(titleLines.length * 7 + 5);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 7 + 5;

  // Patient information in a compact two-column grid
  sectionTitle("Patient information");
  const patientItems: Array<[string, string]> = [
    ["Full name", data.patient.fullName],
    ["Phone number", data.patient.phone],
    ["Age", `${data.patient.age} years`],
    ["Sex", data.patient.sex],
    ["Address", data.patient.address || "Not provided"],
  ];
  const colGap = 8;
  const colWidth = (contentWidth - colGap) / 2;
  const drawPatientCard = (x: number, top: number, w: number, label: string, value: string) => {
    const lines = pdf.splitTextToSize(value || "Not provided", w - 8);
    const h = Math.max(16, 9 + lines.length * 4);
    pdf.setFillColor(...COLORS.pale);
    pdf.roundedRect(x, top, w, h, 1.5, 1.5, "F");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    setText(COLORS.muted);
    pdf.text(label.toUpperCase(), x + 4, top + 5);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setText(COLORS.ink);
    pdf.text(lines, x + 4, top + 11);
    return h;
  };
  let patientIndex = 0;
  while (patientIndex < patientItems.length) {
    const leftItem = patientItems[patientIndex];
    const rightItem = patientItems[patientIndex + 1];
    const leftLines = pdf.splitTextToSize(leftItem[1] || "Not provided", colWidth - 8);
    const rightLines = rightItem ? pdf.splitTextToSize(rightItem[1] || "Not provided", colWidth - 8) : [];
    const rowH = Math.max(16, 11 + Math.max(leftLines.length, rightLines.length, 1) * 4);
    ensureSpace(rowH + 3);
    drawPatientCard(margin, y, colWidth, leftItem[0], leftItem[1]);
    if (rightItem) drawPatientCard(margin + colWidth + colGap, y, colWidth, rightItem[0], rightItem[1]);
    y += rowH + 3;
    patientIndex += 2;
  }
  y += 3;

  // Findings table
  sectionTitle("Assessment findings");
  const validFindings = data.findings.filter(
    (item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== "",
  );
  if (!validFindings.length) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    setText(COLORS.muted);
    pdf.text("No assessment findings were supplied.", margin, y);
    y += 8;
  }
  for (let i = 0; i < validFindings.length; i++) {
    const item = validFindings[i];
    const labelLines = pdf.splitTextToSize(item.label, 55);
    const valueLines = pdf.splitTextToSize(String(item.value), contentWidth - 70);
    const rowH = Math.max(9, Math.max(labelLines.length, valueLines.length) * 4.5 + 4);
    ensureSpace(rowH);
    if (i % 2 === 0) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, y - 4.5, contentWidth, rowH, "F");
    }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    setText(COLORS.muted);
    pdf.text(labelLines, margin + 3, y);
    pdf.setFont("helvetica", "normal");
    setText(COLORS.ink);
    pdf.text(valueLines, margin + 66, y);
    y += rowH;
  }
  y += 5;

  // Assessment images; each image is kept together with its caption.
  if (data.images?.some((image) => image.dataUrl)) {
    sectionTitle("Assessment images");
    for (const image of data.images) {
      if (!image.dataUrl) continue;
      try {
        const props = pdf.getImageProperties(image.dataUrl);
        const maxW = contentWidth;
        const maxH = 78;
        const scale = Math.min(maxW / props.width, maxH / props.height, 1);
        const imageW = props.width * scale;
        const imageH = props.height * scale;
        const labelLines = pdf.splitTextToSize(image.label, contentWidth);
        const blockH = labelLines.length * 4.5 + 4 + imageH + 7;
        ensureSpace(blockH);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        setText(COLORS.navy);
        pdf.text(labelLines, margin, y);
        y += labelLines.length * 4.5 + 3;
        const format = image.dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
        pdf.addImage(image.dataUrl, format, margin + (contentWidth - imageW) / 2, y, imageW, imageH, undefined, "FAST");
        y += imageH + 7;
      } catch (error) {
        console.warn(`Could not embed report image "${image.label}"`, error);
      }
    }
  }

  // Clinical review block
  ensureSpace(44);
  sectionTitle("Clinician review");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  setText(COLORS.ink);
  pdf.text("Clinical notes:", margin, y);
  y += 4;
  pdf.setDrawColor(...COLORS.line);
  for (let i = 0; i < 3; i++) {
    pdf.line(margin, y + i * 7, pageWidth - margin, y + i * 7);
  }
  y += 26;
  const signatureWidth = (contentWidth - 12) / 2;
  pdf.setDrawColor(...COLORS.muted);
  pdf.line(margin, y, margin + signatureWidth, y);
  pdf.line(margin + signatureWidth + 12, y, pageWidth - margin, y);
  y += 4;
  pdf.setFontSize(8);
  setText(COLORS.muted);
  pdf.text("Clinician name / signature", margin, y);
  pdf.text("Date", margin + signatureWidth + 12, y);

  // Disclaimer panel
  y += 10;
  const disclaimer =
    data.disclaimer ??
    "This report contains AI-assisted assessment findings and is intended to support clinical review. It is not a definitive diagnosis. A qualified healthcare professional must interpret these findings alongside the patient's clinical history and other relevant investigations.";
  const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth - 8);
  const disclaimerH = disclaimerLines.length * 4 + 9;
  ensureSpace(disclaimerH + 2);
  pdf.setFillColor(...COLORS.pale);
  pdf.roundedRect(margin, y - 4, contentWidth, disclaimerH, 1.5, 1.5, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  setText(COLORS.navy);
  pdf.text("IMPORTANT CLINICAL DISCLAIMER", margin + 4, y + 1);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  setText(COLORS.ink);
  pdf.text(disclaimerLines, margin + 4, y + 5.5);

  addFooter();
  const safeTitle = data.assessmentTitle.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  pdf.save(`${reportId}-${safeTitle || "Assessment"}.pdf`);
}