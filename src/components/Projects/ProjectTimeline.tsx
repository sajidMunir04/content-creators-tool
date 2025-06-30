import React from 'react';
import { Calendar, CheckCircle2, Circle, Clock, Flag, Target, AlertTriangle } from 'lucide-react';
import { Project, Task, Milestone } from '../../types';
import { formatDate, isOverdue, getStatusColor, getPriorityColor } from '../../utils/helpers';
import { format, parseISO, differenceInDays, addDays, startOfDay, endOfDay } from 'date-fns';

interface ProjectTimelineProps {
  project: Project;
  tasks: Task[];
  milestones: Milestone[];
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'project_start' | 'project_end' | 'milestone' | 'task' | 'deadline';
  status: string;
  priority?: string;
  progress?: number;
  isOverdue?: boolean;
}

export default function ProjectTimeline({ project, tasks, milestones }: ProjectTimelineProps) {
  // Create timeline events
  const createTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Project start
    events.push({
      id: `project-start-${project.id}`,
      title: 'Project Started',
      description: project.title,
      date: project.createdAt,
      type: 'project_start',
      status: 'Complete',
    });

    // Project deadline
    events.push({
      id: `project-end-${project.id}`,
      title: 'Project Deadline',
      description: `${project.title} due`,
      date: project.deadline,
      type: 'project_end',
      status: project.status,
      isOverdue: isOverdue(project.deadline),
    });

    // Milestones
    milestones.forEach(milestone => {
      events.push({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        date: milestone.deadline,
        type: 'milestone',
        status: milestone.status,
        progress: milestone.progress,
        isOverdue: isOverdue(milestone.deadline),
      });
    });

    // Tasks with deadlines
    tasks.filter(task => task.deadline).forEach(task => {
      events.push({
        id: task.id,
        title: task.title,
        description: task.description,
        date: task.deadline!,
        type: 'task',
        status: task.status,
        priority: task.priority,
        isOverdue: task.deadline ? isOverdue(task.deadline) : false,
      });
    });

    // Sort by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const timelineEvents = createTimelineEvents();
  const projectStartDate = new Date(project.createdAt);
  const projectEndDate = new Date(project.deadline);
  const totalDays = differenceInDays(projectEndDate, projectStartDate);
  const today = new Date();
  const daysElapsed = Math.max(0, differenceInDays(today, projectStartDate));
  const timeProgress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case 'project_start':
        return <Flag className="h-4 w-4 text-green-600" />;
      case 'project_end':
        return <Flag className="h-4 w-4 text-red-600" />;
      case 'milestone':
        return <Target className="h-4 w-4 text-purple-600" />;
      case 'task':
        return event.status === 'Done' ? 
          <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
          <Circle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.isOverdue && event.status !== 'Done' && event.status !== 'Complete') {
      return 'border-red-200 bg-red-50';
    }
    
    switch (event.type) {
      case 'project_start':
        return 'border-green-200 bg-green-50';
      case 'project_end':
        return 'border-red-200 bg-red-50';
      case 'milestone':
        return 'border-purple-200 bg-purple-50';
      case 'task':
        return event.status === 'Done' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPositionOnTimeline = (date: string) => {
    const eventDate = new Date(date);
    const daysSinceStart = differenceInDays(eventDate, projectStartDate);
    return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100));
  };

  return (
    <div className="space-y-8">
      {/* Timeline Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
            <p className="text-sm text-gray-600">
              {format(projectStartDate, 'MMM d, yyyy')} - {format(projectEndDate, 'MMM d, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{Math.round(timeProgress)}%</div>
            <div className="text-sm text-gray-600">Time Elapsed</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-white rounded-full h-4 border border-gray-200">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative"
              style={{ width: `${timeProgress}%` }}
            >
              <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full border-2 border-purple-500 transform translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Start</span>
            <span>Today</span>
            <span>Deadline</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Timeline Events</h4>
        
        {/* Timeline Visualization */}
        <div className="relative mb-8">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-gray-200" />
          <div 
            className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ width: `${timeProgress}%` }}
          />
          
          {/* Timeline Events on Visual Line */}
          {timelineEvents.map((event, index) => {
            const position = getPositionOnTimeline(event.date);
            const isPast = new Date(event.date) < today;
            
            return (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${position}%`, top: index % 2 === 0 ? '-20px' : '40px' }}
              >
                <div className={`w-3 h-3 rounded-full border-2 ${
                  isPast ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'
                } ${index % 2 === 0 ? 'mb-2' : 'mt-2'}`} />
                <div className={`w-48 p-2 rounded-lg border text-xs ${getEventColor(event)} ${
                  index % 2 === 0 ? 'mb-2' : 'mt-2'
                }`}>
                  <div className="font-medium text-gray-900 truncate">{event.title}</div>
                  <div className="text-gray-600">{format(new Date(event.date), 'MMM d')}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Timeline List */}
        <div className="space-y-4 mt-16">
          <h5 className="font-medium text-gray-900">Detailed Timeline</h5>
          <div className="space-y-3">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {index !== timelineEvents.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
                )}
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    new Date(event.date) < today ? 'bg-purple-100 border-purple-300' : 'bg-gray-50 border-gray-200'
                  }`}>
                    {getEventIcon(event)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h6 className="font-medium text-gray-900">{event.title}</h6>
                      {event.isOverdue && event.status !== 'Done' && event.status !== 'Complete' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">
                        {format(new Date(event.date), 'MMM d, yyyy')}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                      {event.priority && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${getPriorityColor(event.priority)}`}>
                          {event.priority}
                        </span>
                      )}
                      {event.progress !== undefined && (
                        <span className="text-gray-500">{event.progress}% complete</span>
                      )}
                      {event.isOverdue && event.status !== 'Done' && event.status !== 'Complete' && (
                        <span className="text-red-600 font-medium">Overdue</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    {differenceInDays(new Date(event.date), today) > 0 ? (
                      <span>In {differenceInDays(new Date(event.date), today)} days</span>
                    ) : differenceInDays(new Date(event.date), today) === 0 ? (
                      <span className="text-blue-600 font-medium">Today</span>
                    ) : (
                      <span>{Math.abs(differenceInDays(new Date(event.date), today))} days ago</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Days Remaining</span>
          </div>
          <p className={`text-2xl font-bold ${
            differenceInDays(projectEndDate, today) < 0 ? 'text-red-600' : 
            differenceInDays(projectEndDate, today) < 7 ? 'text-yellow-600' : 'text-gray-900'
          }`}>
            {Math.max(0, differenceInDays(projectEndDate, today))}
          </p>
          {differenceInDays(projectEndDate, today) < 0 && (
            <p className="text-sm text-red-600 mt-1">Project overdue</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">Milestones</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {milestones.filter(m => m.status === 'Complete').length}/{milestones.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500">Tasks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {tasks.filter(t => t.status === 'Done').length}/{tasks.length}
          </p>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>
      </div>
    </div>
  );
}