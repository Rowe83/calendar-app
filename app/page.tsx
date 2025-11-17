"use client"

import { useState, useMemo } from "react"
import { Calendar, Route, CheckSquare } from "lucide-react"
import CalendarHeader from "@/components/calendar/calendar-header"
import CalendarView from "@/components/calendar/calendar-view"
import EventModal from "@/components/calendar/event-modal"
import { TodaySchedulePanel, TaskListPanel } from "@/components/calendar/task-panel"
import NotificationCenter from "@/components/calendar/notification-center"

interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location?: string
  reminder?: string
  description?: string
}

interface Task {
  id: string
  title: string
  completed: boolean
  date: Date
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<"month" | "week" | "day">("month")
  const [activeTab, setActiveTab] = useState<"calendar" | "schedule" | "tasks">("calendar")
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "团队会议",
      date: new Date(2024, 0, 1),
      startTime: "10:00",
      endTime: "11:00",
      location: "会议室 A",
      reminder: "15分钟前",
    },
    {
      id: "2",
      title: "项目规划",
      date: new Date(2024, 0, 3),
      startTime: "14:00",
      endTime: "15:30",
      location: "办公室",
      reminder: "30分钟前",
    },
  ])
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "完成报告", completed: false, date: new Date(2024, 0, 1) },
    { id: "2", title: "复习会议记录", completed: true, date: new Date(2024, 0, 1) },
  ])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setShowEventModal(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    handleAddEvent()
  }

  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...e, ...eventData } : e)))
    } else {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        ...eventData,
        date: selectedDate || new Date(),
      }
      setEvents([...events, newEvent])
    }
    setShowEventModal(false)
    setEditingEventId(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("确定要删除这个事件吗？")) {
      setEvents(events.filter((e) => e.id !== eventId))
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setEditingEventId(event.id)
    setShowEventModal(true)
  }

  const handleAddTask = (taskTitle: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskTitle,
      completed: false,
      date: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("确定要删除这个任务吗？")) {
      setTasks(tasks.filter((t) => t.id !== taskId))
    }
  }

  const todayEvents = useMemo(() => {
    return events.filter((e) => e.date.toDateString() === new Date().toDateString())
  }, [events])

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.date.toDateString() === new Date().toDateString())
  }, [tasks])

  const tabs = [
    { key: "calendar" as const, label: "日历", icon: Calendar },
    { key: "schedule" as const, label: "行程", icon: Route },
    { key: "tasks" as const, label: "任务", icon: CheckSquare },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <NotificationCenter events={events} />

      <div className="flex flex-col min-h-screen">
        <div className="flex-1 pb-28">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            {activeTab === "calendar" && (
              <div className="flex flex-col gap-4">
                <CalendarHeader
                  currentDate={currentDate}
                  viewType={viewType}
                  onViewChange={setViewType}
                  onDateChange={setCurrentDate}
                  onAddEvent={handleAddEvent}
                />
                <CalendarView
                  currentDate={currentDate}
                  viewType={viewType}
                  events={events}
                  onDateClick={handleDateClick}
                  onEventClick={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="max-w-3xl mx-auto">
                <TodaySchedulePanel todayEvents={todayEvents} className="cartoon-shadow" />
              </div>
            )}

            {activeTab === "tasks" && (
              <div className="max-w-3xl mx-auto">
                <TaskListPanel
                  todayTasks={todayTasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  className="cartoon-shadow"
                />
              </div>
            )}
          </div>
        </div>

        <nav className="sticky bottom-0 w-full bg-white border-t border-muted/40 shadow-lg">
          <div className="max-w-7xl mx-auto grid grid-cols-3">
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium smooth-transition ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
                  {label}
                </button>
              )
            })}
          </div>
        </nav>
      </div>

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          date={selectedDate}
          onClose={() => {
            setShowEventModal(false)
            setEditingEventId(null)
          }}
          onSave={handleSaveEvent}
          onDelete={
            selectedEvent
              ? () => {
                  handleDeleteEvent(selectedEvent.id)
                  setShowEventModal(false)
                  setEditingEventId(null)
                }
              : undefined
          }
        />
      )}
    </main>
  )
}
