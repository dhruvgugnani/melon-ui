"use client";

import React, { useState } from "react";
import { LayeredNotificationStack, NotificationItem } from "../../../../../../registry/components/layered-notification-stack";

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Deployment Successful",
    description: "Production build #492 has been successfully deployed to the main cluster.",
    time: "2m ago",
    status: "success",
  },
  {
    id: "2",
    title: "High CPU Usage",
    description: "Database instance 'db-replica-2' is experiencing >90% CPU load for the past 5 minutes.",
    time: "15m ago",
    status: "warning",
  },
  {
    id: "3",
    title: "New Team Member",
    description: "Alex Johnson has joined the 'Frontend Core' team. Say hi!",
    time: "1h ago",
    status: "default",
    read: true,
  },
  {
    id: "4",
    title: "Payment Failed",
    description: "The scheduled monthly subscription charge of $49.00 could not be processed.",
    time: "3h ago",
    status: "error",
    read: true,
  },
  {
    id: "5",
    title: "System Update",
    description: "Scheduled maintenance will occur tomorrow at 02:00 UTC. Expect 15m of downtime.",
    time: "5h ago",
    status: "default",
    read: true,
  }
];

export function LayeredNotificationStackDemo() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  const addNotification = () => {
    const newId = Date.now().toString();
    const newNotif: NotificationItem = {
      id: newId,
      title: "New Alert Received",
      description: `System anomaly detected at ${new Date().toLocaleTimeString()}. Review logs for details.`,
      time: "Just now",
      status: ["default", "success", "warning", "error"][Math.floor(Math.random() * 4)] as "default" | "success" | "warning" | "error",
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (item: NotificationItem) => {
    setNotifications(prev => prev.filter(n => n.id !== item.id));
  };

  const resetStack = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 gap-12">
      <div className="w-full max-w-[360px] h-[360px] flex items-center justify-center pt-24">
        {notifications.length > 0 ? (
          <LayeredNotificationStack
            notifications={notifications}
            maxVisible={3}
            onSelect={removeNotification}
          />
        ) : (
          <div className="text-[#f4f4f4] opacity-50 text-sm font-mono">No notifications</div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={addNotification}
          className="px-4 py-2 bg-[#ff5c71] hover:bg-[#ff7a8a] text-[#0d0d0d] font-semibold text-sm rounded transition-colors"
        >
          Add Item
        </button>
        <button
          onClick={resetStack}
          className="px-4 py-2 border border-[#2a2a2a] hover:border-[#444] text-[#f4f4f4] font-semibold text-sm rounded transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default LayeredNotificationStackDemo;
