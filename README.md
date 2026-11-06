# Virtual Herbal Garden

## 1. Project Overview

Virtual Herbal Garden (also called Herbiva AI in the application) combines a Next.js web application, an Express API, MongoDB persistence, and a Python AI service. Users can explore plant information, manage garden-related data, and submit plant images for identification. A separate CPU-oriented pipeline supports model training and experimental 3D reconstruction.

The repository contains source code for all three applications. AI inference requires compatible YOLO weights; 3D reconstruction additionally requires suitable multi-view/video input and COLMAP. The UI can run without the AI service when the backend's development mock mode is enabled, but mock output is simulated and must not be treated as a real identification.

## 2. Project Objectives

- Make medicinal-plant information and garden care easier to explore.
- Provide account-backed scans and garden features through a documented API.
- Connect image upload and plant detection to a separately deployable inference service.
- Support an experimental video-to-3D reconstruction workflow.
- Keep frontend, application backend, and compute-heavy AI dependencies independently runnable.

## 3. Key Features

- Next.js dashboard, plant pages, scanner, garden, care, history, assistant, and settings views.
- Interactive browser-based 3D garden built with React Three Fiber and Drei.
- Express REST API with authentication, validation, rate limiting, Swagger UI, and MongoDB models.
- Optional Cloudinary upload integration.
- YOLO-based CPU plant inference and medicinal-plant metadata service.
- Python reconstruction scripts, COLMAP integration, NeRF training/export code, and a static AI-service viewer.
- Jest/Supertest backend tests and Python tests.

Some screens use frontend fixture data, and some AI capabilities are explicitly unavailable until their model or pipeline is configured. See the workflow notes below; do not infer that a visible UI is backed by a production inference pipeline.

## 4. Technology Stack

| Area | Technologies |
|---|---|
| Web frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Frontend UI/visualization | Framer Motion, Lucide, Recharts, Three.js, React Three Fiber, Drei |
| Application API | Node.js, Express 4, TypeScript |
| Database and data models | MongoDB, Mongoose |
| API security and validation | JWT, bcrypt, Zod, Helmet, express-rate-limit, Multer |
| Uploads and API documentation | Cloudinary (optional), Swagger/OpenAPI |
| AI API | Python, FastAPI, Uvicorn, Pydantic |
| Detection and image processing | Ultralytics YOLO, PyTorch, Pillow, OpenCV, NumPy |
| Reconstruction and geometry | COLMAP (external executable), Open3D, trimesh, SciPy, scikit-image |
| Tests | Jest, ts-jest, Supertest, pytest |

JavaScript dependency versions are declared in the frontend and backend package manifests and lockfiles. Python dependencies are listed in `virtualgarden-ai/requirements.txt`; most Python requirements are not version-pinned.

## 5. System Architecture

```text
Browser
  |
  +--> Next.js frontend (:3000)
         |
         +--> Express API (:5000) ----> MongoDB
                  |                    Cloudinary (optional)
                  |
                  +--> FastAPI AI service (:8000, when real inference is enabled)
                           |--> YOLO weights
                           |--> species metadata
                           `--> reconstruction scripts / generated GLB files
