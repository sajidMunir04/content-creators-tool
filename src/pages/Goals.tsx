import React, { useState, useMemo } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Filter,
  Search,
  Flag,
  Clock,
  Award,
  BarChart3,
  AlertTriangle,
  Star,
  X,
  Save
} from 'lucide-react';
import { formatDate, getPriorityColor, getStatusColor } from '../utils/helpers';
import { useStore } from '../store/useStore';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Content' | 'Growth' | 'Revenue' | 'Learning' | 'Personal' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  tags: string[];
  projectIds: string[];
  createdAt: string;
  updatedAt: string;
}

const sampleGoals: Goal[] = [
  {
    id: 'goal_001',
    title: 'Reach 10K YouTube Subscribers',
    description: 'Grow YouTube channel to 10,000 subscribers by creating consistent, high-quality content and engaging with the community.',
    category: 'Growth',
    priority: 'High',
    status: 'In Progress',
    targetValue: 10000,
    currentValue: 3250,
    unit: 'subscribers',
    deadline: '2025-06-30',
    tags: ['youtube', 'growth', 'subscribers'],
    projectIds: ['proj_001'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T10:30:00Z'
  },
  {
    id: 'goal_002',
    title: 'Publish 50 Blog Posts',
    description: 'Write and publish 50 high-quality blog posts covering React, JavaScript, and web development best practices.',
    category: 'Content',
    priority: 'High',
    status: 'In Progress',
    targetValue: 50,
    currentValue: 18,
    unit: 'posts',
    deadline: '2025-12-31',
    tags: ['blog', 'content', 'writing'],
    projectIds: ['proj_002'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-19T15:45:00Z'
  },
  {
    id: 'goal_003',
    title: 'Generate $5K Monthly Revenue',
    description: 'Build sustainable monthly recurring revenue through course sales, sponsorships, and affiliate marketing.',
    category: 'Revenue',
    priority: 'Critical',
    status: 'In Progress',
    targetValue: 5000,
    currentValue: 1200,
    unit: 'USD',
    deadline: '2025-08-31',
    tags: ['revenue', 'monetization', 'business'],
    projectIds: ['proj_005'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-18T09:20:00Z'
  },
  {
    id: 'goal_004',
    title: 'Complete TypeScript Certification',
    description: 'Master advanced TypeScript concepts and obtain official certification to enhance technical credibility.',
    category: 'Learning',
    priority: 'Medium',
    status: 'Not Started',
    targetValue: 1,
    currentValue: 0,
    unit: 'certification',
    deadline: '2025-04-30',
    tags: ['typescript', 'learning', 'certification'],
    projectIds: [],
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'goal_005',
    title: 'Launch Podcast Series',
    description: 'Start and publish 12 episodes of tech career podcast featuring industry experts and thought leaders.',
    category: 'Content',
    priority: 'Medium',
    status: 'In Progress',
    targetValue: 12,
    currentValue: 2,
    unit: 'episodes',
    deadline: '2025-12-31',
    tags: ['podcast', 'content', 'interviews'],
    projectIds: ['proj_003'],
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-18T16:00:00Z'
  },
  {
    id: 'goal_006',
    title: 'Improve Work-Life Balance',
    description: 'Maintain healthy work-life balance by limiting work to 40 hours per week and taking regular breaks.',
    category: 'Personal',
    priority: 'High',
    status: 'In Progress',
    targetValue: 40,
    currentValue: 45,
    unit: 'hours/week',
    deadline: '2025-03-31',
    tags: ['health', 'balance', 'productivity'],
    projectIds: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-20T14:15:00Z'
  }
];

export default function Goals() {
  const { projects } = useStore();
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'Content' as Goal['category'],
    priority: 'Medium' as Goal['priority'],
    status: 'Not Started' as Goal['status'],
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: '',
    tags: [] as string[],
    projectIds: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  // Filter goals
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || goal.category === filterCategory;
      const matchesStatus = filterStatus === 'All' || goal.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || goal.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [goals, searchTerm, filterCategory, filterStatus, filterPriority]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;
    const overdueGoals = goals.filter(g => 
      new Date(g.deadline) < new Date() && g.status !== 'Completed' && g.status !== 'Cancelled'
    ).length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    const avgProgress = goals.length > 0 ? 
      Math.round(goals.reduce((acc, goal) => acc + (goal.currentValue / goal.targetValue * 100), 0) / goals.length) : 0;

    return {
      totalGoals,
      completedGoals,
      inProgressGoals,
      overdueGoals,
      completionRate,
      avgProgress
    };
  }, [goals]);

  const handleCreateGoal = () => {
    if (!newGoal.title.trim() || !newGoal.unit.trim() || newGoal.targetValue <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const goal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      ...newGoal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGoals(prev => [goal, ...prev]);
    resetForm();
    setShowCreateGoal(false);
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !editingGoal.title.trim()) return;

    setGoals(prev => prev.map(goal => 
      goal.id === editingGoal.id 
        ? { ...editingGoal, updatedAt: new Date().toISOString() }
        : goal
    ));
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    }
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      category: 'Content',
      priority: 'Medium',
      status: 'Not Started',
      targetValue: 0,
      currentValue: 0,
      unit: '',
      deadline: '',
      tags: [],
      projectIds: [],
    });
    setTagInput('');
  };

  const addTag = (isEditing = false) => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    if (isEditing && editingGoal) {
      if (!editingGoal.tags.includes(trimmedTag)) {
        setEditingGoal(prev => prev ? { ...prev, tags: [...prev.tags, trimmedTag] } : null);
      }
    } else {
      if (!newGoal.tags.includes(trimmedTag)) {
        setNewGoal(prev => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      }
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string, isEditing = false) => {
    if (isEditing && editingGoal) {
      setEditingGoal(prev => prev ? { ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) } : null);
    } else {
      setNewGoal(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Content': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Growth': return 'text-green-600 bg-green-50 border-green-200';
      case 'Revenue': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Learning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Personal': return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (deadline: string, status: string) => {
    return new Date(deadline) < new Date() && status !== 'Completed' && status !== 'Cancelled';
  };

  const categories = ['All', 'Content', 'Growth', 'Revenue', 'Learning', 'Personal', 'Other'];
  const statuses = ['All', 'Not Started', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-2">Set, track, and achieve your content creation goals</p>
        </div>
        <button
          onClick={() => setShowCreateGoal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Total Goals</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalGoals}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.inProgressGoals} in progress</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedGoals}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.completionRate}% completion rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">Avg Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</p>
          <p className="text-sm text-gray-600 mt-1">Across all goals</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium text-gray-500">Overdue</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.overdueGoals}</p>
          <p className="text-sm text-gray-600 mt-1">Need attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

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
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGoals.map(goal => {
          const progress = Math.min(100, Math.max(0, (goal.currentValue / goal.targetValue) * 100));
          const overdue = isOverdue(goal.deadline, goal.status);
          
          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                    {overdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{goal.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingGoal(goal)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <Edit3 className="h-4 w-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{Math.round(progress)}% complete</span>
                    <span className={overdue ? 'text-red-600 font-medium' : ''}>
                      Due: {formatDate(goal.deadline)}
                    </span>
                  </div>
                </div>

                {goal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {goal.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                    {goal.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{goal.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                {goal.projectIds.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Related Projects:</span>
                    {goal.projectIds.map(projectId => {
                      const project = projects.find(p => p.id === projectId);
                      return project ? (
                        <span key={projectId} className="ml-1">{project.title}</span>
                      ) : null;
                    }).filter(Boolean).slice(0, 2)}
                    {goal.projectIds.length > 2 && <span> +{goal.projectIds.length - 2} more</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterCategory !== 'All' || filterStatus !== 'All' || filterPriority !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by creating your first goal to track your progress'
            }
          </p>
          {!searchTerm && filterCategory === 'All' && filterStatus === 'All' && filterPriority === 'All' && (
            <button
              onClick={() => setShowCreateGoal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </button>
          )}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Goal</h3>
                <button
                  onClick={() => {
                    setShowCreateGoal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your goal title..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Describe your goal and why it's important..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="Content">Content</option>
                    <option value="Growth">Growth</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Learning">Learning</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    placeholder="100"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    placeholder="subscribers, posts, USD, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentValue}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentValue: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Projects
                  </label>
                  <select
                    multiple
                    value={newGoal.projectIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setNewGoal(prev => ({ ...prev, projectIds: selectedOptions }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    size={3}
                  >
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple projects</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Add tags..."
                      />
                      <button
                        type="button"
                        onClick={() => addTag()}
                        disabled={!tagInput.trim()}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {newGoal.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {newGoal.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:bg-purple-200 rounded-full p-1 transition-colors duration-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateGoal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Goal</h3>
                <button
                  onClick={() => setEditingGoal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={editingGoal.title}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingGoal.description}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Value
                  </label>
                  <input
                    type="number"
                    value={editingGoal.currentValue}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, currentValue: parseInt(e.target.value) || 0 } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingGoal.status}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, status: e.target.value as Goal['status'] } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editingGoal.priority}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, priority: e.target.value as Goal['priority'] } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={editingGoal.deadline}
                    onChange={(e) => setEditingGoal(prev => prev ? { ...prev, deadline: e.target.value } : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(true))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Add tags..."
                      />
                      <button
                        type="button"
                        onClick={() => addTag(true)}
                        disabled={!tagInput.trim()}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {editingGoal.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {editingGoal.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag, true)}
                              className="hover:bg-purple-200 rounded-full p-1 transition-colors duration-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditingGoal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGoal}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}