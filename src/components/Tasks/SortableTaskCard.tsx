import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import TaskCard from './TaskCard';

interface SortableTaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (status: Task['status']) => void;
}

export default function SortableTaskCard({ task, onClick, onStatusChange }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <TaskCard
        task={task}
        onClick={onClick}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}