```

The browser uses the Express API for application features. The Express backend forwards plant image inference to FastAPI when `MOCK_AI_MODE=false`. The FastAPI service also exposes direct detection and reconstruction endpoints. MongoDB is required for the Express server to start, including when mock AI is enabled.

## 6. Complete Folder Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/          # Environment, database, Cloudinary, Swagger
│   │   ├── controllers/     # HTTP handlers
│   │   ├── middleware/      # Auth, admin, errors, uploads, validation
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── seed/            # Plant seed utility
│   │   ├── services/        # Business logic and external integrations
│   │   ├── utils/           # Shared response, JWT, password helpers
│   │   ├── validators/      # Zod request schemas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/               # Jest/Supertest API tests
│   ├── .env.example
│   ├── jest.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   │   ├── admin/
│   │   │   ├── dashboard/   # Assistant, care, disease, garden, history,
│   │   │   │                # plants, scanner, and settings
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── components/      # Chat, garden, layout, plants, scanner, UI
│   │   ├── data/            # Frontend fixture data
│   │   ├── hooks/
│   │   ├── lib/api/         # Auth, assistant, care, garden, plants, scanner
│   │   └── types/
│   ├── .env.example
│   ├── next.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── virtualgarden-ai/
│   ├── backend/             # FastAPI app, routers, schemas, model loading
│   ├── configs/             # Dataset and training YAML
│   ├── detection/           # Training, prediction, validation
│   ├── models/yolo/         # Required best.pt model (Git LFS)
│   ├── reconstruction/     # Preprocessing, COLMAP, NeRF, mesh export
│   ├── tests/               # Python tests
│   ├── viewer/              # Static Three.js viewer
│   └── requirements.txt
├── .env.example             # Master reference; see environment section
├── .gitattributes           # Git LFS rule for the required YOLO weights
├── .gitignore
└── README.md
```

Generated datasets, virtual environments, caches, build output, and reconstruction run artifacts are local-only and ignored by Git. There is no root `package.json`; the frontend and backend are independently managed Node applications.

## 7. Frontend Architecture

The frontend is a Next.js App Router application under `frontend/src/app`. Shared UI is in `src/components`, API clients in `src/lib/api`, local fixture data in `src/data`, and TypeScript interfaces in `src/types`. The 3D garden scene is client-rendered because it depends on browser rendering APIs.

The API clients use `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). Any `NEXT_PUBLIC_*` value is exposed to browser code and must never contain a private credential. `NEXT_PUBLIC_APP_URL` appeared in an earlier example but is not referenced by the current source.

## 8. Backend Architecture

`backend/src/server.ts` connects to MongoDB before listening. `app.ts` configures Helmet, CORS, JSON parsing, development logging, Swagger UI, API rate limiting, health checks, and route mounting. Request handlers are separated into controllers, services, Mongoose models, middleware, route definitions, and Zod validators.

The backend owns application authentication and persistence. It calls FastAPI for plant detection when real AI mode is active, and can store uploaded images with Cloudinary when configured. Disease detection currently reports unavailable because a disease-trained model is not implemented.

## 9. AI/ML Architecture

`virtualgarden-ai/backend` contains the FastAPI application, model loader, species metadata, request schemas, and service routers. The service loads the configured YOLO `.pt` weights at startup and forces inference onto CPU. The default weight path is `virtualgarden-ai/models/yolo/best.pt`; `MODEL_PATH` can override it.

`detection/` contains the training and inference scripts. `reconstruction/` contains video/image preprocessing, COLMAP orchestration, NeRF training, and mesh export. The AI API is useful for actual plant inference only when the weights and Python dependencies are compatible and load successfully. Do not substitute generic pretrained weights for the project-trained weights.

## 10. Plant Detection Workflow

1. The signed-in frontend uploads an image to `POST /api/scans/identify` as multipart field `image`.
2. Express validates the upload type and configured size limit, then either returns a clearly marked development simulation or forwards the image to FastAPI.
3. In real mode, the backend sends the image as multipart field `file` to `POST /predict/plant` at `AI_SERVICE_URL`.
4. FastAPI validates JPEG, PNG, or WebP input, runs the configured YOLO model on CPU with a confidence threshold of `0.30`, and returns labels, confidence values, and optional bounding boxes.
5. Express maps and stores scan results in MongoDB. Cloudinary image storage is optional.

The scanner mock mode is only for local development; it does not identify a plant and must not be presented as a prediction. A missing or incompatible model makes the AI service unavailable rather than generating fabricated predictions.

## 11. 3D Reconstruction Workflow

The Python workflow uses video or multiple images to extract frames, estimate camera poses with COLMAP, train the repository's NeRF pipeline, and export a GLB mesh. `POST /reconstruct` accepts a video upload and species name, queues work in FastAPI's in-process background task mechanism, and returns a queued response. The expected CPU runtime can be long; COLMAP must be installed separately and available on `PATH`.

The AI service serves generated meshes at `GET /models/{species}.glb` when the expected file exists, and has a static viewer at `/viewer`. The frontend also contains a React Three Fiber garden scene. The reconstruction endpoint is not a durable job queue: jobs can be lost when the service restarts, and this feature should not be exposed publicly without request-size, file-type, job-isolation, and resource controls.

## 12. API Documentation

When the Express backend is running, its Swagger UI is at `http://localhost:5000/api/docs`. The FastAPI OpenAPI pages are at `http://localhost:8000/docs` and `/redoc`.

