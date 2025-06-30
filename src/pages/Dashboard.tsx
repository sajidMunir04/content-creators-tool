import React from 'react';
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Target,
  Users,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentActivity from '../components/Dashboard/RecentActivity';
import { calculateProjectProgress } from '../utils/helpers';

export default function Dashboard() {
  const { projects, tasks } = useStore();

  const stats = {
    totalProjects: projects.length,
    activeTasks: tasks.filter(t => t.status === 'In Progress').length,
    completedTasks: tasks.filter(t => t.status === 'Done').length,
    totalTimeSpent: tasks.reduce((acc, task) => acc + task.timeSpent, 0),
    overdueItems: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date()).length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0,
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const upcomingDeadlines = tasks
    .filter(t => t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Projects"
          value={stats.totalProjects}
          change="+2 this week"
          changeType="increase"
          icon={FolderOpen}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Tasks In Progress"
          value={stats.activeTasks}
          change={`${stats.completedTasks} completed`}
          changeType="neutral"
          icon={CheckSquare}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Hours Tracked"
          value={Math.round(stats.totalTimeSpent / 60)}
          change="+12% from last week"
          changeType="increase"
          icon={Clock}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatsCard
          title="Avg. Progress"
          value={`${stats.avgProgress}%`}
          change={stats.overdueItems > 0 ? `${stats.overdueItems} overdue` : 'On track'}
          changeType={stats.overdueItems > 0 ? 'decrease' : 'increase'}
          icon={TrendingUp}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
            <div className="space-y-4">
              {recentProjects.map(project => (
                <div key={project.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{project.title}</h4>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                    <div className="text-xs text-gray-500">{project.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map(task => {
                const isOverdue = new Date(task.deadline!) < new Date();
                return (
                  <div key={task.id} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      {isOverdue ? (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                        {new Date(task.deadline!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}