# Bone Health AI — Frontend

A web-based bone health assessment platform that brings AI-assisted medical image analysis and patient health assessments together in one interface.

The frontend connects to a Spring Boot backend for application and patient-related functionality and a Python FastAPI service for machine learning predictions.

## Features

- **Fracture Detection:** Upload bone X-ray images for AI-assisted fracture analysis.
- **Bone Age Assessment:** Access bone age estimation functionality through the ML service.
- **Bone Mineral Density (BMD) Assessment:** Support BMD-related assessment workflows.
- **Dashboard:** View assessment and patient-related information.
- **Patient Management:** Access patient management functionality.
- **Authentication Interface:** Sign-up and login user interface.
- **Assessment Reports:** Generate and download medical assessment reports.
- **Profile Management:** View and manage profile information.
- **Backend Integration:** Communicate with the Spring Boot REST API.
- **ML Integration:** Send relevant inputs to the machine learning API.

> This application is intended for research and decision-support development. Its results do not replace professional medical evaluation.

## Technology Stack

- Next.js
- React
- JavaScript / JSX and TypeScript where used by the existing project
- Tailwind CSS
- REST APIs
- Spring Boot backend
- FastAPI ML service

## Architecture

```text
User
 |
 v
Next.js Frontend
 |
 +--------------------------+
 |                          |
 v                          v
Spring Boot Backend      FastAPI ML Service
Port 8080                Port 8000
 |                          |
 v                          v
Application Data         Trained ML Models
```

The frontend uses the backend for application-related operations and the ML service for supported prediction workflows.

## Prerequisites

- Node.js compatible with the project's Next.js version
- npm
- Git
- The Spring Boot backend configured and running
- The FastAPI ML service and required trained models configured and running

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/C0deHungeR/Bone_Health_AI.git
cd Bone_Health_AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Configure the service URLs in `.env.local`:

```dotenv
# ML service
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Spring Boot backend API base URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
```

Ensure the URLs match the ports and routes used by your local backend and ML service.

**Important:** These variables use the `NEXT_PUBLIC_` prefix, so their values may be included in browser-side code. Only use them for public service URLs, never for passwords, API secrets, or private credentials.

Restart the development server after changing environment variables.

## Run the Frontend

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run these commands after configuring the environment variables for the intended deployment.

## API Integration

### Spring Boot Backend

The backend base URL is configured using:

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
```

The frontend API utilities use this base URL to access supported application endpoints, including dashboard and patient-related functionality.

### Machine Learning Service

The ML service URL is configured using:

```dotenv
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The service provides supported AI prediction endpoints. The exact endpoints and request formats are defined by the ML repository.

Ensure that both services are running and that their API paths, request payloads, response structures, and cross-origin settings match the frontend integration.

## Project Structure

```text
Bone_Health_AI/
├── app/
│   └── page.tsx
├── components/
│   ├── auth-modal.tsx
│   ├── dashboard.tsx
│   ├── dashboard-data-panel.tsx
│   ├── fracture-detection.tsx
│   ├── bone-age-estimation.tsx
│   ├── bmd-risk-assessment.tsx
│   ├── patient-management.tsx
│   ├── profile-page.tsx
│   └── report-download-button.tsx
├── lib/
│   ├── api.ts
│   ├── clinical-api.ts
│   └── generate-medical-report.ts
├── public/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The tree above highlights the main application files; other components, configuration files, and assets may also exist in the repository.

## Deployment

The frontend can be deployed to a Next.js-compatible hosting platform.

Before deployment:

1. Configure the production backend URL.
2. Configure the production ML service URL.
3. Ensure both services are reachable from the deployed application.
4. Configure CORS on the APIs if cross-origin requests are required.
5. Run the production build and verify the main user flows.
6. Confirm that `.env.local` and other private environment files are not committed.

## Related Repositories

- **Frontend:** [Bone_Health_AI](https://github.com/C0deHungeR/Bone_Health_AI)
- **Backend:** [Bone_Health_AI_Backend](https://github.com/C0deHungeR/Bone_Health_AI_Backend)
- **ML Service:** [Bone_Health_AI_ML_Model](https://github.com/nachiket-tonge/Bone_Health_AI_ML_Model)

## Medical Disclaimer

Bone Health AI is a software project for research and decision-support development. Predictions may be inaccurate and must not be treated as a definitive diagnosis. Clinical decisions should be made by qualified healthcare professionals.

## License

Add the applicable license before distributing the project.
