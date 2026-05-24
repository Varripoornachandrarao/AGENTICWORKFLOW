import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export default function NotificationsDrawer() {
  const { notifications, isOpen, toggleDrawer, loadNotifications } = useNotificationStore();

  useEffect(() => {
    loadNotifications().catch(() => {});
  }, [loadNotifications]);

  return (
    <>
      <button
        type="button"
        onClick={toggleDrawer}
        className="relative grid h-10 w-10 place-items-center rounded-md border border-line bg-white text-slate-600 hover:text-ink"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {notifications.length ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <aside className="fixed right-0 top-0 z-30 h-screen w-full max-w-sm border-l border-line bg-white p-5 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink">Notifications</h2>
            <button type="button" onClick={toggleDrawer} className="rounded-md border border-line px-3 py-1 text-sm">
              Close
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <article key={notification.id} className="rounded-md border border-line p-3">
                  <p className="text-sm font-semibold text-ink">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{notification.type}</p>
                </article>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-line p-8 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            )}
          </div>
        </aside>
      ) : null}
    </>
  );
}
