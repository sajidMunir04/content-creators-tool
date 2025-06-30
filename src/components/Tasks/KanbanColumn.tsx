import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task } from '../../types';
import SortableTaskCard from './SortableTaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function KanbanColumn({ id, title, color, tasks, onTaskClick, onTaskStatusChange }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex-shrink-0 w-80">
      <div className={`rounded-lg border-2 border-dashed p-4 ${color} min-h-[600px]`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 hover:bg-white hover:bg-opacity-70 rounded-lg transition-colors duration-200">
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div ref={setNodeRef} className="space-y-3">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <SortableTaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
                onStatusChange={(status) => onTaskStatusChange(task.id, status)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}