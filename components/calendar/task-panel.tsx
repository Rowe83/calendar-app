"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

interface Event {
  id: string
  title: string
  startTime: string
  endTime: string
}

interface Task {
  id: string
  title: string
  completed: boolean
}

interface TodaySchedulePanelProps {
  todayEvents: Event[]
  className?: string
}

interface TaskListPanelProps {
  todayTasks: Task[]
  onAddTask: (title: string) => void
  onToggleTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  className?: string
}

function TodaySchedulePanelComponent({ todayEvents, className = "" }: TodaySchedulePanelProps) {
  return (
    <section className={`bg-white rounded-2xl p-4 md:p-6 ${className}`}>
      <h3 className="text-base md:text-lg font-bold text-primary mb-3 md:mb-4">📌 今日日程</h3>
      {todayEvents.length > 0 ? (
        <div className="space-y-2 md:space-y-3">
          {todayEvents.map((event) => (
            <div key={event.id} className="p-2 md:p-3 bg-blue-50 rounded-lg border-l-4 border-primary">
              <div className="font-semibold text-foreground text-sm md:text-base">{event.title}</div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {event.startTime} - {event.endTime}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4 text-sm">今天暂无日程安排</p>
      )}
    </section>
  )
}

function TaskListPanelComponent({ todayTasks, onAddTask, onToggleTask, onDeleteTask, className = "" }: TaskListPanelProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle)
      setNewTaskTitle("")
    }
  }

  return (
    <section className={`bg-white rounded-2xl p-4 md:p-6 ${className}`}>
      <h3 className="text-base md:text-lg font-bold text-primary mb-3 md:mb-4">✅ 任务清单</h3>

      <form onSubmit={handleAddTask} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="添加新任务..."
          className="flex-1 px-3 md:px-4 py-2 border-2 border-muted rounded-full focus:border-primary focus:outline-none smooth-transition text-xs md:text-sm"
        />
        <button
          type="submit"
          className="w-10 h-10 md:w-12 md:h-12 bg-accent text-white rounded-full hover:bg-accent/90 smooth-transition flex items-center justify-center shadow-md"
          aria-label="添加任务"
        >
          <Plus size={18} className="md:w-6 md:h-6" />
        </button>
      </form>

      {todayTasks.length > 0 ? (
        <div className="space-y-2">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 md:p-3 bg-orange-50 rounded-lg hover:bg-orange-100 smooth-transition"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
                className="w-4 md:w-5 h-4 md:h-5 cursor-pointer accent-secondary rounded flex-shrink-0"
              />
              <span
                className={`flex-1 text-xs md:text-sm ${
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.title}
              </span>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 smooth-transition"
                aria-label={`删除任务 ${task.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4 text-xs md:text-sm">暂无任务</p>
      )}
    </section>
  )
}

interface TaskPanelProps extends TodaySchedulePanelProps, Omit<TaskListPanelProps, "className"> {}

export default function TaskPanel({ todayEvents, todayTasks, onAddTask, onToggleTask, onDeleteTask }: TaskPanelProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <TodaySchedulePanelComponent todayEvents={todayEvents} />
      <TaskListPanelComponent
        todayTasks={todayTasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  )
}

export { TodaySchedulePanelComponent as TodaySchedulePanel, TaskListPanelComponent as TaskListPanel }
