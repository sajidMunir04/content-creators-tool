import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Key, 
  Database, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Plus,
  Settings as SettingsIcon,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NotificationSettings {
  email: {
    projectDeadlines: boolean;
    taskAssignments: boolean;
    teamUpdates: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
  };
  push: {
    projectDeadlines: boolean;
    taskAssignments: boolean;
    teamUpdates: boolean;
    realTimeUpdates: boolean;
  };
  inApp: {
    projectDeadlines: boolean;
    taskAssignments: boolean;
    teamUpdates: boolean;
    soundEffects: boolean;
  };
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  compactMode: boolean;
  animations: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  activityTracking: boolean;
  analyticsSharing: boolean;
  dataCollection: boolean;
  thirdPartyIntegrations: boolean;
}

export default function Settings() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'privacy' | 'security' | 'data' | 'billing'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    timezone: profile?.timezone || 'UTC',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      projectDeadlines: true,
      taskAssignments: true,
      teamUpdates: false,
      weeklyDigest: true,
      marketingEmails: false
    },
    push: {
      projectDeadlines: true,
      taskAssignments: true,
      teamUpdates: false,
      realTimeUpdates: true
    },
    inApp: {
      projectDeadlines: true,
      taskAssignments: true,
      teamUpdates: true,
      soundEffects: true
    }
  });

  // Appearance settings
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'light',
    colorScheme: 'purple',
    compactMode: false,
    animations: true,
    fontSize: 'medium'
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team',
    activityTracking: true,
    analyticsSharing: false,
    dataCollection: true,
    thirdPartyIntegrations: true
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedAppearance = localStorage.getItem('appearance');
    const savedPrivacy = localStorage.getItem('privacy');

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedAppearance) {
      setAppearance(JSON.parse(savedAppearance));
    }
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: profileData.fullName,
        timezone: profileData.timezone
      });

      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Profile updated successfully');
      }
    } catch (error) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would call Supabase's updateUser method
      showMessage('success', 'Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
    } catch (error) {
      showMessage('error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    const updated = {
      ...notifications,
      [category]: {
        ...notifications[category],
        [setting]: value
      }
    };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    showMessage('success', 'Notification preferences updated');
  };

  const handleAppearanceUpdate = (setting: keyof AppearanceSettings, value: any) => {
    const updated = { ...appearance, [setting]: value };
    setAppearance(updated);
    localStorage.setItem('appearance', JSON.stringify(updated));
    showMessage('success', 'Appearance settings updated');
  };

  const handlePrivacyUpdate = (setting: keyof PrivacySettings, value: any) => {
    const updated = { ...privacy, [setting]: value };
    setPrivacy(updated);
    localStorage.setItem('privacy', JSON.stringify(updated));
    showMessage('success', 'Privacy settings updated');
  };

  const handleExportData = () => {
    // In a real app, this would trigger a data export
    showMessage('success', 'Data export initiated. You will receive an email when ready.');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // In a real app, this would delete the user account
      await signOut();
      navigate('/auth/login');
    } catch (error) {
      showMessage('error', 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'billing', label: 'Billing', icon: Zap }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and application settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/help')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                        {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : <User className="h-8 w-8" />}
                      </div>
                      <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Photo</h3>
                      <p className="text-sm text-gray-500">Upload a photo to personalize your account</p>
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          value={profileData.timezone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="text"
                          value={profileData.twitter}
                          onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="@username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                          placeholder="github.com/username"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notifications.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {key === 'projectDeadlines' && 'Get notified when project deadlines are approaching'}
                              {key === 'taskAssignments' && 'Receive emails when tasks are assigned to you'}
                              {key === 'teamUpdates' && 'Stay updated on team activity and changes'}
                              {key === 'weeklyDigest' && 'Weekly summary of your projects and tasks'}
                              {key === 'marketingEmails' && 'Product updates and promotional content'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleNotificationUpdate('email', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notifications.push).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {key === 'projectDeadlines' && 'Push notifications for approaching deadlines'}
                              {key === 'taskAssignments' && 'Instant notifications for new task assignments'}
                              {key === 'teamUpdates' && 'Real-time team collaboration updates'}
                              {key === 'realTimeUpdates' && 'Live updates for project changes'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleNotificationUpdate('push', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In-App Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      In-App Notifications
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(notifications.inApp).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {key === 'projectDeadlines' && 'Show deadline alerts within the app'}
                              {key === 'taskAssignments' && 'Display task assignment notifications'}
                              {key === 'teamUpdates' && 'Show team activity in notification center'}
                              {key === 'soundEffects' && 'Play sounds for important notifications'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleNotificationUpdate('inApp', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance & Display</h2>
                
                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => handleAppearanceUpdate('theme', value)}
                          className={`p-4 border-2 rounded-lg transition-colors duration-200 ${
                            appearance.theme === value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                          <p className="font-medium text-gray-900">{label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Color Scheme</h3>
                    <div className="grid grid-cols-5 gap-4">
                      {[
                        { value: 'purple', color: 'bg-purple-500' },
                        { value: 'blue', color: 'bg-blue-500' },
                        { value: 'green', color: 'bg-green-500' },
                        { value: 'orange', color: 'bg-orange-500' },
                        { value: 'red', color: 'bg-red-500' }
                      ].map(({ value, color }) => (
                        <button
                          key={value}
                          onClick={() => handleAppearanceUpdate('colorScheme', value)}
                          className={`relative p-4 border-2 rounded-lg transition-colors duration-200 ${
                            appearance.colorScheme === value
                              ? 'border-gray-400'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 ${color} rounded-full mx-auto`} />
                          {appearance.colorScheme === value && (
                            <CheckCircle2 className="absolute top-1 right-1 h-4 w-4 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Display Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Compact Mode</p>
                          <p className="text-sm text-gray-500">Reduce spacing and padding for more content</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearance.compactMode}
                            onChange={(e) => handleAppearanceUpdate('compactMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Animations</p>
                          <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearance.animations}
                            onChange={(e) => handleAppearanceUpdate('animations', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Font Size
                        </label>
                        <select
                          value={appearance.fontSize}
                          onChange={(e) => handleAppearanceUpdate('fontSize', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Data</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                        { value: 'team', label: 'Team Only', description: 'Only team members can see your profile' },
                        { value: 'private', label: 'Private', description: 'Only you can see your profile' }
                      ].map(({ value, label, description }) => (
                        <label key={value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={value}
                            checked={privacy.profileVisibility === value}
                            onChange={(e) => handlePrivacyUpdate('profileVisibility', e.target.value)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Collection</h3>
                    <div className="space-y-4">
                      {Object.entries(privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {key === 'activityTracking' && 'Track your usage patterns to improve the app'}
                              {key === 'analyticsSharing' && 'Share anonymized analytics data'}
                              {key === 'dataCollection' && 'Collect data to personalize your experience'}
                              {key === 'thirdPartyIntegrations' && 'Allow third-party service integrations'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value as boolean}
                              onChange={(e) => handlePrivacyUpdate(key as keyof PrivacySettings, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-8">
                  {/* Password */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Change Password</p>
                          <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                        </div>
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">2FA Status</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Monitor className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-500">Chrome on macOS • San Francisco, CA</p>
                          </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Tab */}
            {activeTab === 'data' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Storage</h2>
                
                <div className="space-y-8">
                  {/* Storage Usage */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Usage</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Projects & Tasks</span>
                        <span className="font-medium">2.3 MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time Tracking Data</span>
                        <span className="font-medium">1.1 MB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Uploaded Files</span>
                        <span className="font-medium">0 MB</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">Total Used</span>
                          <span className="font-bold">3.4 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Export Your Data</p>
                          <p className="text-sm text-gray-500">Download a copy of all your data</p>
                        </div>
                        <button
                          onClick={handleExportData}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          <Download className="h-4 w-4" />
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data Deletion */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Deletion</h3>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                        </div>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                
                <div className="space-y-8">
                  {/* Current Plan */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">Free Plan</h4>
                          <p className="text-gray-600">Perfect for getting started</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">$0</p>
                          <p className="text-gray-500">per month</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">Up to 5 projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">Basic time tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">Email support</span>
                        </div>
                      </div>
                      <button className="w-full mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                        Upgrade Plan
                      </button>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                    <div className="text-center py-8 text-gray-500">
                      <p>No billing history available</p>
                      <p className="text-sm">You're currently on the free plan</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowPasswordChange(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including projects, tasks, and time tracking records.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}