import {
  getIntegrationStatus,
  getOAuthStartUrl,
  handleOAuthCallback,
  listIntegrations,
  upsertIntegration
} from "../services/integrationService.js";

export async function index(req, res, next) {
  try {
    res.json({ integrations: await listIntegrations(req.user.id) });
  } catch (error) {
    next(error);
  }
}

export async function status(req, res, next) {
  try {
    res.json(await getIntegrationStatus(req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function oauthStart(req, res, next) {
  try {
    res.json({ url: getOAuthStartUrl(req.user.id, req.params.provider) });
  } catch (error) {
    next(error);
  }
}

export async function oauthCallback(req, res, next) {
  try {
    await handleOAuthCallback({
      provider: req.params.provider,
      code: req.query.code,
      state: req.query.state
    });

    res.redirect("/api/integrations/oauth/success");
  } catch (error) {
    next(error);
  }
}

export async function oauthSuccess(_req, res) {
  res.json({ message: "Integration connected successfully" });
}

export async function oauthError(req, res) {
  res.status(400).json({ message: req.query.message || "OAuth connection failed" });
}

export async function upsert(req, res, next) {
  try {
    res.json({ integration: await upsertIntegration(req.user.id, req.body) });
  } catch (error) {
    next(error);
  }
}
