import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  Target,
  Award,
  Settings,
  Edit3,
  Trash2,
  UserPlus,
  Shield,
  Star,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Video,
  FileText,
  Send
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDate, formatTimeSpent, getPriorityColor, getStatusColor } from '../utils/helpers';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Contributor' | 'Viewer';
  avatar?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  lastActive: string;
  skills: string[];
  projects: string[];
  tasksAssigned: number;
  tasksCompleted: number;
  hoursWorked: number;
  phone?: string;
  timezone: string;
  bio?: string;
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Contributor' | 'Viewer';
  invitedBy: string;
  invitedAt: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

interface TeamActivity {
  id: string;
  memberId: string;
  type: 'task_completed' | 'project_joined' | 'comment_added' | 'file_uploaded' | 'meeting_scheduled';
  description: string;
  timestamp: string;
  projectId?: string;
  taskId?: string;
}

const sampleTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Creator',
    email: 'john@example.com',
    role: 'Owner',
    status: 'Active',
    joinDate: '2024-01-01',
    lastActive: '2025-01-20T15:30:00Z',
    skills: ['Video Editing', 'Content Strategy', 'SEO'],
    projects: ['1', '2', '3'],
    tasksAssigned: 15,
    tasksCompleted: 12,
    hoursWorked: 120,
    timezone: 'UTC-8',
    bio: 'Content creator and team lead with 5+ years of experience in digital marketing.'
  },
  {
    id: '2',
    name: 'Sarah Editor',
    email: 'sarah@example.com',
    role: 'Editor',
    status: 'Active',
    joinDate: '2024-02-15',
    lastActive: '2025-01-20T14:45:00Z',
    skills: ['Video Editing', 'Motion Graphics', 'Color Grading'],
    projects: ['1', '3'],
    tasksAssigned: 8,
    tasksCompleted: 7,
    hoursWorked: 85,
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    bio: 'Professional video editor specializing in YouTube content and motion graphics.'
  },
  {
    id: '3',
    name: 'Mike Writer',
    email: 'mike@example.com',
    role: 'Contributor',
    status: 'Active',
    joinDate: '2024-03-10',
    lastActive: '2025-01-20T12:20:00Z',
    skills: ['Copywriting', 'Research', 'SEO'],
    projects: ['2'],
    tasksAssigned: 6,
    tasksCompleted: 5,
    hoursWorked: 45,
    timezone: 'UTC+0',
    bio: 'Content writer with expertise in technical writing and SEO optimization.'
  },
  {
    id: '4',
    name: 'Lisa Designer',
    email: 'lisa@example.com',
    role: 'Contributor',
    status: 'Inactive',
    joinDate: '2024-04-20',
    lastActive: '2025-01-18T09:15:00Z',
    skills: ['Graphic Design', 'Thumbnail Creation', 'Branding'],
    projects: ['1', '2'],
    tasksAssigned: 4,
    tasksCompleted: 3,
    hoursWorked: 32,
    timezone: 'UTC+1',
    bio: 'Graphic designer focused on creating engaging thumbnails and brand assets.'
  }
];

const sampleInvites: TeamInvite[] = [
  {
    id: '1',
    email: 'alex@example.com',
    role: 'Editor',
    invitedBy: 'John Creator',
    invitedAt: '2025-01-18T10:00:00Z',
    status: 'Pending'
  },
  {
    id: '2',
    email: 'emma@example.com',
    role: 'Contributor',
    invitedBy: 'John Creator',
    invitedAt: '2025-01-17T14:30:00Z',
    status: 'Pending'
  }
];

const sampleActivities: TeamActivity[] = [
  {
    id: '1',
    memberId: '2',
    type: 'task_completed',
    description: 'Completed video editing for Episode 1',
    timestamp: '2025-01-20T14:45:00Z',
    projectId: '1',
    taskId: '2'
  },
  {
    id: '2',
    memberId: '3',
    type: 'comment_added',
    description: 'Added feedback on blog post draft',
    timestamp: '2025-01-20T12:20:00Z',
    projectId: '2'
  },
  {
    id: '3',
    memberId: '4',
    type: 'file_uploaded',
    description: 'Uploaded thumbnail designs',
    timestamp: '2025-01-19T16:30:00Z',
    projectId: '1'
  }
];

