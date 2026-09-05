export type ThemeMode = 'system' | 'light' | 'dark'

export type Day = {
  id: string
  user_id: string
  date: string
  created_at: string
  updated_at: string
}

export type Priority = {
  id: string
  user_id: string
  day_id: string
  chain_id: string
  text: string
  completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  user_id: string
  day_id: string
  chain_id: string
  text: string
  completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  user_id: string
  day_id: string
  content: string
  position: number
  created_at: string
  updated_at: string
}

export type UserSettings = {
  id: string
  user_id: string
  theme: ThemeMode
  timezone: string
  email_reminders_enabled: boolean
  created_at: string
  updated_at: string
}

export type DailyPage = {
  day: Day
  priorities: Priority[]
  tasks: Task[]
  note: Note | null
}
