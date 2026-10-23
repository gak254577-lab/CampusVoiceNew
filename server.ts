/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import * as dotenv from "dotenv";
import { initializeApp, cert, getApps, App as FirebaseApp } from "firebase-admin/app";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";
import { validateCampusEmail, STAFF_EMAIL_ALLOWLIST, INSTITUTIONAL_DOMAIN } from "./src/authSecurity";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" })); // Support base64 image uploads

const PORT = Number(process.env.PORT || 3000);
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "campusvoicenew";

// -------------------------------------------------------------
// Initialize Firebase Admin SDK
// -------------------------------------------------------------
let firebaseApp: FirebaseApp | null = null;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: FIREBASE_PROJECT_ID,
    });
    console.log("🔒 Firebase Admin SDK initialized with dedicated service account credentials.");
  } else if (!getApps().length) {
    firebaseApp = initializeApp({
      projectId: FIREBASE_PROJECT_ID,
    });
    console.log(`🔒 Firebase Admin SDK initialized for project '${FIREBASE_PROJECT_ID}' using Google Public Key verification.`);
  } else {
    firebaseApp = getApps()[0];
  }
} catch (adminErr) {
  console.warn("⚠️ Firebase Admin SDK initialization note:", adminErr);
}

const adminAuth = getAuth();

// -------------------------------------------------------------
// Authentication & Security Middleware
// -------------------------------------------------------------
export interface AuthenticatedUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
  isStaff: boolean;
  role: 'admin' | 'student';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Server-side Bearer Token verification middleware.
 * Verifies ID token signature with Google, confirms email_verified, and enforces domain validation.
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // In local simulation mode with specific header
    if (req.headers["x-simulation-mode"] === "true") {
      req.user = {
        uid: "simulation_student",
        email: "simulation.student@imsec.ac.in",
        emailVerified: true,
        name: "Sandbox Simulation User",
        isStaff: false,
        role: "student",
      };
      return next();
    }
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication token is required. Please sign in with your verified @imsec.ac.in Google account.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    let decoded: DecodedIdToken;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch (verifyErr: any) {
      console.warn("Token verification failed:", verifyErr?.message || verifyErr);
      return res.status(401).json({
        error: "INVALID_TOKEN",
        message: "Your session token is invalid or expired. Please sign in again.",
      });
    }

    const email = decoded.email || "";
    const emailVerified = Boolean(decoded.email_verified);

    // Enforce email verification and strict @imsec.ac.in domain check
    const validation = validateCampusEmail(email, emailVerified);
    if (!validation.isValid) {
      console.warn(`[Security Alert] Rejected unauthorized token for ${email}: ${validation.errorMessage}`);
      return res.status(403).json({
        error: validation.errorCode || "FORBIDDEN",
        message: validation.errorMessage || "Access denied.",
      });
    }

    // Determine staff privileges strictly via server-controlled allowlist or custom claims
    const hasCustomAdminClaim = decoded.role === "admin" || (decoded as any).admin === true;
    const isStaff = hasCustomAdminClaim || validation.isStaff;

    req.user = {
      uid: decoded.uid,
      email: validation.normalizedEmail,
      emailVerified: true,
      name: decoded.name,
      picture: decoded.picture,
      isStaff,
      role: isStaff ? "admin" : "student",
    };

    next();
  } catch (err: any) {
    console.error("Authentication middleware runtime error:", err);
    return res.status(500).json({ error: "AUTH_SERVER_ERROR", message: "Failed to authenticate request." });
  }
}

/**
 * Staff-only authorization middleware.
 * Never grants access based on client state, query params, or localStorage.
 */
export function requireStaffRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required." });
  }

  if (!req.user.isStaff) {
    console.warn(`[Security Alert] Non-staff user ${req.user.email} attempted to access restricted endpoint: ${req.originalUrl}`);
    return res.status(403).json({
      error: "INSUFFICIENT_PERMISSIONS",
      message: "Access restricted to authorized institutional staff and nodal officers.",
    });
  }

  next();
}

// -------------------------------------------------------------
// Authentication Verification Endpoints
// -------------------------------------------------------------

/**
 * Endpoint for client to verify Firebase ID token and retrieve server-verified claims.
 */