export default function Team() {
  const { projects, tasks } = useStore();
  const [activeTab, setActiveTab] = useState<'members' | 'invites' | 'activity' | 'settings'>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [invites, setInvites] = useState<TeamInvite[]>(sampleInvites);
  const [activities, setActivities] = useState<TeamActivity[]>(sampleActivities);

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Contributor' as TeamMember['role'],
    message: ''
  });

  // Filter team members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || member.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [teamMembers, searchTerm, roleFilter, statusFilter]);

  // Calculate team stats
  const teamStats = useMemo(() => {
    const activeMembers = teamMembers.filter(m => m.status === 'Active').length;
    const totalTasks = teamMembers.reduce((acc, m) => acc + m.tasksAssigned, 0);
    const completedTasks = teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0);
    const totalHours = teamMembers.reduce((acc, m) => acc + m.hoursWorked, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalMembers: teamMembers.length,
      activeMembers,
      pendingInvites: invites.filter(i => i.status === 'Pending').length,
      completionRate,
      totalHours,
      averageHours: activeMembers > 0 ? Math.round(totalHours / activeMembers) : 0
    };
  }, [teamMembers, invites]);

  const handleInviteMember = () => {
    if (!inviteForm.email) return;

    const newInvite: TeamInvite = {
      id: Math.random().toString(36).substr(2, 9),
      email: inviteForm.email,
      role: inviteForm.role,
      invitedBy: 'John Creator',
      invitedAt: new Date().toISOString(),
      status: 'Pending'
    };

    setInvites(prev => [newInvite, ...prev]);
    setInviteForm({ email: '', role: 'Contributor', message: '' });
    setShowInviteModal(false);
  };

  const handleRemoveInvite = (inviteId: string) => {
    setInvites(prev => prev.filter(i => i.id !== inviteId));
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Admin': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Editor': return 'text-green-600 bg-green-50 border-green-200';
      case 'Contributor': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Viewer': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50 border-green-200';
      case 'Inactive': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'project_joined': return <Target className="h-4 w-4 text-blue-500" />;
      case 'comment_added': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'file_uploaded': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'meeting_scheduled': return <Video className="h-4 w-4 text-indigo-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const tabs = [
    { id: 'members', label: 'Team Members', count: teamMembers.length },
    { id: 'invites', label: 'Invitations', count: invites.length },
    { id: 'activity', label: 'Activity', count: activities.length },
    { id: 'settings', label: 'Settings', count: null }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-2">Manage your team members and collaborate on projects</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Total Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
          <p className="text-sm text-gray-600 mt-1">{teamStats.activeMembers} active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-500">Pending Invites</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{teamStats.pendingInvites}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting response</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-gray-500">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{teamStats.completionRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Team average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-500">Total Hours</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(teamStats.totalHours * 60)}</p>
          <p className="text-sm text-gray-600 mt-1">{formatTimeSpent(teamStats.averageHours * 60)} avg/member</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Roles</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Contributor">Contributor</option>
            <option value="Viewer">Viewer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
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
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedMember(member);
                        setShowMemberModal(true);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </button>
                    {member.role !== 'Owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Tasks</span>
                      <p className="font-medium text-gray-900">{member.tasksCompleted}/{member.tasksAssigned}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Hours</span>
                      <p className="font-medium text-gray-900">{formatTimeSpent(member.hoursWorked * 60)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Completion Rate</span>
                      <span className="font-medium text-gray-900">
                        {member.tasksAssigned > 0 ? Math.round((member.tasksCompleted / member.tasksAssigned) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${member.tasksAssigned > 0 ? (member.tasksCompleted / member.tasksAssigned) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {member.skills.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm text-gray-500">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{member.skills.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  Last active: {formatDate(member.lastActive)}
                </div>
              </div>
            ))}

            {filteredMembers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || roleFilter !== 'All' || statusFilter !== 'All'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start building your team by inviting members'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'invites' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {invites.map((invite) => (
                <div key={invite.id} className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{invite.email}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(invite.role)}`}>
                        {invite.role}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Invited by {invite.invitedBy} on {formatDate(invite.invitedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invite.status)}`}>
                      {invite.status}
                    </span>
                    <button
                      onClick={() => handleRemoveInvite(invite.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
              {invites.length === 0 && (
                <div className="p-12 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                  <p className="text-gray-500 mb-6">All invitations have been responded to</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {activities.map((activity) => {
                const member = teamMembers.find(m => m.id === activity.memberId);
                return (
                  <div key={activity.id} className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{member?.name}</span>
                        <span className="text-sm text-gray-500">{activity.description}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {activities.length === 0 && (
                <div className="p-12 text-center">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-500">Team activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Role for New Members
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Viewer">Viewer</option>
                    <option value="Contributor">Contributor</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700">Require approval for new members</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700">Allow members to invite others</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700">Send weekly team activity digest</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">Permission</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-500">Owner</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-500">Admin</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-500">Editor</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-500">Contributor</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-500">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      'Create Projects',
                      'Edit Projects',
                      'Delete Projects',
                      'Invite Members',
                      'Manage Team',
                      'View Analytics',
                      'Export Data'
                    ].map((permission) => (
                      <tr key={permission}>
                        <td className="py-3 text-sm text-gray-900">{permission}</td>
                        <td className="py-3 text-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        </td>
                        <td className="py-3 text-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        </td>
                        <td className="py-3 text-center">
                          {['Create Projects', 'Edit Projects', 'View Analytics'].includes(permission) ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-200 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {['View Analytics'].includes(permission) ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-200 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <div className="w-4 h-4 rounded-full bg-gray-200 mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Contributor">Contributor</option>
                  <option value="Editor">Editor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                  placeholder="Add a personal message to your invitation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteMember}
                disabled={!inviteForm.email}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Team Member Details</h3>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedMember.name}</h4>
                  <p className="text-gray-600">{selectedMember.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(selectedMember.role)}`}>
                      {selectedMember.role}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status}
                    </span>
                  </div>
                </div>
              </div>

              {selectedMember.bio && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Bio</h5>
                  <p className="text-gray-600">{selectedMember.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Contact Information</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedMember.email}</span>
                    </div>
                    {selectedMember.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{selectedMember.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{selectedMember.timezone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Performance</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasks Completed</span>
                      <span className="font-medium">{selectedMember.tasksCompleted}/{selectedMember.tasksAssigned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours Worked</span>
                      <span className="font-medium">{formatTimeSpent(selectedMember.hoursWorked * 60)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">
                        {selectedMember.tasksAssigned > 0 ? Math.round((selectedMember.tasksCompleted / selectedMember.tasksAssigned) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Projects</h5>
                <div className="space-y-2">
                  {selectedMember.projects.map((projectId) => {
                    const project = projects.find(p => p.id === projectId);
                    return project ? (
                      <div key={projectId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium text-gray-900">{project.title}</span>
                        <span className="text-sm text-gray-500">{project.category}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}