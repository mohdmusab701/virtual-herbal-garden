import request from "supertest";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import app from "../src/app";

const testDbUri = process.env.MONGODB_TEST_URI;
const testEmail = `test-${randomUUID()}@herbiva.test`;

beforeAll(async () => {
  if (!testDbUri) {
    throw new Error(
      "MONGODB_TEST_URI must be set to an isolated test database before running API tests.",
    );
  }
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Health Check API", () => {
  it("should return 200 on /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Herbiva AI backend is running");
  });
});

describe("Auth API", () => {
  let userToken: string;

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testEmail,
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.token).toBeDefined();

    userToken = res.body.data.token;
  });

  it("should not register with duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User 2",
      email: testEmail,
      password: "password123",
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it("should access protected route with token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testEmail);
  });

  it("should reject access without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
