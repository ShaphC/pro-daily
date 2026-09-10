export type ThemeMode = "system" | "light" | "dark";

export type Day = {
  id: string;
  user_id: string;
  date: string;
  carry_forward_decided: boolean;
  created_at: string;
  updated_at: string;
};

export type Priority = {
  id: string;
  user_id: string;
  day_id: string;
  chain_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  day_id: string;
  chain_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  user_id: string;
  day_id: string;
  content: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  theme: ThemeMode;
  timezone: string;
  email_reminders_enabled: boolean;
  carry_forward_priorities: boolean;
  carry_forward_tasks: boolean;
  carry_forward_notes: boolean;
  created_at: string;
  updated_at: string;
};

export type CarryForwardSource = {
  day: Day;
  priorities: Priority[];
  tasks: Task[];
  note: Note | null;
};

export type DailyPage = {
  day: Day;
  priorities: Priority[];
  tasks: Task[];
  note: Note | null;
  carryForwardSource: CarryForwardSource | null;
  carryForwardAvailable: boolean;
  carryForwardPriorities: boolean;
  carryForwardTasks: boolean;
  carryForwardNotes: boolean;
};
