# 🌿 Virtual Herbal Garden — Herbiva AI

<p align="center">
  <strong>AI-Powered Plant Identification & Virtual Herbal Garden Platform</strong>
</p>

<p align="center">
  Explore medicinal plants, identify species using AI, manage your virtual garden, and experience interactive 3D plant visualization.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb" />
  <img src="https://img.shields.io/badge/AI-YOLOv8-purple" />
</p>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Project Objectives](#-project-objectives)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Application Architecture](#-application-architecture)
- [AI & Machine Learning](#-ai--machine-learning)
- [Plant Identification Workflow](#-plant-identification-workflow)
- [3D Reconstruction Workflow](#-3d-reconstruction-workflow)
- [API Documentation](#-api-documentation)
- [Database Architecture](#-database-architecture)
- [Authentication & Security](#-authentication--security)
- [Environment Configuration](#-environment-configuration)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Production Build](#-production-build)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security Guidelines](#-security-guidelines)
- [Future Improvements](#-future-improvements)
- [Contribution Guidelines](#-contribution-guidelines)
- [License](#-license)

---

## 🌱 Overview

**Virtual Herbal Garden (Herbiva AI)** is a full-stack, AI-powered platform designed to make medicinal plant exploration, identification, and garden management easier and more interactive.

The platform combines a modern Next.js frontend, an Express REST API, MongoDB persistence, and a dedicated Python AI inference service.

It also includes an experimental computer-vision pipeline for reconstructing 3D plant models from videos or multiple images using COLMAP and NeRF-based techniques.

The repository contains three independently runnable applications:

| Application | Responsibility | Technology |
|---|---|---|
| Frontend | User interface and 3D garden | Next.js, React, TypeScript |
| Backend | Authentication, APIs and persistence | Node.js, Express, MongoDB |
| AI Service | Plant detection and 3D reconstruction | Python, FastAPI, YOLO |

> **Important:** Real plant identification requires compatible project-trained YOLO weights. Development mock mode simulates responses and must not be interpreted as actual AI inference. Disease detection is currently unavailable.

## 🎯 Project Objectives

- Make medicinal plant information accessible and easy to explore.
- Provide secure, account-based garden management.
- Integrate AI-powered plant identification.
- Support interactive 3D plant visualization.
- Develop an experimental video-to-3D reconstruction pipeline.
- Maintain independent frontend, backend, and AI services.
- Provide a scalable and maintainable application architecture.

## ✨ Key Features

### 🖥️ Frontend
- Modern Next.js dashboard.
- Plant exploration and detailed information pages.
- AI-powered plant scanner interface.
- Virtual garden management.
- Plant care and task management.
- Scan history and user settings.
- Interactive 3D garden visualization.
- Assistant and dashboard interfaces.

### ⚙️ Backend
- RESTful API architecture.
- JWT-based authentication.
- Role-based authorization.
- MongoDB database integration.
- Request validation using Zod.
- Secure password hashing with bcrypt.
- API rate limiting and security headers.
- Swagger/OpenAPI documentation.
- Optional Cloudinary image uploads.

### 🤖 AI & Machine Learning
- YOLO-based plant detection.
- CPU-based model inference.
- Plant species metadata.
- Image preprocessing using OpenCV.
- Configurable confidence threshold.
- Python FastAPI inference service.

### 🌍 3D Visualization & Reconstruction
- Interactive 3D garden using Three.js.
- React Three Fiber and Drei.
- Video and multi-view image processing.
- COLMAP camera pose estimation.
- NeRF-based reconstruction workflow.
- GLB mesh export and visualization.

### 🧪 Testing
- Jest and Supertest backend tests.
- Pytest for Python services.
- Frontend linting.
- Independent frontend and backend production builds.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| UI & Animation | Framer Motion, Lucide, Recharts |
| 3D Graphics | Three.js, React Three Fiber, Drei |
| Backend | Node.js, Express 4, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Security | Helmet, express-rate-limit |
| File Uploads | Multer, Cloudinary |
| AI Backend | Python, FastAPI, Uvicorn |
| Machine Learning | Ultralytics