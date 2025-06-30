import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2,
  CheckCircle2,
  Circle,
  MoreVertical,
  Target
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDate, getPriorityColor, getStatusColor, getCategoryColor, isOverdue } from '../utils/helpers';
import TaskCard from '../components/Tasks/TaskCard';
import ProjectTimeline from '../components/Projects/ProjectTimeline';
import { Task } from '../types';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, milestones, updateTask, addTask } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'timeline'>('overview');

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectMilestones = milestones.filter(m => m.projectId === id);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(project.deadline);
  const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
  const totalTasks = projectTasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
  };

  const handleTaskClick = (task: Task) => {
    console.log('Task clicked:', task);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'tasks', label: 'Tasks', count: projectTasks.length },
    { id: 'milestones', label: 'Milestones', count: projectMilestones.length },
    { id: 'timeline', label: 'Timeline', count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
          </div>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Edit3 className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Deadline</span>
          </div>
          <p className={`text-lg font-semibold ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(project.deadline)}
          </p>
          {overdue && <p className="text-sm text-red-600 mt-1">Overdue</p>}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Progress</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{project.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Priority</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Circle className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Status</span>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {projectTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'Done' ? 'bg-green-500' :
                        task.status === 'In Progress' ? 'bg-blue-500' :
                        task.status === 'Review' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500">{task.status}</p>
                      </div>
                      {task.deadline && (
                        <span className="text-sm text-gray-500">
                          {formatDate(task.deadline)}
                        </span>
                      )}
                    </div>
                  ))}
                  {projectTasks.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No tasks yet</p>
                  )}
                </div>
              </div>

              {/* Project Tags */}
              {project.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Task Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Tasks</span>
                    <span className="font-semibold text-gray-900">{totalTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{completedTasks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <span className="font-semibold text-blue-600">
                      {projectTasks.filter(t => t.status === 'In Progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">To Do</span>
                    <span className="font-semibold text-gray-600">
                      {projectTasks.filter(t => t.status === 'To Do').length}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Task Progress</span>
                      <span className="font-semibold text-gray-900">{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
                  <button
                    onClick={() => setActiveTab('milestones')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {projectMilestones.slice(0, 3).map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.status === 'Complete' ? 'bg-green-500' :
                        milestone.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-500">{milestone.progress}% complete</p>
                      </div>
                    </div>
                  ))}
                  {projectMilestones.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No milestones yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                  onStatusChange={(status) => handleTaskStatusChange(task.id, status)}
                />
              ))}
              {projectTasks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-6">Get started by creating your first task for this project</p>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                <Plus className="h-4 w-4" />
                Add Milestone
              </button>
            </div>
            <div className="space-y-4">
              {projectMilestones.map(milestone => (
                <div key={milestone.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600 mb-3">{milestone.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Due: {formatDate(milestone.deadline)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{milestone.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {projectMilestones.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
                  <p className="text-gray-500 mb-6">Break your project into phases with milestones</p>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                    <Plus className="h-4 w-4" />
                    Create Milestone
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <ProjectTimeline 
            project={project}
            tasks={projectTasks}
            milestones={projectMilestones}
          />
        )}
      </div>
    </div>
  );
}