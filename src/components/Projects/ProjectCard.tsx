import React from 'react';
import { Calendar, Clock, Tag, MoreVertical } from 'lucide-react';
import { Project } from '../../types';
import { formatDate, getPriorityColor, getStatusColor, getCategoryColor, isOverdue } from '../../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({ project, onClick, onEdit, onDelete }: ProjectCardProps) {
  const overdue = isOverdue(project.deadline);

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
              {project.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
        </div>
        <button 
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu click
          }}
        >
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className={overdue ? 'text-red-600 font-medium' : ''}>
            {formatDate(project.deadline)}
          </span>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
          {project.priority}
        </span>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {project.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-gray-400" />
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{project.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}