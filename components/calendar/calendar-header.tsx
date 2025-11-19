"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  viewType: "month" | "week" | "day"
  onViewChange: (type: "month" | "week" | "day") => void
  onDateChange: (date: Date) => void
}

export default function CalendarHeader({
  currentDate,
  viewType,
  onViewChange,
  onDateChange,
}: CalendarHeaderProps) {
  const monthName = currentDate.toLocaleString("zh-CN", { month: "long", year: "numeric" })

  const handlePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() - 1)
    }
    onDateChange(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewType === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewType === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  const getCenterButtonLabel = () => {
    if (viewType === "month") return "本月"
    if (viewType === "week") return "本周"
    return "今天"
  }

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 md:mb-2">📅 我的日历</h1>
          <p className="text-sm md:text-base text-muted-foreground">{monthName}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-4 md:mt-6">
        <div className="flex items-center gap-1 md:gap-2 bg-white rounded-full p-1 cartoon-shadow">
          <button onClick={handlePrevious} className="p-1 md:p-2 hover:bg-muted rounded-full smooth-transition">
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </button>
          <button
            onClick={handleToday}
            className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold text-primary hover:bg-blue-100 rounded-full smooth-transition"
          >
            {getCenterButtonLabel()}
          </button>
          <button onClick={handleNext} className="p-1 md:p-2 hover:bg-muted rounded-full smooth-transition">
            <ChevronRight size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        <div className="flex gap-1 md:gap-2 bg-white rounded-full p-1 cartoon-shadow ml-auto">
          {[
            { type: "month", label: "月" },
            { type: "week", label: "周" },
            { type: "day", label: "日" },
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onViewChange(type as any)}
              className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold smooth-transition ${
                viewType === type ? "bg-primary text-white" : "text-foreground hover:bg-muted"
              }`}
            >
              {label}视图
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
