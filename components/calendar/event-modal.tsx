"use client"

import type React from "react"

import { useState } from "react"
import { X, Trash2 } from "lucide-react"

interface EventModalProps {
  event?: any
  date?: Date | null
  onClose: () => void
  onSave: (eventData: any) => void
  onDelete?: () => void
}

export default function EventModal({ event, date, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState(event?.title || "")
  const [startTime, setStartTime] = useState(event?.startTime || "10:00")
  const [endTime, setEndTime] = useState(event?.endTime || "11:00")
  const [location, setLocation] = useState(event?.location || "")
  const [reminder, setReminder] = useState(event?.reminder || "15分钟前")
  const [description, setDescription] = useState(event?.description || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert("请输入事件标题")
      return
    }
    onSave({ title, startTime, endTime, location, reminder, description })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto cartoon-shadow">
        <div className="flex items-center justify-between p-6 border-b border-muted sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-primary">{event ? "编辑事件" : "新增事件"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full smooth-transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">事件标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入事件标题"
              className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">开始时间</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">结束时间</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">地点</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="输入事件地点"
              className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">提醒时间</label>
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition"
            >
              <option value="不提醒">不提醒</option>
              <option value="5分钟前">5分钟前</option>
              <option value="15分钟前">15分钟前</option>
              <option value="30分钟前">30分钟前</option>
              <option value="1小时前">1小时前</option>
              <option value="1天前">1天前</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入事件描述"
              rows={3}
              className="w-full px-4 py-2 border-2 border-muted rounded-lg focus:border-primary focus:outline-none smooth-transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-muted text-foreground font-semibold rounded-full hover:bg-muted smooth-transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 smooth-transition"
            >
              保存事件
            </button>
          </div>

          {event && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="w-full px-4 py-3 mt-4 border-2 border-destructive text-destructive font-semibold rounded-full hover:bg-destructive/10 smooth-transition flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              删除事件
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
