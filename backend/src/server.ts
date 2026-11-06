import app from "./app";
import { connectDB } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(
      `✅ Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
    );
    if (env.MOCK_AI_MODE) {
      console.log(
        "⚠️ MOCK_AI_MODE is ENABLED - development scans return an explicitly labeled simulated result, not an AI prediction.",
      );
    }
  });
};

process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err?.name || "Error");
  process.exit(1);
});

startServer().catch((error: unknown) => {
  const code =
    error && typeof error === "object" && "code" in error
      ? ` (${String(error.code)})`
      : "";
  console.error(
    `❌ Server startup failed. MongoDB must be reachable before the API starts${code}.`,
  );
  process.exit(1);
});
