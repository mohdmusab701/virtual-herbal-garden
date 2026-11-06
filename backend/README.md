# Herbiva AI Backend

This is the Node.js/Express backend for Herbiva AI, an AI-powered virtual herbal garden.

## Tech Stack
- Node.js & Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Zod Validation
- Multer & Cloudinary (File Uploads)
- Swagger for API Docs

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Copy `.env.example` to `.env` and fill in your MongoDB and Cloudinary credentials.

3. Seed Database:
   ```bash
   npm run seed
   ```
   This creates initial plants and an admin user: `admin@herbiva.ai` / `admin123`.

4. Run Development Server:
   ```bash
   npm run dev
   ```

## Architecture
- **Controllers** (`src/controllers`): Handle HTTP requests and responses.
- **Services** (`src/services`): Contain all business logic and database interactions.
- **Models** (`src/models`): Mongoose schemas.
- **Routes** (`src/routes`): Define API endpoints.
- **Middleware** (`src/middleware`): Auth, Error, Upload, Validation.
- **AI Integration**: The `AIService` (`src/services/ai.service.ts`) forwards authenticated plant scans to the FastAPI backend at `AI_SERVICE_URL` when `MOCK_AI_MODE=false`. Set `AI_SERVICE_URL=http://127.0.0.1:8000` and `MOCK_AI_MODE=false` to use the configured inference service. Development mock mode returns an explicitly labeled preview, not a plant prediction. `MAX_IMAGE_SIZE_MB` configures the upload limit (default: 10 MB).

## API Documentation
Once the server is running, visit:
[http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Testing
Run Jest and Supertest integration tests:
```bash
npm run test
```
