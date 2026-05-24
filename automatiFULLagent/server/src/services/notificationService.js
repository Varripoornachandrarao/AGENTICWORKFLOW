import { getSocketServer } from "../config/socket.js";
import { Notification } from "../models/Notification.js";

export async function createNotification(payload) {
  const notification = await Notification.create(payload);
  const clientNotification = notification.toClientObject();

  getSocketServer()?.to(`user:${payload.owner.toString()}`).emit("notification:new", clientNotification);
  return clientNotification;
}

export async function listNotifications(ownerId) {
  const notifications = await Notification.find({ owner: ownerId }).sort({ createdAt: -1 }).limit(50);
  return notifications.map((notification) => notification.toClientObject());
}
