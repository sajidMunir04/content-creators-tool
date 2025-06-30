export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'YouTube' | 'Blog' | 'Podcast' | 'Social Media' | 'Other';
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Planning' | 'In Progress' | 'Review' | 'Complete';
  color: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  tasks: Task[];
  progress: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
  progress: number;
  projectId: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  assignee?: string;
  deadline?: string;
  tags: string[];
  projectId: string;
  milestoneId?: string;
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface ContentCalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  platform: string;
  projectId: string;
  type: 'Publish' | 'Deadline' | 'Meeting' | 'Other';
}

export interface TimeEntry {
  id: string;
  taskId: string;
  duration: number;
  description: string;
  date: string;
}