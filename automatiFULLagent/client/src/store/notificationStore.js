import { create } from "zustand";
import { listNotificationsRequest } from "@/services/notificationService";

export const useNotificationStore = create((set) => ({
  notifications: [],
  isOpen: false,

  loadNotifications: async () => {
    const notifications = await listNotificationsRequest();
    set({ notifications });
    return notifications;
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications.filter((item) => item.id !== notification.id)]
    }));
  },

  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen }))
}));
