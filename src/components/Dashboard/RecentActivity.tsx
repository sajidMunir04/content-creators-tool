import React from 'react';
import { Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'project_created' | 'deadline_approaching' | 'content_published';
  title: string;
  description: string;
  timestamp: string;
  projectName?: string;
}

const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Script completed',
    description: 'Finished writing script for Episode 1',
    timestamp: '2025-01-20T14:30:00Z',
    projectName: 'YouTube Series: Web Development',
  },
  {
    id: '2',
    type: 'deadline_approaching',
    title: 'Deadline in 2 days',
    description: 'Blog post about React best practices',
    timestamp: '2025-01-20T10:00:00Z',
    projectName: 'Blog Post: React Best Practices',
  },
  {
    id: '3',
    type: 'project_created',
    title: 'New project created',
    description: 'Podcast Episode: Future of AI',
    timestamp: '2025-01-19T16:45:00Z',
  },
  {
    id: '4',
    type: 'content_published',
    title: 'Content published',
    description: 'Tutorial video went live on YouTube',
    timestamp: '2025-01-19T09:00:00Z',
    projectName: 'JavaScript Fundamentals',
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'task_completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'deadline_approaching':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'project_created':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'content_published':
      return <Clock className="h-5 w-5 text-purple-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {sampleActivities.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index !== sampleActivities.length - 1 && (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                )}
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 border-2 border-white">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      {activity.projectName && (
                        <p className="text-xs text-gray-400 mt-1">{activity.projectName}</p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDateTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}