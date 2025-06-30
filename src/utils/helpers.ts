export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'High':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Complete':
    case 'Done':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'In Progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Review':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'Planning':
    case 'To Do':
    case 'Not Started':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'YouTube':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Blog':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'Podcast':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Social Media':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function calculateProjectProgress(tasks: any[]): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / tasks.length) * 100);
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

export function formatTimeSpent(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}