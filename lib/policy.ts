export type Plan = "free" | "student" | "pro";

export type PolicyResult = {
  effectiveHintLevel: 1 | 2 | 3 | 4;
  policyNotice?: string;
};

function clampHintLevel(level: number): 1 | 2 | 3 | 4 {
  const n = Math.max(1, Math.min(4, Math.floor(level)));
  return n as 1 | 2 | 3 | 4;
}

function looksLikeGradedCheatingRequest(message: string) {
  const m = message.toLowerCase();
  const mentionsAssessment = /(exam|midterm|final|quiz|test|graded|assignment|homework)/.test(m);
  const urgency = /(right now|currently|during|in progress|proctor|timed|submit|submission|due)/.test(m);
  const asksForAnswer = /(full solution|answer|solve|do it for me|write the proof|final answer)/.test(m);
  return mentionsAssessment && (urgency || asksForAnswer);
}

export function evaluateHintPolicy(input: {
  requestedHintLevel: number;
  plan: Plan;
  attempt?: string | null;
  message: string;
}): PolicyResult {
  const requested = clampHintLevel(input.requestedHintLevel);

  let maxByPlan: 1 | 2 | 3 | 4 = 2;
  if (input.plan === "student") maxByPlan = 3;
  if (input.plan === "pro") maxByPlan = 4;

  let effective = clampHintLevel(Math.min(requested, maxByPlan));
  let notice: string | undefined;

  if (looksLikeGradedCheatingRequest(input.message)) {
    effective = clampHintLevel(Math.min(effective, 2));
    notice =
      "I can’t provide full solutions for an active graded assessment. I can help with concepts and small hints so you can solve it yourself.";
  }

  if (requested === 4 && input.plan !== "pro") {
    effective = clampHintLevel(Math.min(effective, 3));
    notice = notice ?? "Full solutions are restricted. Upgrade to Pro for solution unlock after a written attempt.";
  }

  if (requested === 4 && input.plan === "pro" && !input.attempt?.trim()) {
    effective = 3;
    notice = notice ?? "To unlock a full solution, paste your attempt (even partial) so I can guide you responsibly.";
  }

  return { effectiveHintLevel: effective, policyNotice: notice };
}

