import { listNotifications } from "../services/notificationService.js";

export async function index(req, res, next) {
  try {
    res.json({ notifications: await listNotifications(req.user.id) });
  } catch (error) {
    next(error);
  }
}
