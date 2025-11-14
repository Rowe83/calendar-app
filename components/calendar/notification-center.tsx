"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "reminder" | "task" | "info"
  timestamp: Date
}

interface NotificationCenterProps {
  events: any[]
}

export default function NotificationCenter({ events }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date()
      const upcomingNotifications: Notification[] = []

      events.forEach((event) => {
        const eventDate = new Date(event.date)
        const [hours, minutes] = event.startTime.split(":").map(Number)
        eventDate.setHours(hours, minutes, 0)

        // Check different reminder times
        const reminders = [
          { time: 5, label: "5分钟前" },
          { time: 15, label: "15分钟前" },
          { time: 30, label: "30分钟前" },
          { time: 60, label: "1小时前" },
          { time: 1440, label: "1天前" },
        ]

        reminders.forEach(({ time, label }) => {
          if (event.reminder === label) {
            const reminderTime = new Date(eventDate.getTime() - time * 60000)
            const timeDiff = eventDate.getTime() - now.getTime()
            const minutesDiff = timeDiff / 60000

            // Show notification if within 1 minute before the reminder time
            if (minutesDiff > time - 1 && minutesDiff <= time + 1) {
              const notificationId = `${event.id}-${label}`
              const exists = notifications.some((n) => n.id === notificationId)

              if (!exists) {
                upcomingNotifications.push({
                  id: notificationId,
                  title: event.title,
                  message: `提醒：${event.title} 将在 ${label} 开始`,
                  type: "reminder",
                  timestamp: new Date(),
                })
              }
            }
          }
        })
      })

      if (upcomingNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...upcomingNotifications.filter((n) => !prev.some((p) => p.id === n.id))])
      }
    }

    const interval = setInterval(checkUpcomingEvents, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [events, notifications])

  const handleRemoveNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 bg-white rounded-full cartoon-shadow hover:shadow-lg smooth-transition"
      >
        <Bell size={20} className="text-primary" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-destructive text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-0 w-80 bg-white rounded-2xl cartoon-shadow p-4 space-y-3 max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">通知</h3>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-foreground smooth-transition"
                >
                  清除全部
                </button>
              </div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg flex items-start gap-3 border-l-4 border-primary"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">{notification.message}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="p-1 hover:bg-white rounded smooth-transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center text-muted-foreground py-6 text-sm">暂无通知</p>
          )}
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 space-y-2 pointer-events-none z-50">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className="animate-slide-in-right bg-white rounded-lg p-4 cartoon-shadow max-w-xs pointer-events-auto"
          >
            <div className="font-semibold text-foreground">{notification.title}</div>
            <div className="text-sm text-muted-foreground">{notification.message}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