### Express API (`/api`)

| Route group | Main operations |
|---|---|
| `/health` | Service and dependency status |
| `/auth` | Register, login, current user, logout |
| `/users` | Update profile and delete account |
| `/plants` | List, retrieve, create, update, and delete plant records |
| `/scans` | Identify plant, list/retrieve scan history, delete a scan |
| `/disease` | Submit analysis and access disease-scan history; inference is unavailable |
| `/gardens` | Manage gardens, plants, and garden statistics |
| `/care` | Manage care tasks and completion state |
| `/models` | Manage 3D model records |
| `/assistant` | Chat and assistant history |
| `/admin` | Admin dashboard, user, and scan views |

Protected routes use JWT bearer authentication; admin routes additionally require the admin role. See the live Swagger document for exact schemas and response formats.

### FastAPI AI API

| Method and path | Purpose |
|---|---|
| `POST /predict/plant` | Detection response consumed by the Express backend |
| `POST /detect` | Direct detection with plant metadata and optional generated-model URL |
| `GET /health` | Service/model readiness and expected weights path |
| `GET /species` | Species metadata and GLB availability |
| `GET /models/{species}.glb` | Serve a generated GLB mesh |
| `GET /viewer` | Serve the static 3D viewer |
| `POST /reconstruct?species=...` | Queue video-based reconstruction |

## 13. Database Architecture

The Express application uses MongoDB through Mongoose. Models include `User`, `Plant`, `PlantScan`, `DiseaseScan`, `Garden`, `CareTask`, `ChatMessage`, and `Model3D`. User-specific records reference the owning user; plant scans can reference a plant and record prediction metadata, mock status, and timestamps.

The repository uses MongoDB's schema/index behavior rather than a separate relational migration system. Provide a dedicated local or managed database for the application, and a separate isolated database for tests. Never point tests at production data.

## 14. Authentication and Authorization

The backend hashes passwords with bcrypt and issues JWTs. Protected routes use the bearer token in the `Authorization` header. The user model distinguishes `user` and `admin`; privileged routes apply admin authorization middleware. JWT lifetime is configurable with `JWT_EXPIRES_IN`.

Use a unique, high-entropy `JWT_SECRET` in every deployed environment. Do not use the example placeholder, seed credentials, or development mock behavior in production.

## 15. Environment Variables

The root `.env.example` is a reference grouped by consuming service. It is not automatically loaded: backend commands run in `backend/`, Next.js commands run in `frontend/`, and the Python service reads process environment variables directly. Copy the relevant values to the service-local files noted below. A root `.env` is intentionally not created because no root-level application loads it.

