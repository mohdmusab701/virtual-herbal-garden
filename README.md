

# 🌿 Virtual Herbal Garden — Herbiva AI

<p align="center">
  **An AI-Powered Virtual Herbal Garden for Plant Discovery, Identification & 3D Visualization**
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/AI-YOLOv8-111F68" alt="YOLO" />
</p>

---

## 🌱 About the Project

**Virtual Herbal Garden (Herbiva AI)** is a full-stack, AI-powered platform designed to make medicinal plant discovery, identification, and garden management more accessible.

The platform combines a modern Next.js frontend, an Express.js application backend, MongoDB database, and a dedicated Python-based AI inference service.

Users can explore medicinal plants, manage their virtual gardens, upload plant images for identification, track scan history, and interact with garden-related features.

The project also includes an experimental **video-to-3D reconstruction pipeline** that uses COLMAP and NeRF to generate 3D plant models.

### 🎯 Project Goals

- Make medicinal plant information easier to discover.
- Provide AI-powered plant identification.
- Enable personalized virtual garden management.
- Connect frontend applications with a documented REST API.
- Experiment with 3D plant reconstruction and visualization.
- Maintain independently deployable frontend, backend, and AI services.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌿 Plant Explorer | Browse medicinal plants and their information. |
| 📸 AI Plant Scanner | Upload plant images for YOLO-based identification. |
| 🌳 Virtual Garden | Manage plants and explore an interactive 3D garden. |
| 💧 Plant Care | Manage garden care tasks and activities. |
| 📊 Scan History | Access previous plant identification records. |
| 🤖 AI Assistant | Interact with the garden assistant. |
| 🔐 Authentication | Secure registration, login, and JWT-based authorization. |
| 🛠️ Admin Dashboard | Manage application users, plants, and scan records. |
| 🧊 3D Reconstruction | Experimental video-to-3D plant reconstruction pipeline. |
| ☁️ Image Uploads | Optional Cloudinary integration. |

> **Important:** Some frontend screens currently use fixture data. Disease detection is not implemented, and the scanner's development mock mode does not perform real identification. Actual AI identification requires compatible trained YOLO weights.

---

## 🛠️ Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Three.js
- React Three Fiber
- Drei
- Recharts
- Lucide Icons

### Backend
- Node.js
- Express.js 4
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Zod Validation
- Helmet
- Multer
- Swagger / OpenAPI

### AI & Machine Learning
- Python
- FastAPI
- Ultralytics YOLO
- PyTorch
- OpenCV
- NumPy
- Pillow
- Pydantic

### 3D Reconstruction
- COLMAP
- NeRF
- Open3D
- Trimesh
- SciPy
- scikit-image

### Testing & Development
- Jest
- Supertest
- ts-jest
- pytest
- Git
- Git LFS

---

## 🏗️ System Architecture

The application follows a modular architecture with three independently runnable services.

```text
                   ┌─────────────────────┐
                   │      USER / UI      │
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │   Next.js Frontend  │
                   │     Port: 3000      │
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │    Express API      │
                   │     Port: 5000      │
                   └──────┬───────┬──────┘
                          │       │
                ┌─────────▼─┐  ┌──▼────────────┐
                │ MongoDB   │  │ FastAPI AI    │
                │ Database  │  │ Port: 8000    │
                └───────────┘  └──────┬────────┘
                                      │
                            ┌─────────▼─────────┐
                            │   YOLO Model      │
                            │   Plant Detection │
                            └─────────┬─────────┘
                                      │
                            ┌─────────▼─────────┐
                            │  3D Reconstruction│
                            │  COLMAP + NeRF    │
                            └───────────────────┘
```

### Service Responsibilities

| Service | Responsibility | Default Port |
|---|---|---|
| Frontend | User interface and visualization | 3000 |
| Express Backend | Authentication, APIs, database operations | 5000 |
| FastAPI AI Service | Plant detection and reconstruction | 8000 |
| MongoDB | Persistent application data | 27017 (local default) |

---

## 📁 Project Structure

