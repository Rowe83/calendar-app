"use client"

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

function MonthView({ currentDate, events, onDateClick, onEventClick, onDeleteEvent }: CalendarViewProps) {
  const weeks = Array.from({ length: 6 }, (_, weekIdx) =>
    Array.from({ length: 7 }, (_, dayIdx) => {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), weekIdx * 7 + dayIdx + 1)
      return date
    }),
  )

  const backgroundColors = ["bg-blue-100", "bg-green-100", "bg-red-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100", "bg-orange-100"]

  return (
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
  )
}

function WeekView({ currentDate, events, onDateClick, onEventClick }: CalendarViewProps) {
  const weekDates = Array.from({ length: 7 }, (_, dayIdx) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + dayIdx)
    return date
  })

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDates.map((date, dayIdx) => {
        const dayEvents = events.filter(event => event.date.toDateString() === date.toDateString())
        const isToday = date.toDateString() === new Date().toDateString()

        return (
          <div
            key={dayIdx}
            onClick={() => onDateClick(date)}
            className={`min-h-24 md:min-h-28 p-2 rounded-md cursor-pointer smooth-transition hover:shadow-md ${
              isToday ? "ring-2 ring-primary" : ""
            } bg-white`}
          >
            <div className="text-xs font-semibold mb-1 text-foreground">
              {date.getDate()}
            </div>
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
  )
}

function DayView({ currentDate, events, onEventClick }: CalendarViewProps) {
  const dayEvents = events.filter(event => event.date.toDateString() === currentDate.toDateString())

  return (
    <div className="p-4">
      <div className="text-lg font-bold mb-2 text-foreground">
        {currentDate.toDateString()}
      </div>
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
    </div>
  )
}
