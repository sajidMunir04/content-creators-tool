import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Target, AlertCircle, Sparkles, Play, CheckCircle, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const from = location.state?.from?.pathname || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      }
      // Navigation will be handled by the useEffect above
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const createDemoData = async (userId: string) => {
    try {
      // Insert sample projects
      const { error: projectsError } = await supabase
        .from('projects')
        .insert([
          {
            id: 'proj_001',
            user_id: userId,
            title: 'YouTube Series: Web Development Fundamentals',
            description: 'A comprehensive 12-part series covering HTML, CSS, JavaScript, and modern web development practices.',
            category: 'YouTube',
            deadline: '2025-03-15',
            priority: 'High',
            status: 'In Progress',
            color: '#EF4444',
            tags: ['tutorial', 'beginner', 'web-dev'],
            progress: 45
          },
          {
            id: 'proj_002',
            user_id: userId,
            title: 'Blog Series: React Best Practices 2025',
            description: 'In-depth blog series covering React 18+ features and modern development patterns.',
            category: 'Blog',
            deadline: '2025-02-28',
            priority: 'High',
            status: 'Review',
            color: '#3B82F6',
            tags: ['react', 'javascript', 'best-practices'],
            progress: 75
          },
          {
            id: 'proj_003',
            user_id: userId,
            title: 'Podcast: Tech Career Conversations',
            description: 'Monthly podcast featuring interviews with senior developers and tech entrepreneurs.',
            category: 'Podcast',
            deadline: '2025-04-01',
            priority: 'Medium',
            status: 'Planning',
            color: '#10B981',
            tags: ['podcast', 'career', 'interviews'],
            progress: 20
          }
        ]);

      if (projectsError) throw projectsError;

      // Insert sample tasks
      const { error: tasksError } = await supabase
        .from('tasks')
        .insert([
          {
            id: 'task_001',
            user_id: userId,
            project_id: 'proj_001',
            title: 'Write script for Episode 1: HTML Basics',
            description: 'Create detailed script covering HTML5 semantic elements and accessibility.',
            priority: 'High',
            status: 'Done',
            deadline: '2025-01-25',
            tags: ['script', 'html'],
            time_spent: 180
          },
          {
            id: 'task_002',
            user_id: userId,
            project_id: 'proj_001',
            title: 'Record Episode 1: HTML Basics',
            description: 'Film the HTML basics tutorial with screen recording and webcam.',
            priority: 'High',
            status: 'In Progress',
            deadline: '2025-01-28',
            tags: ['recording', 'video'],
            time_spent: 45
          },
          {
            id: 'task_003',
            user_id: userId,
            project_id: 'proj_002',
            title: 'Write React Performance Article',
            description: 'Comprehensive guide covering memo, useMemo, and useCallback.',
            priority: 'High',
            status: 'Review',
            deadline: '2025-01-25',
            tags: ['writing', 'performance'],
            time_spent: 320
          }
        ]);

      if (tasksError) throw tasksError;

      // Insert sample milestones
      const { error: milestonesError } = await supabase
        .from('milestones')
        .insert([
          {
            id: 'milestone_001',
            user_id: userId,
            project_id: 'proj_001',
            title: 'Pre-production Complete',
            description: 'All scripts for first 6 episodes written and reviewed',
            deadline: '2025-02-15',
            status: 'In Progress',
            progress: 60,
            order: 1
          },
          {
            id: 'milestone_002',
            user_id: userId,
            project_id: 'proj_002',
            title: 'Research Phase Complete',
            description: 'All technical research and examples prepared',
            deadline: '2025-01-25',
            status: 'Complete',
            progress: 100,
            order: 1
          }
        ]);

      if (milestonesError) throw milestonesError;

      console.log('Demo data created successfully');
    } catch (error) {
      console.error('Error creating demo data:', error);
      // Don't throw here - user can still use the app without demo data
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsCreatingDemo(true);
    setIsSubmitting(true);
    
    try {
      const demoEmail = 'demo@creatorflow.com';
      const demoPassword = 'demo123456';
      
      // First, try to sign in with existing demo user
      const { error: signInError } = await signIn(demoEmail, demoPassword);
      
      if (signInError) {
        // If sign in fails, create the demo user
        console.log('Demo user not found, creating new demo user...');
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: {
              full_name: 'Demo Creator',
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (signUpData.user) {
          // Create demo data for the new user
          await createDemoData(signUpData.user.id);
          
          // If email confirmation is required, show message
          if (!signUpData.session) {
            setError('Demo account created! Please check your email to verify your account, or contact support for immediate access.');
            return;
          }
        }
      }
      
      // Navigation will be handled by the useEffect above
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(`Demo login failed: ${err.message || 'Please try again or use manual credentials.'}`);
    } finally {
      setIsCreatingDemo(false);
      setIsSubmitting(false);
    }
  };

  // Don't render if user is already logged in
  if (user && !loading) {
    return null;
  }

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
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your CreatorFlow account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link
                to="/auth/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting && !isCreatingDemo ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="font-medium text-purple-600 hover:text-purple-700"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Account Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Try the Demo</h3>
              <p className="text-sm text-blue-700">Experience CreatorFlow with sample data</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-blue-700">
              Explore all features with pre-loaded projects, tasks, and milestones. 
              Perfect for testing the platform before creating your own account.
            </p>
            
            <button
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && isCreatingDemo ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating demo account...
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Launch Demo Experience
                </>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-blue-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                <span>3 Sample Projects</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-green-500" />
                <span>3 Tasks</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span>2 Milestones</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3 text-orange-500" />
                <span>Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}