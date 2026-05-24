import { api } from "./api";

export async function listIntegrationsRequest() {
  const { data } = await api.get("/integrations");
  return data.integrations;
}

export async function startOAuthRequest(provider) {
  const { data } = await api.get(`/integrations/oauth/${provider}/start`);
  return data.url;
}
