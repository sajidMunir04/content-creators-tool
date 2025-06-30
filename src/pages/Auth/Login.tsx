import React from 'react';
import { Target, Mail, Lock, Sparkles, CheckCircle, BarChart3 } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-3">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">CreatorFlow Demo</h2>
          <p className="mt-2 text-gray-600">Experience the full platform with sample data</p>
        </div>

        {/* Demo Credentials Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900">Demo Account Credentials</h3>
              <p className="text-sm text-blue-700">Use these credentials to access the demo</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-blue-200 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <code className="text-sm font-mono text-gray-900">demo@creatorflow.com</code>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                      <code className="text-sm font-mono text-gray-900">demo123456</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-100 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">What's Included in the Demo:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>5 Sample Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span>14 Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>7 Milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span>Time Tracking</span>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-700 mb-2">
                ✨ <strong>Realistic Content Creation Projects:</strong>
              </p>
              <p className="text-xs text-blue-600">
                YouTube series, blog posts, podcasts, social media campaigns, and online courses
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Use these exact credentials on the main login page to access the full CreatorFlow demo experience with all features and sample data.
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-center">Platform Features</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Project Management</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Task Tracking & Kanban</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Time Tracking</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Analytics & Reports</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Script Generator</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Goals & Milestones</span>
              <span className="text-green-600 font-medium">✓ Full Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}