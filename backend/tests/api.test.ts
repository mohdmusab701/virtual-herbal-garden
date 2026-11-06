import request from "supertest";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app";

const testEmail = `test-${randomUUID()}@herbiva.test`;
let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
  jest.setTimeout(120000);

  if (!process.env.MONGODB_TEST_URI) {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_TEST_URI = mongoServer.getUri();
  }

  await mongoose.connect(process.env.MONGODB_TEST_URI);
}, 120000);

afterAll(async () => {
  await mongoose.connection.close();

  if (mongoServer) {
    await mongoServer.stop();
  }
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
