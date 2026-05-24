import { api } from "./api";

export async function listNotificationsRequest() {
  const { data } = await api.get("/notifications");
  return data.notifications;
}