```text
Virtual-Herbal-Garden/
│
├── backend/                    # Express application API
│   ├── src/
│   │   ├── config/             # Database and service configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Authentication and validation
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── seed/               # Database seed utilities
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Shared utilities
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── data/               # Fixture data
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/api/            # API clients
│   │   └── types/              # TypeScript types
│   ├── .env.example
│   └── package.json
│
├── virtualgarden-ai/           # Python AI application
│   ├── backend/                # FastAPI application
│   ├── configs/                # Training configurations
│   ├── detection/              # YOLO training and inference
│   ├── models/yolo/             # Trained model weights
│   ├── reconstruction/         # COLMAP and NeRF pipeline
│   ├── tests/                  # Python tests
│   ├── viewer/                 # Static 3D viewer
│   └── requirements.txt
│
├── .gitattributes
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Prerequisites

Before running the project, install:

| Requirement | Purpose |
|---|---|
| Node.js & npm | Frontend and backend |
| Python | AI service |
| MongoDB | Application database |
| Git | Version control |
| Git LFS | Large YOLO model files |
| COLMAP | 3D reconstruction |

**Recommended:** Check Python package compatibility before installing the AI dependencies. The requirements include large computer-vision and geometry packages.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Virtual-Herbal-Garden
```

If the repository uses Git LFS:

```bash
git lfs install
git lfs pull
```

### 2. Setup Backend

```powershell
Copy-Item backend\.env.example backend\.env

cd backend
npm install
```

Configure `backend/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/herbiva_ai
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/herbiva_ai_test

JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
AI_SERVICE_URL=http://127.0.0.1:8000

MOCK_AI_MODE=true
MAX_IMAGE_SIZE_MB=10
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```powershell
cd frontend

Copy-Item .env.example .env.local

npm install
```

Configure `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open:

**http://localhost:3000**

### 4. Setup Python AI Service

Open another terminal from the repository root:

```powershell
cd virtualgarden-ai

py -3 -m venv .venv

.\.venv\Scripts\Activate.ps1

python -m pip install --upgrade pip

pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open the API documentation:

**http://localhost:8000/docs**

### 5. Configure YOLO Model

Place the compatible trained model at:

```text
virtualgarden-ai/models/yolo/best.pt
```

Or configure a custom path using:

```env
MODEL_PATH=models/yolo/best.pt
```

Check the AI health endpoint:

```text
http://localhost:8000/health
```

Verify that `inference_ready` is `true` before enabling real AI inference.

To enable real inference, set:

```env
MOCK_AI_MODE=false
```

Restart the Express backend.

> Never use generic pretrained weights as a replacement for the project's trained weights.

---

## 🔄 Plant Identification Workflow

1. User logs into the application.
2. User uploads a plant image through the scanner.
3. Frontend sends the image to `POST /api/scans/identify`.
4. Express validates the uploaded image.
5. Express either returns a clearly marked mock response or forwards the image to FastAPI.
6. FastAPI processes the image using the configured YOLO model.
7. Detection results, labels, confidence scores, and optional bounding boxes are returned.
8. Express stores the scan information in MongoDB.

**Supported image formats:** JPEG, PNG, WebP.

**Default confidence threshold:** 0.30.

---

## 🧊 3D Plant Reconstruction

The project includes an experimental video-to-3D reconstruction workflow.

### Pipeline

```text
Video / Multiple Images
          │
          ▼
     Frame Extraction
          │
          ▼
        COLMAP
   Camera Pose Estimation
          │
          ▼
      NeRF Training
          │
          ▼
      Mesh Export
          │
          ▼
       GLB Model
          │
          ▼
    3D Visualization
```

### Requirements

- Suitable multi-view images or video.
- COLMAP installed and accessible through PATH.
- Compatible Python dependencies.
- Sufficient CPU resources and processing time.

### API

```http
POST /reconstruct?species=<species_name>
```

Generated models can be accessed through:

```http
GET /models/{species}.glb
```

The AI service also provides a static viewer:

```text
http://localhost:8000/viewer
```

**Note:** Reconstruction currently uses FastAPI in-process background tasks. It is experimental and is not a durable production job queue.

---

## 📡 API Documentation

### Express REST API

Base URL:

```text
http://localhost:5000/api
```

| Endpoint | Functionality |
|---|---|
| `/health` | Application health |
| `/auth` | Authentication |
| `/users` | User profile management |
| `/plants` | Plant management |
| `/scans` | Plant identification and scan history |
| `/disease` | Disease scan records (inference unavailable) |
| `/gardens` | Garden management |
| `/care` | Plant care tasks |
| `/models` | 3D model records |
| `/assistant` | Assistant and chat history |
| `/admin` | Administrative operations |

**Swagger Documentation:**

http://localhost:5000/api/docs

### FastAPI AI API

Base URL:

```text
http://localhost:8000
```

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/predict/plant` | Plant inference |
| POST | `/detect` | Direct plant detection |
| GET | `/health` | AI service readiness |
| GET | `/species` | Plant species metadata |
| GET | `/models/{species}.glb` | Retrieve generated 3D model |
| GET | `/viewer` | Static 3D viewer |
| POST | `/reconstruct` | Queue reconstruction |