| Variable | Consumer | Purpose |
|---|---|---|
| `PORT` | Backend | Express listen port; defaults to `5000` |
| `NODE_ENV` | Backend | `development`, `test`, or `production` |
| `MONGODB_URI` | Backend | MongoDB connection string; required |
| `MONGODB_TEST_URI` | Backend tests | Isolated test database; required to run Jest tests |
| `JWT_SECRET` | Backend | JWT signing secret; minimum 10 characters by validation |
| `JWT_EXPIRES_IN` | Backend | JWT lifetime; defaults to `7d` |
| `CLIENT_URL` | Backend | Allowed frontend CORS origin |
| `AI_SERVICE_URL` | Backend | FastAPI base URL; defaults to `http://127.0.0.1:8000` |
| `MAX_IMAGE_SIZE_MB` | Backend | Upload size limit; defaults to 10 MB |
| `MOCK_AI_MODE` | Backend | Development-only simulated scan mode |
| `CLOUDINARY_CLOUD_NAME` | Backend | Optional Cloudinary account name |
| `CLOUDINARY_API_KEY` | Backend | Optional Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Optional Cloudinary API secret |
| `NEXT_PUBLIC_API_URL` | Frontend | Express API base URL |
| `MODEL_PATH` | AI service | Optional YOLO weights path; defaults to `models/yolo/best.pt` relative to `virtualgarden-ai/` |
| `ROBOFLOW_API_KEY` | AI training script | Required only to download the training dataset |
| `NEXT_DIST_DIR` | Frontend build | Optional Next.js output directory override |

Keep actual values in ignored `backend/.env` and `frontend/.env.local` files or a deployment secret manager. The Python AI service does not load dotenv files; set `MODEL_PATH` or `ROBOFLOW_API_KEY` in its process environment. Do not put backend-only secrets in a `NEXT_PUBLIC_*` variable. No payment or email configuration is present in the source.

## 16. Installation and Setup

Prerequisites: Node.js/npm for both JavaScript apps; a supported Python runtime for the AI service; MongoDB for backend startup; and COLMAP for reconstruction. The AI requirements include large CPU-oriented computer-vision and geometry packages. Check their compatibility with your Python version before installing.

```powershell
# Backend
Copy-Item backend\.env.example backend\.env
Set-Location backend
npm install

# Frontend (in another terminal, from the repository root)
Copy-Item frontend\.env.example frontend\.env.local
Set-Location frontend
npm install

# AI service (from the repository root)
Set-Location virtualgarden-ai
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Set a private `JWT_SECRET` in `backend/.env` before starting the API. If the repository was cloned without Git LFS smudge support, install Git LFS and fetch the model with `git lfs pull`. Keep training data and local credentials out of Git.

## 17. Local Development Guide

Start MongoDB first. Start the AI service if testing real predictions; otherwise use `MOCK_AI_MODE=true` in the backend's local environment to exercise scanner persistence without AI. Mock mode still requires MongoDB and authentication. Use an isolated `MONGODB_TEST_URI` when running tests.

The backend default CORS origin is `http://localhost:3000`. If the frontend uses a different origin, set `CLIENT_URL` to that exact origin. The AI API is not required for frontend pages that use local fixture data.

## 18. Running the Frontend

```powershell
Set-Location frontend
npm run dev
```

Open `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` before starting/building if the Express API is not at `http://localhost:5000`.

## 19. Running the Backend

Ensure MongoDB is reachable and `backend/.env` contains valid `MONGODB_URI` and `JWT_SECRET` values:

```powershell
Set-Location backend
npm run dev
```

The API listens on port `5000` by default. Health and Swagger endpoints are `/api/health` and `/api/docs`.

## 20. Running AI Services

From `virtualgarden-ai/`, activate the Python environment and run:

```powershell
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Check `/health` and confirm `inference_ready` is true before enabling real inference in Express. The default model file is `models/yolo/best.pt`; optional training requires `ROBOFLOW_API_KEY` in the process environment:

```powershell
python detection/train.py
```

For reconstruction, install COLMAP separately and make it available on `PATH`. Reconstruction is CPU-intensive and produces local scene/model artifacts that are not generated by the normal web-app build.

## 21. Testing Instructions

Backend tests connect to the database named by `MONGODB_TEST_URI` and fail if it is missing. Point it only to a disposable, isolated test database:

```powershell
Set-Location backend
$env:MONGODB_TEST_URI = "mongodb://127.0.0.1:27017/herbiva_ai_test"
npm test
Remove-Item Env:\MONGODB_TEST_URI
```

Run frontend lint with `npm run lint` from `frontend/`. Run Python tests from `virtualgarden-ai/` with `python -m pytest tests`. A syntax-only check can be run with `python -m compileall backend detection reconstruction tests`. No frontend test script is currently defined.

## 22. Production Build

```powershell
Set-Location frontend
npm run build

