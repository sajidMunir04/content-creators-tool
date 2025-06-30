import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  Zap,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTimeSpent, formatDate, getPriorityColor, getStatusColor, getCategoryColor } from '../utils/helpers';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear,
  endOfYear,
  subDays, 
  subWeeks, 
  subMonths,
  isWithinInterval,
  parseISO,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval
} from 'date-fns';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export default function Analytics() {
  const { projects, tasks } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'productivity' | 'trends'>('overview');

  // Get time entries from localStorage
  const timeEntries = useMemo(() => {
    const saved = localStorage.getItem('time-entries');
    return saved ? JSON.parse(saved) : [];
  }, []);

  // Calculate date ranges
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now), previous: { start: startOfWeek(subWeeks(now, 1)), end: endOfWeek(subWeeks(now, 1)) } };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now), previous: { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) } };
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        const prevQuarterStart = new Date(quarterStart.getFullYear(), quarterStart.getMonth() - 3, 1);
        const prevQuarterEnd = new Date(prevQuarterStart.getFullYear(), prevQuarterStart.getMonth() + 3, 0);
        return { start: quarterStart, end: quarterEnd, previous: { start: prevQuarterStart, end: prevQuarterEnd } };
      case 'year':
        return { start: startOfYear(now), end: endOfYear(now), previous: { start: startOfYear(subMonths(now, 12)), end: endOfYear(subMonths(now, 12)) } };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now), previous: { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) } };
    }
  };

  const { start, end, previous } = getDateRange();

  // Filter data by date range and project
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const projectDate = parseISO(project.createdAt);
      return isWithinInterval(projectDate, { start, end });
    });

    if (selectedProject !== 'all') {
      filtered = filtered.filter(p => p.id === selectedProject);
    }

    return filtered;
  }, [projects, start, end, selectedProject]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      const taskDate = parseISO(task.createdAt);
      return isWithinInterval(taskDate, { start, end });
    });

    if (selectedProject !== 'all') {
      filtered = filtered.filter(t => t.projectId === selectedProject);
    }

    return filtered;
  }, [tasks, start, end, selectedProject]);

  const filteredTimeEntries = useMemo(() => {
    let filtered = timeEntries.filter((entry: any) => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start, end });
    });

    if (selectedProject !== 'all') {
      filtered = filtered.filter((entry: any) => entry.projectId === selectedProject);
    }

    return filtered;
  }, [timeEntries, start, end, selectedProject]);

  // Calculate previous period data for comparison
  const previousProjects = projects.filter(project => {
    const projectDate = parseISO(project.createdAt);
    return isWithinInterval(projectDate, { start: previous.start, end: previous.end });
  });

  const previousTasks = tasks.filter(task => {
    const taskDate = parseISO(task.createdAt);
    return isWithinInterval(taskDate, { start: previous.start, end: previous.end });
  });

  const previousTimeEntries = timeEntries.filter((entry: any) => {
    const entryDate = parseISO(entry.date);
    return isWithinInterval(entryDate, { start: previous.start, end: previous.end });
  });

  // Calculate metrics
  const calculateChange = (current: number, previous: number): { change: number; type: 'increase' | 'decrease' | 'neutral' } => {
    if (previous === 0) return { change: current > 0 ? 100 : 0, type: current > 0 ? 'increase' : 'neutral' };
    const change = ((current - previous) / previous) * 100;
    return {
      change: Math.abs(change),
      type: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral'
    };
  };

  const metrics: AnalyticsMetric[] = [
    {
      label: 'Total Projects',
      value: filteredProjects.length,
      ...calculateChange(filteredProjects.length, previousProjects.length),
      icon: Target,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      label: 'Completed Tasks',
      value: filteredTasks.filter(t => t.status === 'Done').length,
      ...calculateChange(
        filteredTasks.filter(t => t.status === 'Done').length,
        previousTasks.filter(t => t.status === 'Done').length
      ),
      icon: CheckCircle2,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      label: 'Hours Tracked',
      value: Math.round(filteredTimeEntries.reduce((acc: number, entry: any) => acc + entry.duration, 0) / 60),
      ...calculateChange(
        filteredTimeEntries.reduce((acc: number, entry: any) => acc + entry.duration, 0),
        previousTimeEntries.reduce((acc: number, entry: any) => acc + entry.duration, 0)
      ),
      icon: Clock,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    {
      label: 'Avg. Completion Rate',
      value: `${filteredProjects.length > 0 ? Math.round(filteredProjects.reduce((acc, p) => acc + p.progress, 0) / filteredProjects.length) : 0}%`,
      ...calculateChange(
        filteredProjects.length > 0 ? filteredProjects.reduce((acc, p) => acc + p.progress, 0) / filteredProjects.length : 0,
        previousProjects.length > 0 ? previousProjects.reduce((acc, p) => acc + p.progress, 0) / previousProjects.length : 0
      ),
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  // Project performance data
  const projectPerformance = filteredProjects.map(project => {
    const projectTasks = filteredTasks.filter(t => t.projectId === project.id);
    const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
    const totalTime = filteredTimeEntries
      .filter((entry: any) => entry.projectId === project.id)
      .reduce((acc: number, entry: any) => acc + entry.duration, 0);
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedTasks,
      completionRate: projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0,
      timeSpent: totalTime,
      isOverdue: new Date(project.deadline) < new Date() && project.status !== 'Complete'
    };
  });

  // Category distribution
  const categoryData: ChartData[] = [
    { label: 'YouTube', value: filteredProjects.filter(p => p.category === 'YouTube').length, color: '#EF4444' },
    { label: 'Blog', value: filteredProjects.filter(p => p.category === 'Blog').length, color: '#3B82F6' },
    { label: 'Podcast', value: filteredProjects.filter(p => p.category === 'Podcast').length, color: '#10B981' },
    { label: 'Social Media', value: filteredProjects.filter(p => p.category === 'Social Media').length, color: '#8B5CF6' },
    { label: 'Other', value: filteredProjects.filter(p => p.category === 'Other').length, color: '#6B7280' }
  ].filter(item => item.value > 0);

  // Time distribution by project
  const timeDistribution: ChartData[] = filteredProjects.map(project => {
    const totalTime = filteredTimeEntries
      .filter((entry: any) => entry.projectId === project.id)
      .reduce((acc: number, entry: any) => acc + entry.duration, 0);
    
    return {
      label: project.title,
      value: totalTime,
      color: project.color
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 5);

  // Productivity trends
  const getProductivityTrend = () => {
    const days = eachDayOfInterval({ start, end });
    return days.map(day => {
      const dayEntries = filteredTimeEntries.filter((entry: any) => 
        format(parseISO(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      const totalTime = dayEntries.reduce((acc: number, entry: any) => acc + entry.duration, 0);
      const tasksCompleted = filteredTasks.filter(task => 
        task.status === 'Done' && 
        format(parseISO(task.updatedAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      ).length;
      
      return {
        date: format(day, 'MMM d'),
        timeSpent: totalTime,
        tasksCompleted
      };
    });
  };

  const productivityTrend = getProductivityTrend();

  const renderChangeIndicator = (change: number, type: 'increase' | 'decrease' | 'neutral') => {
    const Icon = type === 'increase' ? ArrowUp : type === 'decrease' ? ArrowDown : Minus;
    const colorClass = type === 'increase' ? 'text-green-600' : type === 'decrease' ? 'text-red-600' : 'text-gray-500';
    
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${colorClass}`}>
        <Icon className="h-3 w-3" />
        <span>{change.toFixed(1)}%</span>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'productivity', label: 'Productivity', icon: Activity },
    { id: 'trends', label: 'Trends', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Insights into your productivity and project performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.title}</option>
            ))}
          </select>

          <div className="text-sm text-gray-500">
            {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center justify-center p-3 rounded-lg ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              {renderChangeIndicator(metric.change, metric.changeType)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Categories</h3>
              <div className="space-y-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: item.color,
                            width: `${(item.value / Math.max(...categoryData.map(d => d.value))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
                {categoryData.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No projects in selected period</p>
                )}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Time by Project</h3>
              <div className="space-y-4">
                {timeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-700 truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            backgroundColor: item.color,
                            width: `${(item.value / Math.max(...timeDistribution.map(d => d.value))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {formatTimeSpent(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
                {timeDistribution.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No time tracked in selected period</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectPerformance.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {project.completedTasks}/{project.taskCount}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.completionRate}% complete
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimeSpent(project.timeSpent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${project.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {formatDate(project.deadline)}
                        </div>
                        {project.isOverdue && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projectPerformance.length === 0 && (
                <div className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500">No projects match your current filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'productivity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Productivity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Productivity</h3>
              <div className="space-y-4">
                {productivityTrend.slice(-7).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{day.date}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">{formatTimeSpent(day.timeSpent)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{day.tasksCompleted} tasks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Productivity Insights */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Insights</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Most Productive Day</h4>
                    <p className="text-sm text-gray-600">
                      {productivityTrend.length > 0 
                        ? productivityTrend.reduce((max, day) => day.timeSpent > max.timeSpent ? day : max).date
                        : 'No data available'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Average Daily Time</h4>
                    <p className="text-sm text-gray-600">
                      {formatTimeSpent(
                        productivityTrend.length > 0 
                          ? Math.round(productivityTrend.reduce((acc, day) => acc + day.timeSpent, 0) / productivityTrend.length)
                          : 0
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Task Completion Rate</h4>
                    <p className="text-sm text-gray-600">
                      {filteredTasks.length > 0 
                        ? Math.round((filteredTasks.filter(t => t.status === 'Done').length / filteredTasks.length) * 100)
                        : 0
                      }% of tasks completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* Time Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Tracking Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {productivityTrend.map((day, index) => {
                  const maxTime = Math.max(...productivityTrend.map(d => d.timeSpent));
                  const height = maxTime > 0 ? (day.timeSpent / maxTime) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative group">
                        <div 
                          className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm transition-all duration-300 hover:from-purple-600 hover:to-blue-600 min-h-[4px] w-full"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {formatTimeSpent(day.timeSpent)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Completion Trend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Completion Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {productivityTrend.map((day, index) => {
                  const maxTasks = Math.max(...productivityTrend.map(d => d.tasksCompleted));
                  const height = maxTasks > 0 ? (day.tasksCompleted / maxTasks) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1">
                      <div className="relative group">
                        <div 
                          className="bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-sm transition-all duration-300 hover:from-green-600 hover:to-emerald-600 min-h-[4px] w-full"
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {day.tasksCompleted} tasks
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}