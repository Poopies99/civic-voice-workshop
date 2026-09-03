import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import { createDb } from "./lib/db.js";

export async function createApp(options = {}) {
  const db = options.db ?? (await createDb());
  const loginRateLimit = {
    maxFailures: 5,
    windowMs: 15 * 60 * 1000,
    ...options.loginRateLimit,
  };
  const now = options.now ?? Date.now;
  const failedLoginAttempts = new Map();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "civic-voice-api" });
  });

  app.post("/api/login", (req, res) => {
    const { nric, password, role } = req.body ?? {};
    const user = db.data.users.find(
      (candidate) => candidate.nric === nric && candidate.password === password && candidate.role === role,
    );
    const attemptKey = `${nric ?? ""}:${role ?? ""}`;

    // A correct sign-in remains available and clears earlier failed attempts.
    if (user) {
      failedLoginAttempts.delete(attemptKey);

      // Workshop baseline only: this is deliberately not a production session.
      const token = Buffer.from(`${user.nric}:${user.role}`).toString("base64");
      return res.json({ token, user: { nric: user.nric, name: user.name, role: user.role } });
    }

    const currentTime = now();
    const attempts = (failedLoginAttempts.get(attemptKey) ?? [])
      .filter((attemptedAt) => currentTime - attemptedAt < loginRateLimit.windowMs);

    if (attempts.length >= loginRateLimit.maxFailures) {
      const retryAfterSeconds = Math.ceil(
        (attempts[0] + loginRateLimit.windowMs - currentTime) / 1000,
      );
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        error: "Too many unsuccessful sign-in attempts. Please wait a few minutes before trying again.",
      });
    }

    attempts.push(currentTime);
    failedLoginAttempts.set(attemptKey, attempts);
    return res.status(401).json({ error: "Invalid NRIC, password, or sign-in mode." });
  });

  app.get("/api/feedback", (req, res) => {
    if (req.header("x-user-role") !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }
    return res.json({ feedback: db.data.feedback });
  });

  app.post("/api/feedback", async (req, res) => {
    const { nric, name, message } = req.body ?? {};
    if (!message) return res.status(400).json({ error: "Please enter feedback." });
    const feedback = {
      id: crypto.randomUUID(), nric, name, message, category: "General", status: "New",
      createdAt: new Date().toISOString(),
    };
    db.data.feedback.unshift(feedback);
    await db.write();
    return res.status(201).json({ feedback });
  });

  return app;
}
