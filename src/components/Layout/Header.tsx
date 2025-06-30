import React, { useState } from 'react';
import { Bell, Search, User, Plus, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onCreateProject?: () => void;
}

export default function Header({ onCreateProject }: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    } else {
      navigate('/projects/new');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const showCreateButton = location.pathname === '/projects' || location.pathname === '/';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="lg:pl-64">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 ml-3" />
            <input
              className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-gray-50 rounded-lg"
              placeholder="Search projects, tasks, or content..."
              type="search"
            />
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {showCreateButton && (
              <button
                onClick={handleCreateProject}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            )}
            
            <button className="relative rounded-full bg-gray-50 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full bg-gray-50 p-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {profile?.full_name ? getInitials(profile.full_name) : <User className="h-4 w-4" />}
                  </div>
                )}
                <span className="hidden lg:block">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/settings');
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}