**Interactive API Documentation:**

http://localhost:8000/docs

---

## 🗄️ Database Architecture

The application uses MongoDB with Mongoose.

### Main Collections / Models

- User
- Plant
- PlantScan
- DiseaseScan
- Garden
- CareTask
- ChatMessage
- Model3D

User-specific records reference their respective owners. Plant scan records can contain prediction metadata, mock status, and timestamps.

Use a separate database for testing. Never connect automated tests to production data.

---

## 🔐 Authentication & Security

The backend implements:

- JWT-based authentication.
- Password hashing with bcrypt.
- Role-based authorization (`user` and `admin`).
- Request validation using Zod.
- Security headers using Helmet.
- API rate limiting.
- Configurable upload size restrictions.

### Security Best Practices

- Use strong, unique JWT secrets.
- Never commit environment files or API credentials.
- Keep private credentials on the server.
- Never expose secrets through `NEXT_PUBLIC_` variables.
- Use isolated test databases.
- Restrict CORS to trusted frontend origins.
- Validate uploaded files before processing.
- Protect reconstruction endpoints from resource abuse.

---

## 🧪 Testing

### Backend Tests

Configure a disposable MongoDB test database:

```powershell
cd backend

$env:MONGODB_TEST_URI = "mongodb://127.0.0.1:27017/herbiva_ai_test"

npm test

Remove-Item Env:\MONGODB_TEST_URI
```

### Frontend Lint

```bash
cd frontend
npm run lint
```

### Python Tests

```bash
cd virtualgarden-ai
python -m pytest tests
```

### Python Syntax Check

```bash
python -m compileall backend detection reconstruction tests
```

---

## 🏗️ Production Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm run build
```

Frontend build output is configured as `.next-build`. Backend TypeScript output is generated in `dist/`.

These commands do not verify MongoDB connectivity or successful AI model loading.

---

## ☁️ Deployment

Deploy the application as independently configured services.

| Component | Deployment Requirement |
|---|---|
| Frontend | Next.js hosting |
| Backend | Node.js hosting |
| Database | MongoDB Atlas or managed MongoDB |
| AI Service | Python-compatible hosting with sufficient CPU/RAM |
| Model Files | Compatible trained YOLO weights |

### Production Checklist

- [ ] Configure production environment variables.
- [ ] Set the correct frontend API URL.
- [ ] Configure MongoDB connection.
- [ ] Use a strong JWT secret.
- [ ] Set `NODE_ENV=production`.
- [ ] Keep `MOCK_AI_MODE=false`.
- [ ] Deploy trained YOLO weights.
- [ ] Verify FastAPI `/health`.
- [ ] Configure production CORS.
- [ ] Enable HTTPS.
- [ ] Configure upload restrictions and timeouts.
- [ ] Move reconstruction to a durable worker/queue.

**Important:** The repository currently does not include Docker configurations, CI/CD workflows, infrastructure-as-code, or automated deployment manifests.

---

## 🛣️ Future Roadmap

- [ ] Improve plant identification accuracy and evaluation.
- [ ] Implement and validate disease detection.
- [ ] Add model versioning and dataset provenance.
- [ ] Improve personalized plant care recommendations.
- [ ] Add a durable reconstruction job queue.
- [ ] Introduce frontend automated testing.
- [ ] Add CI/CD pipelines.
- [ ] Add Docker and deployment configurations.
- [ ] Improve observability and error monitoring.
- [ ] Optimize 3D model loading and visualization.

---

## 🤝 Contributing

Contributions and improvements are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add or update relevant tests.
5. Run the required checks.
6. Submit a pull request.

Please avoid committing secrets, datasets, virtual environments, generated model artifacts, and local database files.

---

## ⚖️ License

No authoritative `LICENSE` file is currently present in the repository. Confirm project ownership and third-party dependency, dataset, and model licensing before redistribution.

---

## 🌿 Project Vision

**Virtual Herbal Garden — Herbiva AI**

*Bringing medicinal plants, artificial intelligence, and immersive 3D experiences together in one digital garden.*

<p align="center">
  **Built with ❤️ for technology, nature, and innovation.**
</p>