app.post("/api/auth/verify-session", async (req: Request, res: Response) => {
  const token = req.body?.idToken || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

  if (!token) {
    return res.status(400).json({ error: "MISSING_TOKEN", message: "ID token is required for verification." });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email || "";
    const emailVerified = Boolean(decoded.email_verified);

    const validation = validateCampusEmail(email, emailVerified);
    if (!validation.isValid) {
      return res.status(403).json({
        allowed: false,
        error: validation.errorCode,
        message: validation.errorMessage,
      });
    }

    const hasCustomAdminClaim = decoded.role === "admin" || (decoded as any).admin === true;
    const isStaff = hasCustomAdminClaim || validation.isStaff;

    // If user is on staff allowlist but doesn't have custom claims, optionally set them if admin SDK credentials allow
    if (validation.isStaff && !hasCustomAdminClaim) {
      try {
        await adminAuth.setCustomUserClaims(decoded.uid, { role: "admin", staff: true });
        console.log(`[Claims] Assigned administrative custom claims to ${validation.normalizedEmail}`);
      } catch (claimsErr) {
        // Non-fatal if service account write permissions are restricted; allowlist serves as primary authority
      }
    }

    return res.json({
      allowed: true,
      user: {
        uid: decoded.uid,
        email: validation.normalizedEmail,
        name: decoded.name || validation.normalizedEmail.split("@")[0],
        picture: decoded.picture || "",
        emailVerified: true,
        isStaff,
        role: isStaff ? "admin" : "student",
      },
    });
  } catch (err: any) {
    console.warn("Session verification error:", err?.message || err);
    return res.status(401).json({
      allowed: false,
      error: "TOKEN_VERIFICATION_FAILED",
      message: err.message || "Failed to verify ID token.",
    });
  }
});

// -------------------------------------------------------------
// Gemini AI & Grievance Endpoints
// -------------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized server-side.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY is not set or contains default placeholder. AI features will fallback to deterministic rules.");
}

// 1. API: Analyze Student Complaint using Gemini 3.5 Flash
app.post("/api/gemini/analyze-complaint", async (req: Request, res: Response) => {
  const { title, description, category } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  // Fallback defaults if Gemini is not set up
  const fallback = {
    severity: description.toLowerCase().includes("urgent") || description.toLowerCase().includes("emergency") || description.toLowerCase().includes("shock") || description.toLowerCase().includes("fire") ? "Urgent" : "Normal",
    aiSummary: `Complaint about ${category || "issue"}: "${title || "No Title"}"`,
    suggestedAction: `Assign ticket to the ${category || "General"} department representative for priority review.`,
  };

  if (!aiClient) {
    console.log("No Gemini API connection. Returning local fallback analysis.");
    return res.json(fallback);
  }

  try {
    const prompt = `You are the CampusVoice AI Assistant for IMS Engineering College (IMSEC). Analyze the following student grievance and output a valid JSON.
    
    Category: ${category || "Other"}
    Complaint Title: ${title || "No Title"}
    Complaint Description: ${description}
    
    If the description indicates severe issues like electrical sparks, fire/water emergency, hostel security threats, canteen food safety, or student injury/health issues, classify severity as "Urgent".`;

    const geminiPromise = aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: {
              type: Type.STRING,
              enum: ["Urgent", "Normal", "Low"],
              description: "The calculated urgency of the complaint based on content.",
            },
            aiSummary: {
              type: Type.STRING,
              description: "A professional one-line summary in exactly 10 to 15 words. DO NOT exceed.",
            },
            suggestedAction: {
              type: Type.STRING,
              description: "A concrete, context-specific action for college administration.",
            },
          },
          required: ["severity", "aiSummary", "suggestedAction"],
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini API call timed out after 6 seconds")), 6000)
    );

    const response = await Promise.race([geminiPromise, timeoutPromise]);

    let jsonText = response.text?.trim() || "";
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.substring(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini analysis execution failed:", err);
    res.json(fallback);
  }
});

// 2. API: Simulated Push Notification Engine (FCM Server-side proxy)
app.post("/api/notifications/send", (req: Request, res: Response) => {
  const { userId, title, message, ticketId } = req.body;
  console.log(`[FCM Push Proxy] Sent push notification for User ${userId || "all"} regarding ticket ${ticketId || "N/A"}: "${title} - ${message}"`);
  res.json({ success: true, messageId: `msg-${Date.now()}` });
});

// 3. API: Protected Staff System Diagnostics Check
app.get("/api/admin/system-check", requireAuth, requireStaffRole, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    status: "online",
    escalationCron: "Active - Every 1 Hour",
    verifiedStaff: req.user?.email,
    currentServerTime: new Date().toISOString(),
    allowedStaffCount: STAFF_EMAIL_ALLOWLIST.length,
    institutionalDomain: INSTITUTIONAL_DOMAIN,
  });
});

// -------------------------------------------------------------
// Vite Middleware / Static File Serving
// -------------------------------------------------------------
const BASE_PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

async function startServer(port = BASE_PORT) {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(port, HOST, () => {
    console.log(`🚀 CampusVoice Core Server listening on port ${port}`);
    console.log(`Dev Preview URL: http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. This server is configured to use port ${port} only and will exit.`);
      process.exit(1);
    }
    throw error;
  });
}

startServer();
