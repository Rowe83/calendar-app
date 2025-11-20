"use client"

const WEEK_DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
const LUNAR_DAY_LABELS = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
]
const LUNAR_MONTH_FALLBACK = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"]
const lunarNumericFormatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("zh-CN-u-ca-chinese", { month: "numeric", day: "numeric" })
    : null
const lunarMonthFormatter =
  typeof Intl !== "undefined"
    ? new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
        month: "long",
      })
    : null

function getLunarLabel(date: Date) {
  if (!lunarNumericFormatter) return ""
  try {
    const parts = lunarNumericFormatter.formatToParts(date)
    const monthValue = Number(parts.find((p) => p.type === "month")?.value)
    const dayValue = Number(parts.find((p) => p.type === "day")?.value)

    if (!Number.isFinite(dayValue)) {
      return ""
    }

    if (dayValue === 1) {
      if (lunarMonthFormatter) {
        const monthText = lunarMonthFormatter.format(date)
        if (monthText) {
          // 为月份下方加红色下划线样式，适配react/jsx
          return (
            <span style={{ borderBottom: '1px solid red', paddingBottom: '1px' }}>
              {monthText
                .replace("十一月", "冬月")
                .replace("十二月", "腊月")
                .replace(/^一月$/, "正月")}
            </span>
          )
        }
      }
      if (Number.isFinite(monthValue)) {
        return (
          <span style={{ borderBottom: '1px solid red', paddingBottom: '1px' }}>
            {LUNAR_MONTH_FALLBACK[(monthValue - 1) % LUNAR_MONTH_FALLBACK.length] ?? ""}
          </span>
        )
      }
      return "初一"
    }

    return LUNAR_DAY_LABELS[dayValue - 1] ?? ""
  } catch {
    return ""
  }
}


interface Event {
  id: string
  title: string
  date: Date
  startTime: string
  endTime: string
  location?: string
}

interface CalendarViewProps {
  currentDate: Date
  viewType: "month" | "week" | "day"
  events: Event[]
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
  onDeleteEvent: (eventId: string) => void
}

type MonthViewProps = Pick<CalendarViewProps, "currentDate" | "events" | "onDateClick" | "onEventClick" | "onDeleteEvent">
type WeekViewProps = Pick<CalendarViewProps, "currentDate" | "events" | "onDateClick" | "onEventClick">
type DayViewProps = Pick<CalendarViewProps, "currentDate" | "events" | "onEventClick">

export default function CalendarView({
  currentDate,
  viewType,
  events,
  onDateClick,
  onEventClick,
  onDeleteEvent,
}: CalendarViewProps) {
  if (viewType === "month") {
    return (
      <MonthView
        currentDate={currentDate}
        events={events}
        onDateClick={onDateClick}
        onEventClick={onEventClick}
        onDeleteEvent={onDeleteEvent}
      />
    )
  } else if (viewType === "week") {
    return <WeekView currentDate={currentDate} events={events} onDateClick={onDateClick} onEventClick={onEventClick} />
  } else {
    return <DayView currentDate={currentDate} events={events} onEventClick={onEventClick} />
  }
}

