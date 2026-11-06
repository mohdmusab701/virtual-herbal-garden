import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { isDatabaseConnected } from "./config/database";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { AIService } from "./services/ai.service";
import { errorResponse } from "./utils/apiResponse";

// Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import plantRoutes from "./routes/plant.routes";
import scanRoutes from "./routes/scan.routes";
import diseaseRoutes from "./routes/disease.routes";
import gardenRoutes from "./routes/garden.routes";
import careRoutes from "./routes/care.routes";
import model3dRoutes from "./routes/model3d.routes";
import assistantRoutes from "./routes/assistant.routes";
import adminRoutes from "./routes/admin.routes";
import { setupSwagger } from "./config/swagger";

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Swagger Documentation
setupSwagger(app);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

app.get("/api/health", async (_req, res) => {
  const aiHealth = env.MOCK_AI_MODE
    ? {
        status: env.NODE_ENV === "development" ? "mock" : "disabled",
        model_loaded: false,
      }
    : await AIService.checkHealth();

  res.status(200).json({
    success: true,
    message: "Herbiva AI backend is running",
    timestamp: new Date().toISOString(),
    services: {
      backend: "ok",
      database: isDatabaseConnected() ? "connected" : "unavailable",
      ai: aiHealth,
      mockMode: env.MOCK_AI_MODE,
    },
  });
});

app.use("/api", (_req, res, next) => {
  if (isDatabaseConnected()) return next();
  return errorResponse(
    res,
    503,
    "MongoDB is unavailable. Authentication, scans, and database-backed features are temporarily unavailable.",
  );
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/gardens", gardenRoutes);
app.use("/api/care", careRoutes);
app.use("/api/models", model3dRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/admin", adminRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Error Handler
app.use(errorHandler);

export default app;
