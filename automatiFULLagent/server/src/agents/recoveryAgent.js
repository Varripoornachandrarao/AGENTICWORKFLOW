export function classifyFailure(error) {
  const message = error?.message || "Unknown execution failure";

  if (message.includes("AUTH_EXPIRED")) {
    return { classification: "AUTH_EXPIRED", action: "escalate" };
  }

  if (message.includes("INTEGRATION_NOT_CONNECTED")) {
    return { classification: "API_FAILURE", action: "escalate" };
  }

  if (message.includes("RATE_LIMIT")) {
    return { classification: "RATE_LIMIT", action: "retry_with_backoff" };
  }

  if (message.includes("MISSING_FIELDS")) {
    return { classification: "MISSING_FIELDS", action: "escalate" };
  }

  return { classification: "TRANSIENT", action: "retry_with_backoff" };
}