function MonthView({ currentDate, events, onDateClick, onEventClick, onDeleteEvent }: MonthViewProps) {
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const calendarStartDate = new Date(firstDayOfMonth)
  calendarStartDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

  const weeks = Array.from({ length: 6 }, (_, weekIdx) =>
    Array.from({ length: 7 }, (_, dayIdx) => {
      const date = new Date(calendarStartDate)
      date.setDate(calendarStartDate.getDate() + weekIdx * 7 + dayIdx)
      return date
    }),
  )

  const backgroundColors = ["bg-blue-100", "bg-green-100", "bg-red-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100", "bg-orange-100"]

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold uppercase text-muted-foreground">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center tracking-wide">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
      {weeks.map((week, weekIdx) =>
        week.map((date, dayIdx) => {
          const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const isToday = date.toDateString() === new Date().toDateString()
          const bgColorIndex = (date.getDate() - 1) % backgroundColors.length
          const bgColor = isCurrentMonth ? backgroundColors[bgColorIndex] : "bg-muted/10"

          return (
            <div
              key={`${weekIdx}-${dayIdx}`}
              onClick={() => onDateClick(date)}
              className={`min-h-24 md:min-h-28 p-2 rounded-md cursor-pointer smooth-transition hover:shadow-md ${
                isToday ? "ring-2 ring-primary" : ""
              } ${bgColor} ${!isCurrentMonth ? "text-muted-foreground" : ""}`}
            >
              <div
                className={`text-xs font-semibold mb-1 ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}
              >
                {date.getDate()}
              </div>
              <div className="text-[10px] text-muted-foreground">{getLunarLabel(date)}</div>
              <div className="flex flex-col gap-1 overflow-visible justify-center">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className="text-xs bg-secondary text-white p-1 rounded cursor-pointer hover:bg-secondary/80 smooth-transition line-clamp-2 group relative overflow-visible min-h-6 flex items-center justify-center"
                    title={event.title}
                  >
                    {event.title}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteEvent(event.id)
                      }}
                      className="hidden group-hover:flex group-hover:items-center group-hover:justify-center absolute -right-1 -top-1 bg-destructive text-white rounded-full w-5 h-5 text-xs hover:bg-destructive/80 z-20"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-primary font-semibold">+{dayEvents.length - 2}个事件</div>
                )}
              </div>
            </div>
          )
        }),
      )}
      </div>
    </div>
  )
}

function WeekView({ currentDate, events, onDateClick, onEventClick }: WeekViewProps) {
  const weekDates = Array.from({ length: 7 }, (_, dayIdx) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + dayIdx)
    return date
  })

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold uppercase text-muted-foreground">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-center tracking-wide">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date, dayIdx) => {
          const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
          const isToday = date.toDateString() === new Date().toDateString()

          return (
            <div
              key={dayIdx}
              onClick={() => onDateClick(date)}
              className={`min-h-24 md:min-h-28 p-2 rounded-md cursor-pointer smooth-transition hover:shadow-lg border ${
                isToday
                  ? "ring-2 ring-primary border-primary/40 bg-white"
                  : "border-muted/40 bg-white/90 backdrop-blur-sm"
              }`}
            >
              <div className="text-xs font-semibold mb-1 text-foreground">
                {date.getDate()}
              </div>
              <div className="text-[10px] text-muted-foreground">{getLunarLabel(date)}</div>
              <div className="flex flex-col gap-1 overflow-visible justify-center">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    className="text-xs bg-secondary text-white p-1 rounded cursor-pointer hover:bg-secondary/80 smooth-transition line-clamp-2 group relative overflow-visible min-h-6 flex items-center justify-center"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-primary font-semibold">+{dayEvents.length - 2}个事件</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const dayEvents = events.filter(event => event.date.toDateString() === currentDate.toDateString())
  const formattedDate = currentDate.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  return (
    <div className="p-4">
      <div className="text-lg font-bold mb-2 text-foreground">
        {formattedDate}
      </div>
      <div className="text-sm text-muted-foreground mb-4">{getLunarLabel(currentDate)}</div>
      {dayEvents.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <div className="text-3xl">🗓️</div>
          <p className="text-sm font-medium">今天还没有行程</p>
          <p className="text-xs">点击日历中的日期或右上角按钮来添加你的第一个行程吧～</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="bg-secondary text-white p-2 rounded cursor-pointer hover:bg-secondary/80 smooth-transition"
            >
              <div className="text-sm font-semibold mb-1">{event.title}</div>
              <div className="text-xs">{`${event.startTime} - ${event.endTime}`}</div>
              {event.location && <div className="text-xs">地点: {event.location}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
