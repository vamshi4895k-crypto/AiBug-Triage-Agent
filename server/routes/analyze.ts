import { Router, Request, Response } from "express";
import { runAIBugTriage, TriageRequest } from "../services/aiAgent.js";

const router = Router();

// POST /api/analyze - Main bug triage analysis endpoint
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { errorText, stackTrace, codeSnippet, logs, screenshotDescription } = req.body;

    if (!errorText || typeof errorText !== "string" || errorText.trim().length === 0) {
      return res.status(400).json({
        error: "Validation Failed",
        message: "An error message or stack trace is required to begin analysis."
      });
    }

    const triageRequest: TriageRequest = {
      errorText: errorText.trim(),
      stackTrace: typeof stackTrace === "string" ? stackTrace.trim() : undefined,
      codeSnippet: typeof codeSnippet === "string" ? codeSnippet.trim() : undefined,
      logs: typeof logs === "string" ? logs.trim() : undefined,
      screenshotDescription: typeof screenshotDescription === "string" ? screenshotDescription.trim() : undefined
    };

    const triageResult = await runAIBugTriage(triageRequest);
    return res.json({
      success: true,
      data: triageResult
    });
  } catch (err: any) {
    console.error("[Route /analyze] Error processing triage request:", err);
    return res.status(500).json({
      error: "Analysis Error",
      message: err?.message || "Internal server error occurred while triaging the error."
    });
  }
});

// GET /api/status - Telemetry & Agent Health
router.get("/status", (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY);
  const provider = process.env.AI_PROVIDER || (hasKey ? "gemini" : "heuristic");
  const model = process.env.AI_MODEL || (hasKey ? "gemini-2.0-flash" : "built-in-heuristics");

  return res.json({
    status: "ONLINE",
    agent: "AI Bug Triage Agent v1.0",
    engineReady: true,
    provider,
    model,
    liveAIConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
});

export default router;
