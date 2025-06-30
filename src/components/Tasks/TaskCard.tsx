import React from 'react';
import { Calendar, Clock, User, Tag, CheckCircle2 } from 'lucide-react';
import { Task } from '../../types';
import { formatDate, getPriorityColor, getStatusColor, formatTimeSpent, isOverdue } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (status: Task['status']) => void;
}

export default function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const overdue = task.deadline && isOverdue(task.deadline);
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  const statusOptions: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Done'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1" onClick={onClick}>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(e.target.value as Task['status'])}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${getStatusColor(task.status)}`}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        
        {task.deadline && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span className={overdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.deadline)}
            </span>
          </div>
        )}
      </div>

      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Subtasks</span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {task.timeSpent > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeSpent(task.timeSpent)}</span>
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
        
        {task.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>{task.tags.slice(0, 2).join(', ')}</span>
            {task.tags.length > 2 && <span>+{task.tags.length - 2}</span>}
          </div>
        )}
      </div>
    </div>
  );
}