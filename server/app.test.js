import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { createDb } from "./lib/db.js";

async function testApp() {
  const directory = await mkdtemp(path.join(os.tmpdir(), "civic-voice-"));
  const db = await createDb(path.join(directory, "db.json"));
  return { app: await createApp({ db }), db };
}

describe("CivicVoice baseline API", () => {
  it("creates a missing datastore directory on first use", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "civic-voice-"));
    const db = await createDb(path.join(directory, "missing", "data", "db.json"));
    expect(db.data.users).toHaveLength(2);
  });

  it("logs in the seeded citizen", async () => {
    const { app } = await testApp();
    const response = await request(app).post("/api/login").send({
      nric: "S0000001A", password: "citizen123", role: "citizen",
    });
    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("citizen");
  });

  it("reports that the local API is healthy", async () => {
    const { app } = await testApp();
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true, service: "civic-voice-api" });
  });

  it("accepts and stores feedback with a valid category", async () => {
    const { app } = await testApp();
    const response = await request(app).post("/api/feedback").send({
      nric: "S0000001A", name: "Aisha Rahman", message: "Please add more benches.", category: "Transport",
    });
    expect(response.status).toBe(201);
    expect(response.body.feedback.message).toBe("Please add more benches.");
    expect(response.body.feedback.category).toBe("Transport");

    const inbox = await request(app).get("/api/feedback").set("x-user-role", "admin");
    expect(inbox.body.feedback[0]).toMatchObject({ id: response.body.feedback.id, category: "Transport" });
  });

  it("rejects a missing or unsupported feedback category", async () => {
    const { app } = await testApp();
    const feedback = { nric: "S0000001A", name: "Aisha Rahman", message: "Please add more benches." };

    for (const category of [undefined, "General", "Roadworks"]) {
      const response = await request(app).post("/api/feedback").send({ ...feedback, category });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Please choose a valid feedback category.");
    }
  });

  it("blocks the feedback list without the admin role header", async () => {
    const { app } = await testApp();
    const response = await request(app).get("/api/feedback");
    expect(response.status).toBe(403);
  });

  it("returns feedback newest first when stored data is out of order", async () => {
    const { app, db } = await testApp();
    db.data.feedback = [
      { id: "old", createdAt: "2026-08-28T09:00:00.000Z" },
      { id: "new", createdAt: "2026-08-30T09:00:00.000Z" },
      { id: "middle", createdAt: "2026-08-29T09:00:00.000Z" },
    ];

    const response = await request(app).get("/api/feedback").set("x-user-role", "admin");

    expect(response.status).toBe(200);
    expect(response.body.feedback.map((item) => item.id)).toEqual(["new", "middle", "old"]);
  });
});
