import React from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../../types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task['status']) => void;
  onTaskClick: (task: Task) => void;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
}

const columns: { id: Task['status']; title: string; color: string }[] = [
  { id: 'To Do', title: 'To Do', color: 'bg-gray-50 border-gray-200' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
  { id: 'Review', title: 'Review', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'Done', title: 'Done', color: 'bg-green-50 border-green-200' },
];

export default function KanbanBoard({ tasks, onTaskMove, onTaskClick, onTaskStatusChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const newStatus = over.id as Task['status'];
      onTaskMove(active.id as string, newStatus);
    }
    
    setActiveTask(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-6">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
            onTaskClick={onTaskClick}
            onTaskStatusChange={onTaskStatusChange}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-90">
            <TaskCard
              task={activeTask}
              onClick={() => {}}
              onStatusChange={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}