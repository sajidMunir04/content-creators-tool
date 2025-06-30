import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar, 
  BarChart3, 
  Filter, 
  Plus,
  Timer,
  Target,
  TrendingUp,
  Download,
  Edit3,
  Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTimeSpent, formatDate } from '../utils/helpers';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  date: string;
  isRunning: boolean;
}

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedTime: number;
  selectedTaskId: string;
  description: string;
}

export default function TimeTracking() {
  const { projects, tasks } = useStore();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    selectedTaskId: '',
    description: ''
  });
  const [filter, setFilter] = useState({
    period: 'week',
    projectId: 'all',
    taskId: 'all'
  });
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    taskId: '',
    projectId: '',
    description: '',
    duration: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning && timer.startTime) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - prev.startTime!.getTime()) / 1000)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  // Load time entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('time-entries');
    if (saved) {
      setTimeEntries(JSON.parse(saved));
    }
  }, []);

  // Save time entries to localStorage
  useEffect(() => {
    localStorage.setItem('time-entries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  const startTimer = () => {
    if (!timer.selectedTaskId) {
      alert('Please select a task first');
      return;
    }

    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: new Date(),
      elapsedTime: 0
    }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const stopTimer = () => {
    if (timer.startTime && timer.selectedTaskId) {
      const task = tasks.find(t => t.id === timer.selectedTaskId);
      const project = projects.find(p => p.id === task?.projectId);
      
      const newTimeEntry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        taskId: timer.selectedTaskId,
        projectId: task?.projectId || '',
        description: timer.description || task?.title || 'Time tracking',
        startTime: timer.startTime.toISOString(),
        endTime: new Date().toISOString(),
        duration: Math.floor(timer.elapsedTime / 60),
        date: new Date().toISOString().split('T')[0],
        isRunning: false
      };

      setTimeEntries(prev => [newTimeEntry, ...prev]);
    }

    setTimer({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
      selectedTaskId: '',
      description: ''
    });
  };

  const addManualEntry = () => {
    if (!newEntry.taskId || !newEntry.duration) {
      alert('Please fill in all required fields');
      return;
    }

    const task = tasks.find(t => t.id === newEntry.taskId);
    const duration = parseInt(newEntry.duration);

    const entry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: newEntry.taskId,
      projectId: newEntry.projectId || task?.projectId || '',
      description: newEntry.description || task?.title || 'Manual entry',
      startTime: new Date().toISOString(),
      duration: duration,
      date: newEntry.date,
      isRunning: false
    };

    setTimeEntries(prev => [entry, ...prev]);
    setNewEntry({
      taskId: '',
      projectId: '',
      description: '',
      duration: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddEntry(false);
  };

  const deleteEntry = (id: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getFilteredEntries = () => {
    let filtered = timeEntries;

    // Filter by project
    if (filter.projectId !== 'all') {
      filtered = filtered.filter(entry => entry.projectId === filter.projectId);
    }

    // Filter by task
    if (filter.taskId !== 'all') {
      filtered = filtered.filter(entry => entry.taskId === filter.taskId);
    }

    // Filter by period
    const now = new Date();
    let startDate: Date, endDate: Date;

    switch (filter.period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        return filtered;
    }

    return filtered.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: startDate, end: endDate });
    });
  };

  const filteredEntries = getFilteredEntries();
  const totalTime = filteredEntries.reduce((acc, entry) => acc + entry.duration, 0);
  const averagePerDay = filteredEntries.length > 0 ? totalTime / Math.max(1, new Set(filteredEntries.map(e => e.date)).size) : 0;

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map(p => ({ value: p.id, label: p.title }))
  ];

  const taskOptions = [
    { value: 'all', label: 'All Tasks' },
    ...tasks
      .filter(t => filter.projectId === 'all' || t.projectId === filter.projectId)
      .map(t => ({ value: t.id, label: t.title }))
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-gray-600 mt-2">Track time spent on tasks and analyze your productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddEntry(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Timer Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <div className={`text-6xl font-mono font-bold mb-4 ${timer.isRunning ? 'text-green-600' : 'text-gray-900'}`}>
              {formatTimerDisplay(timer.elapsedTime)}
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              {!timer.isRunning ? (
                <button
                  onClick={startTimer}
                  disabled={!timer.selectedTaskId}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Play className="h-5 w-5" />
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </button>
              )}
              <button
                onClick={stopTimer}
                disabled={!timer.startTime}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Square className="h-5 w-5" />
                Stop
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
              <select
                value={timer.selectedTaskId}
                onChange={(e) => setTimer(prev => ({ ...prev, selectedTaskId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a task...</option>
                {tasks.map(task => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <option key={task.id} value={task.id}>
                      {project?.title} - {task.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <input
                type="text"
                value={timer.description}
                onChange={(e) => setTimer(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What are you working on?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(totalTime)}</p>
          <p className="text-sm text-gray-600 mt-1">This {filter.period}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500">Entries</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{filteredEntries.length}</p>
          <p className="text-sm text-gray-600 mt-1">Time entries</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">Daily Average</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(Math.round(averagePerDay))}</p>
          <p className="text-sm text-gray-600 mt-1">Per day</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-500">Projects</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(filteredEntries.map(e => e.projectId)).size}
          </p>
          <p className="text-sm text-gray-600 mt-1">Active projects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <select
            value={filter.period}
            onChange={(e) => setFilter(prev => ({ ...prev, period: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <select
            value={filter.projectId}
            onChange={(e) => setFilter(prev => ({ ...prev, projectId: e.target.value, taskId: 'all' }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {projectOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filter.taskId}
            onChange={(e) => setFilter(prev => ({ ...prev, taskId: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {taskOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEntries.length > 0 ? (
            filteredEntries.map(entry => {
              const task = tasks.find(t => t.id === entry.taskId);
              const project = projects.find(p => p.id === entry.projectId);
              
              return (
                <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project?.color || '#6B7280' }}
                        />
                        <h4 className="font-medium text-gray-900">{entry.description}</h4>
                        <span className="text-sm text-gray-500">
                          {project?.title} • {task?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(entry.date)}</span>
                        {entry.startTime && entry.endTime && (
                          <span>
                            {format(parseISO(entry.startTime), 'HH:mm')} - {format(parseISO(entry.endTime), 'HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatTimeSpent(entry.duration)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded transition-colors duration-200">
                          <Edit3 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <Timer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries found</h3>
              <p className="text-gray-500 mb-6">Start tracking time or adjust your filters to see entries</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Manual Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Time Entry</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task *</label>
                <select
                  value={newEntry.taskId}
                  onChange={(e) => {
                    const task = tasks.find(t => t.id === e.target.value);
                    setNewEntry(prev => ({ 
                      ...prev, 
                      taskId: e.target.value,
                      projectId: task?.projectId || ''
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a task...</option>
                  {tasks.map(task => {
                    const project = projects.find(p => p.id === task.projectId);
                    return (
                      <option key={task.id} value={task.id}>
                        {project?.title} - {task.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What did you work on?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  value={newEntry.duration}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="60"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowAddEntry(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addManualEntry}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}