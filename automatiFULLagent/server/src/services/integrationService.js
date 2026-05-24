import { env } from "../config/env.js";
import { Integration } from "../models/Integration.js";
import { encryptSecret } from "./encryptionService.js";
import { ApiError } from "../utils/errors.js";

export const providerCatalog = {
  gmail: {
    label: "Gmail",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: () => env.googleClientId,
    clientSecret: () => env.googleClientSecret,
    scopes: ["https://www.googleapis.com/auth/gmail.send", "https://www.googleapis.com/auth/gmail.readonly"]
  },
  "google-sheets": {
    label: "Google Sheets",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: () => env.googleClientId,
    clientSecret: () => env.googleClientSecret,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  },
  slack: {
    label: "Slack",
    authUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientId: () => env.slackClientId,
    clientSecret: () => env.slackClientSecret,
    scopes: ["chat:write", "channels:read"]
  },
  discord: {
    label: "Discord",
    authUrl: "https://discord.com/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    clientId: () => env.discordClientId,
    clientSecret: () => env.discordClientSecret,
    scopes: ["bot", "applications.commands"]
  }
};

export async function listIntegrations(ownerId) {
  const connected = await Integration.find({ owner: ownerId });
  const byProvider = new Map(connected.map((item) => [item.provider, item]));

  return Object.entries(providerCatalog).map(([provider, meta]) => {
    const record = byProvider.get(provider);
    return (
      record?.toClientObject() || {
        provider,
        providerAccountName: meta.label,
        status: "disconnected",
        scopes: meta.scopes,
        connected: false
      }
    );
  });
}

export async function getIntegrationStatus(ownerId) {
  const integrations = await listIntegrations(ownerId);
  return {
    providers: integrations,
    connectedCount: integrations.filter((item) => item.connected).length
  };
}

export function getOAuthStartUrl(ownerId, provider) {
  const meta = providerCatalog[provider];

  if (!meta) {
    throw new ApiError(404, "Unsupported integration provider");
  }

  if (!meta.clientId()) {
    throw new ApiError(503, `${meta.label} OAuth client is not configured`);
  }

  const params = new URLSearchParams({
    client_id: meta.clientId(),
    redirect_uri: getRedirectUri(provider),
    response_type: "code",
    scope: meta.scopes.join(" "),
    state: Buffer.from(JSON.stringify({ ownerId, provider })).toString("base64url")
  });

  if (provider === "gmail" || provider === "google-sheets") {
    params.set("access_type", "offline");
    params.set("prompt", "consent");
  }

  return `${meta.authUrl}?${params.toString()}`;
}

export async function handleOAuthCallback({ provider, code, state }) {
  const meta = providerCatalog[provider];

  if (!meta) {
    throw new ApiError(404, "Unsupported integration provider");
  }

  const parsedState = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));

  if (parsedState.provider !== provider) {
    throw new ApiError(400, "OAuth state does not match provider");
  }

  if (!meta.clientId() || !meta.clientSecret()) {
    throw new ApiError(503, `${meta.label} OAuth token exchange is not configured`);
  }

  const tokenResponse = await exchangeToken(provider, meta, code);
  const expiresAt = tokenResponse.expires_in ? new Date(Date.now() + tokenResponse.expires_in * 1000) : undefined;

  const integration = await Integration.findOneAndUpdate(
    { owner: parsedState.ownerId, provider },
    {
      owner: parsedState.ownerId,
      provider,
      status: "connected",
      scopes: meta.scopes,
      encryptedAccessToken: encryptSecret(tokenResponse.access_token),
      encryptedRefreshToken: encryptSecret(tokenResponse.refresh_token || ""),
      expiresAt,
      providerAccountName: meta.label,
      lastError: ""
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return integration.toClientObject();
}

export async function upsertIntegration(ownerId, payload) {
  if (!providerCatalog[payload.provider]) {
    throw new ApiError(404, "Unsupported integration provider");
  }

  const integration = await Integration.findOneAndUpdate(
    { owner: ownerId, provider: payload.provider },
    {
      owner: ownerId,
      provider: payload.provider,
      status: payload.status || "connected",
      scopes: payload.scopes || providerCatalog[payload.provider].scopes,
      encryptedAccessToken: encryptSecret(payload.accessToken || ""),
      encryptedRefreshToken: encryptSecret(payload.refreshToken || ""),
      expiresAt: payload.expiresAt,
      providerAccountName: payload.providerAccountName || providerCatalog[payload.provider].label
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return integration.toClientObject();
}

async function exchangeToken(provider, meta, code) {
  const body = new URLSearchParams({
    client_id: meta.clientId(),
    client_secret: meta.clientSecret(),
    code,
    redirect_uri: getRedirectUri(provider),
    grant_type: "authorization_code"
  });

  const response = await fetch(meta.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new ApiError(400, data.error_description || data.error || "OAuth token exchange failed");
  }

  return data;
}

function getRedirectUri(provider) {
  return `${env.apiUrl}/api/integrations/oauth/${provider}/callback`;
}