# In a separate terminal
Set-Location backend
npm run build
```

The frontend build output is configured as `.next-build`. The backend TypeScript build emits `dist/`. FastAPI is run directly by Uvicorn and has no separate compile/build step. These build commands do not start MongoDB or validate that the AI weights can load.

## 23. Deployment Instructions

Deploy the frontend, Express API, MongoDB, and AI service as separately configured components. Set the frontend's public API URL at build time; set backend database, JWT, CORS, upload, and AI URL values through the hosting platform's secret/configuration system. Keep mock mode disabled in production. Deploy compatible AI weights with the AI service and validate `/health` before routing scans to it.

Use TLS, restrict CORS to the production frontend origin, and size CPU/memory/timeouts for inference. Run reconstruction in a durable worker/queue for production rather than relying on in-process FastAPI background tasks. The repository currently has no Docker, CI workflow, infrastructure-as-code, or automated deployment manifests.

## 24. Troubleshooting

- **Backend exits before listening:** MongoDB must be reachable and `MONGODB_URI` must be a valid URI; `JWT_SECRET` must satisfy validation.
- **Browser CORS errors:** Set `CLIENT_URL` to the frontend's exact origin and restart Express.
- **Scans are simulated:** `MOCK_AI_MODE=true` is enabled. This is a labeled development result, not a model prediction.
- **AI reports unavailable:** Check FastAPI `/health`, `AI_SERVICE_URL`, Python dependencies, and the configured model path/weights.
- **AI inference returns no predictions:** Confirm the trained weights and their class metadata are the expected model; the service applies a 0.30 confidence threshold.
- **Jest reports missing test URI:** Set `MONGODB_TEST_URI` to a separate disposable database.
- **Reconstruction fails or is slow:** Confirm COLMAP is installed on `PATH`, provide useful video/multi-view input, and allow for CPU-heavy processing.
- **Model missing after clone:** Install Git LFS and run `git lfs pull`.

## 25. Security Guidelines

- Never commit `.env`, `.env.local`, private keys, credentials, or real API tokens.
- Rotate the Roboflow credential that was present in the removed AI documentation; removing it from the current files does not revoke it or remove copies already shared elsewhere.
- Use a unique random JWT secret in each environment; replace all example placeholders.
- Keep MongoDB and Cloudinary credentials server-side. Only `NEXT_PUBLIC_*` values belong in browser bundles, and those values are public.
- Use an isolated database for tests; never run destructive tests against production.
- Do not expose the AI reconstruction endpoint publicly without strict video validation, upload limits, authentication, rate limiting, and worker resource controls.
- Treat plant identification as informational, not medical advice. Validate model outputs and communicate uncertainty.

## 26. Future Improvements

- Move reconstruction jobs to a durable queue with status, cancellation, and resource limits.
- Add verified model/version metadata, model evaluation reports, and dataset provenance.
- Implement and evaluate disease detection before advertising that capability.
- Add frontend tests, broader API tests, CI checks, and supported-runtime constraints.
- Add container/deployment definitions, health probes, observability, and backup procedures.
- Define a versioned OpenAPI contract and improve API client error handling.
- Confirm licensing for the source, dataset, model weights, and generated assets before redistribution.

## 27. Contribution Guidelines

1. Create a focused branch from the repository's `main` branch.
2. Keep frontend, backend, and AI changes within their existing application boundaries.
3. Add or update tests and documentation for behavior changes.
4. Run the relevant lint, build, and test commands before opening a pull request.
5. Do not include secrets, local databases, datasets, virtual environments, or generated training runs.

The earlier AI documentation described the project as MIT-licensed, but no repository `LICENSE` file is present. Confirm ownership and applicable dependency/model/data terms, then add an authoritative license before distributing the project.
#   V i r t u a l - H e r b a l - G a r d e n  
 #   v i r t u a l - h e r b a l - g a r d e n  
 