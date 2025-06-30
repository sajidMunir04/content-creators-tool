import React, { useState } from 'react';
import { Plus, Filter, Search, Grid, List, Kanban } from 'lucide-react';
import { useStore } from '../store/useStore';
import TaskCard from '../components/Tasks/TaskCard';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import { Task } from '../types';

export default function Tasks() {
  const { tasks, projects, updateTask } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('kanban');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesProject = filterProject === 'All' || task.projectId === filterProject;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const statuses = ['All', 'To Do', 'In Progress', 'Review', 'Done'];

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your tasks and track progress</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full lg:w-64"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'kanban' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Kanban className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onTaskStatusChange={handleTaskStatusChange}
        />
      ) : (
        <div className={`grid gap-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onStatusChange={(status) => handleTaskStatusChange(task.id, status)}
            />
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'All' || filterProject !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first task'
            }
          </p>
        </div>
      )}
    </div>
  );
}