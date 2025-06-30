/*
  # Complete CreatorFlow Database Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `timezone` (text, default UTC)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (text, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text, nullable)
      - `category` (text)
      - `deadline` (date)
      - `priority` (text)
      - `status` (text)
      - `color` (text)
      - `tags` (text array)
      - `progress` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (text, primary key)
      - `user_id` (uuid, references profiles)
      - `project_id` (text, references projects, nullable)
      - `title` (text)
      - `description` (text, nullable)
      - `priority` (text)
      - `status` (text)
      - `assignee` (text, nullable)
      - `deadline` (date, nullable)
      - `tags` (text array)
      - `time_spent` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `milestones`
      - `id` (text, primary key)
      - `user_id` (uuid, references profiles)
      - `project_id` (text, references projects)
      - `title` (text)
      - `description` (text, nullable)
      - `deadline` (date)
      - `status` (text)
      - `progress` (integer, default 0)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `time_entries`
      - `id` (text, primary key)
      - `user_id` (uuid, references profiles)
      - `task_id` (text, references tasks, nullable)
      - `project_id` (text, references projects, nullable)
      - `description` (text)
      - `duration` (integer, minutes)
      - `date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Authentication Setup
    - Demo user with properly hashed password
    - Email identity for authentication
    - Confirmed email for immediate login

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add trigger for automatic profile creation on user signup
    - Add triggers for automatic timestamp updates

  4. Demo Data
    - 5 realistic content creation projects
    - 14 tasks across different completion stages
    - 7 project milestones
    - 8 time tracking entries
*/

-- Ensure we have the necessary extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE projects (
  id text PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Other',
  deadline date NOT NULL,
  priority text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'Planning',
  color text NOT NULL DEFAULT '#6366F1',
  tags text[] DEFAULT '{}',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id text PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'To Do',
  assignee text,
  deadline date,
  tags text[] DEFAULT '{}',
  time_spent integer DEFAULT 0 CHECK (time_spent >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE milestones (
  id text PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id text REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  deadline date NOT NULL,
  status text NOT NULL DEFAULT 'Not Started',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_entries table
CREATE TABLE time_entries (
  id text PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task_id text REFERENCES tasks(id) ON DELETE CASCADE,
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  description text NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for projects
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for milestones
CREATE POLICY "Users can read own milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON milestones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones"
  ON milestones
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for time_entries
CREATE POLICY "Users can read own time entries"
  ON time_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time entries"
  ON time_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time entries"
  ON time_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time entries"
  ON time_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON time_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_deadline ON projects(deadline);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE INDEX idx_milestones_user_id ON milestones(user_id);
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_deadline ON milestones(deadline);

CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_project_id ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);

-- Create demo user with proper authentication
DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
    demo_email text := 'demo@creatorflow.com';
    demo_password text := 'demo123456';
    hashed_password text;
BEGIN
    RAISE NOTICE 'Setting up demo user authentication...';
    
    -- Generate properly hashed password using bcrypt
    hashed_password := crypt(demo_password, gen_salt('bf', 10));
    
    -- Clean up any existing demo user
    DELETE FROM auth.identities WHERE user_id = demo_user_id;
    DELETE FROM auth.users WHERE id = demo_user_id;
    DELETE FROM profiles WHERE id = demo_user_id;
    
    -- Insert demo user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
    ) VALUES (
        demo_user_id,
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        demo_email,
        hashed_password,
        now(), -- Email confirmed immediately
        now(), -- Set last sign in
        jsonb_build_object(
            'provider', 'email',
            'providers', array['email']
        ),
        jsonb_build_object(
            'full_name', 'Demo Creator',
            'email', demo_email
        ),
        now(),
        now(),
        '', -- Empty confirmation token since email is confirmed
        ''  -- Empty recovery token
    );

    -- Create email identity for authentication
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        demo_user_id,
        demo_user_id,
        jsonb_build_object(
            'sub', demo_user_id::text,
            'email', demo_email,
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        now(),
        now(),
        now()
    );

    RAISE NOTICE 'Demo user authentication created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo user authentication: %', SQLERRM;
        RAISE NOTICE 'Continuing with profile and data setup...';
END $$;

-- Create demo user profile
INSERT INTO profiles (id, email, full_name, timezone, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'demo@creatorflow.com',
    'Demo Creator',
    'UTC',
    '2025-01-01T00:00:00Z',
    now()
);

-- Insert comprehensive demo data
DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    RAISE NOTICE 'Creating demo data...';

    -- Insert sample projects
    INSERT INTO projects (id, user_id, title, description, category, deadline, priority, status, color, tags, progress, created_at, updated_at) VALUES
      (
        'proj_001',
        demo_user_id,
        'YouTube Series: Web Development Fundamentals',
        'A comprehensive 12-part series covering HTML, CSS, JavaScript, and modern web development practices. Target audience: beginners to intermediate developers.',
        'YouTube',
        '2025-03-15',
        'High',
        'In Progress',
        '#EF4444',
        ARRAY['tutorial', 'beginner', 'web-dev', 'javascript', 'html', 'css'],
        45,
        '2025-01-01T00:00:00Z',
        '2025-01-20T10:30:00Z'
      ),
      (
        'proj_002',
        demo_user_id,
        'Blog Series: React Best Practices 2025',
        'In-depth blog series covering React 18+ features, performance optimization, testing strategies, and modern development patterns.',
        'Blog',
        '2025-02-28',
        'High',
        'Review',
        '#3B82F6',
        ARRAY['react', 'javascript', 'best-practices', 'performance', 'testing'],
        75,
        '2025-01-05T00:00:00Z',
        '2025-01-19T15:45:00Z'
      ),
      (
        'proj_003',
        demo_user_id,
        'Podcast: Tech Career Conversations',
        'Monthly podcast featuring interviews with senior developers, CTOs, and tech entrepreneurs about career growth and industry trends.',
        'Podcast',
        '2025-04-01',
        'Medium',
        'Planning',
        '#10B981',
        ARRAY['podcast', 'career', 'interviews', 'tech-industry'],
        20,
        '2025-01-10T00:00:00Z',
        '2025-01-18T09:20:00Z'
      ),
      (
        'proj_004',
        demo_user_id,
        'Social Media: Daily Dev Tips',
        'Daily short-form content for Twitter, LinkedIn, and Instagram sharing quick development tips, code snippets, and industry insights.',
        'Social Media',
        '2025-02-15',
        'Medium',
        'In Progress',
        '#8B5CF6',
        ARRAY['social-media', 'tips', 'daily-content', 'engagement'],
        60,
        '2025-01-12T00:00:00Z',
        '2025-01-20T14:15:00Z'
      ),
      (
        'proj_005',
        demo_user_id,
        'Course: Advanced TypeScript Patterns',
        'Comprehensive online course covering advanced TypeScript concepts, design patterns, and real-world applications.',
        'Other',
        '2025-05-01',
        'Critical',
        'Planning',
        '#F59E0B',
        ARRAY['typescript', 'course', 'advanced', 'patterns', 'education'],
        15,
        '2025-01-15T00:00:00Z',
        '2025-01-20T11:00:00Z'
      );

    -- Insert sample tasks
    INSERT INTO tasks (id, user_id, project_id, title, description, priority, status, assignee, deadline, tags, time_spent, created_at, updated_at) VALUES
      -- YouTube Series Tasks
      (
        'task_001',
        demo_user_id,
        'proj_001',
        'Write script for Episode 1: HTML Basics',
        'Create detailed script covering HTML5 semantic elements, accessibility best practices, and modern HTML structure.',
        'High',
        'Done',
        'John Creator',
        '2025-01-25',
        ARRAY['script', 'html', 'episode-1'],
        180,
        '2025-01-01T00:00:00Z',
        '2025-01-15T16:30:00Z'
      ),
      (
        'task_002',
        demo_user_id,
        'proj_001',
        'Record Episode 1: HTML Basics',
        'Film the HTML basics tutorial with screen recording, webcam, and high-quality audio.',
        'High',
        'In Progress',
        'John Creator',
        '2025-01-28',
        ARRAY['recording', 'video', 'episode-1'],
        45,
        '2025-01-16T00:00:00Z',
        '2025-01-20T10:15:00Z'
      ),
      (
        'task_003',
        demo_user_id,
        'proj_001',
        'Edit Episode 1',
        'Video editing, color correction, audio enhancement, and adding graphics/animations.',
        'Medium',
        'To Do',
        'Sarah Editor',
        '2025-02-02',
        ARRAY['editing', 'post-production', 'episode-1'],
        0,
        '2025-01-16T00:00:00Z',
        '2025-01-16T00:00:00Z'
      ),
      (
        'task_004',
        demo_user_id,
        'proj_001',
        'Create thumbnail for Episode 1',
        'Design eye-catching thumbnail with consistent branding and A/B test variations.',
        'Medium',
        'To Do',
        'Lisa Designer',
        '2025-02-05',
        ARRAY['design', 'thumbnail', 'branding'],
        0,
        '2025-01-16T00:00:00Z',
        '2025-01-16T00:00:00Z'
      ),
      (
        'task_005',
        demo_user_id,
        'proj_001',
        'Write script for Episode 2: CSS Fundamentals',
        'Script covering CSS selectors, box model, flexbox, and grid layout systems.',
        'High',
        'In Progress',
        'John Creator',
        '2025-02-01',
        ARRAY['script', 'css', 'episode-2'],
        90,
        '2025-01-18T00:00:00Z',
        '2025-01-20T14:20:00Z'
      ),
      
      -- Blog Series Tasks
      (
        'task_006',
        demo_user_id,
        'proj_002',
        'Research React 18 Concurrent Features',
        'Deep dive into Suspense, Concurrent Rendering, and Automatic Batching with practical examples.',
        'High',
        'Done',
        'Mike Writer',
        '2025-01-20',
        ARRAY['research', 'react-18', 'concurrent'],
        240,
        '2025-01-05T00:00:00Z',
        '2025-01-18T11:45:00Z'
      ),
      (
        'task_007',
        demo_user_id,
        'proj_002',
        'Write React Performance Optimization Article',
        'Comprehensive guide covering memo, useMemo, useCallback, and profiling techniques.',
        'High',
        'Review',
        'Mike Writer',
        '2025-01-25',
        ARRAY['writing', 'performance', 'optimization'],
        320,
        '2025-01-12T00:00:00Z',
        '2025-01-19T15:30:00Z'
      ),
      (
        'task_008',
        demo_user_id,
        'proj_002',
        'Create code examples for testing article',
        'Build practical examples demonstrating Jest, React Testing Library, and E2E testing.',
        'Medium',
        'In Progress',
        'John Creator',
        '2025-02-01',
        ARRAY['coding', 'testing', 'examples'],
        150,
        '2025-01-15T00:00:00Z',
        '2025-01-20T09:15:00Z'
      ),
      
      -- Podcast Tasks
      (
        'task_009',
        demo_user_id,
        'proj_003',
        'Research and contact potential guests',
        'Identify and reach out to 10 senior developers and tech leaders for interviews.',
        'High',
        'In Progress',
        'John Creator',
        '2025-02-15',
        ARRAY['research', 'outreach', 'guests'],
        120,
        '2025-01-10T00:00:00Z',
        '2025-01-18T16:00:00Z'
      ),
      (
        'task_010',
        demo_user_id,
        'proj_003',
        'Set up podcast recording equipment',
        'Configure microphones, audio interface, and recording software for professional quality.',
        'Medium',
        'To Do',
        'John Creator',
        '2025-02-20',
        ARRAY['equipment', 'setup', 'audio'],
        0,
        '2025-01-10T00:00:00Z',
        '2025-01-10T00:00:00Z'
      ),
      
      -- Social Media Tasks
      (
        'task_011',
        demo_user_id,
        'proj_004',
        'Create content calendar for January',
        'Plan 31 days of dev tips covering JavaScript, React, CSS, and career advice.',
        'High',
        'Done',
        'John Creator',
        '2025-01-15',
        ARRAY['planning', 'calendar', 'content-strategy'],
        180,
        '2025-01-12T00:00:00Z',
        '2025-01-14T10:30:00Z'
      ),
      (
        'task_012',
        demo_user_id,
        'proj_004',
        'Design social media templates',
        'Create consistent visual templates for different types of posts and platforms.',
        'Medium',
        'In Progress',
        'Lisa Designer',
        '2025-01-30',
        ARRAY['design', 'templates', 'branding'],
        90,
        '2025-01-15T00:00:00Z',
        '2025-01-19T14:45:00Z'
      ),
      
      -- Course Tasks
      (
        'task_013',
        demo_user_id,
        'proj_005',
        'Outline TypeScript course curriculum',
        'Structure 20+ lessons covering advanced types, patterns, and real-world applications.',
        'Critical',
        'In Progress',
        'John Creator',
        '2025-02-01',
        ARRAY['curriculum', 'planning', 'typescript'],
        240,
        '2025-01-15T00:00:00Z',
        '2025-01-20T13:20:00Z'
      ),
      (
        'task_014',
        demo_user_id,
        'proj_005',
        'Research competitor courses',
        'Analyze existing TypeScript courses to identify gaps and opportunities.',
        'Medium',
        'To Do',
        'Mike Writer',
        '2025-02-10',
        ARRAY['research', 'competition', 'analysis'],
        0,
        '2025-01-15T00:00:00Z',
        '2025-01-15T00:00:00Z'
      );

    -- Insert sample milestones
    INSERT INTO milestones (id, user_id, project_id, title, description, deadline, status, progress, "order", created_at, updated_at) VALUES
      -- YouTube Series Milestones
      (
        'milestone_001',
        demo_user_id,
        'proj_001',
        'Pre-production Complete',
        'All scripts for first 6 episodes written and reviewed',
        '2025-02-15',
        'In Progress',
        60,
        1,
        '2025-01-01T00:00:00Z',
        '2025-01-20T10:30:00Z'
      ),
      (
        'milestone_002',
        demo_user_id,
        'proj_001',
        'First Half Episodes Recorded',
        'Episodes 1-6 recorded and ready for editing',
        '2025-02-28',
        'Not Started',
        0,
        2,
        '2025-01-01T00:00:00Z',
        '2025-01-01T00:00:00Z'
      ),
      (
        'milestone_003',
        demo_user_id,
        'proj_001',
        'Series Launch Ready',
        'All episodes edited, thumbnails created, and upload schedule planned',
        '2025-03-15',
        'Not Started',
        0,
        3,
        '2025-01-01T00:00:00Z',
        '2025-01-01T00:00:00Z'
      ),
      
      -- Blog Series Milestones
      (
        'milestone_004',
        demo_user_id,
        'proj_002',
        'Research Phase Complete',
        'All technical research and examples prepared',
        '2025-01-25',
        'Complete',
        100,
        1,
        '2025-01-05T00:00:00Z',
        '2025-01-18T11:45:00Z'
      ),
      (
        'milestone_005',
        demo_user_id,
        'proj_002',
        'First 3 Articles Published',
        'Performance, Testing, and Hooks articles live',
        '2025-02-15',
        'In Progress',
        70,
        2,
        '2025-01-05T00:00:00Z',
        '2025-01-19T15:30:00Z'
      ),
      
      -- Podcast Milestones
      (
        'milestone_006',
        demo_user_id,
        'proj_003',
        'Podcast Setup Complete',
        'Equipment configured, guests booked, and first episode recorded',
        '2025-03-01',
        'In Progress',
        25,
        1,
        '2025-01-10T00:00:00Z',
        '2025-01-18T16:00:00Z'
      ),
      
      -- Course Milestones
      (
        'milestone_007',
        demo_user_id,
        'proj_005',
        'Course Planning Complete',
        'Curriculum finalized, learning objectives defined, and content outline ready',
        '2025-02-15',
        'In Progress',
        40,
        1,
        '2025-01-15T00:00:00Z',
        '2025-01-20T13:20:00Z'
      );

    -- Insert sample time entries
    INSERT INTO time_entries (id, user_id, task_id, project_id, description, duration, date, created_at, updated_at) VALUES
      -- Recent time entries
      (
        'time_001',
        demo_user_id,
        'task_001',
        'proj_001',
        'Writing HTML basics script - covering semantic elements',
        120,
        '2025-01-20',
        '2025-01-20T09:00:00Z',
        '2025-01-20T09:00:00Z'
      ),
      (
        'time_002',
        demo_user_id,
        'task_002',
        'proj_001',
        'Recording Episode 1 - first take with screen capture',
        90,
        '2025-01-20',
        '2025-01-20T14:00:00Z',
        '2025-01-20T14:00:00Z'
      ),
      (
        'time_003',
        demo_user_id,
        'task_007',
        'proj_002',
        'Writing React performance optimization article',
        150,
        '2025-01-19',
        '2025-01-19T10:30:00Z',
        '2025-01-19T10:30:00Z'
      ),
      (
        'time_004',
        demo_user_id,
        'task_009',
        'proj_003',
        'Researching potential podcast guests and preparing outreach emails',
        75,
        '2025-01-18',
        '2025-01-18T16:00:00Z',
        '2025-01-18T16:00:00Z'
      ),
      (
        'time_005',
        demo_user_id,
        'task_013',
        'proj_005',
        'Outlining TypeScript course structure and learning objectives',
        180,
        '2025-01-17',
        '2025-01-17T13:20:00Z',
        '2025-01-17T13:20:00Z'
      ),
      (
        'time_006',
        demo_user_id,
        'task_005',
        'proj_001',
        'Writing CSS fundamentals script - flexbox and grid sections',
        90,
        '2025-01-16',
        '2025-01-16T11:15:00Z',
        '2025-01-16T11:15:00Z'
      ),
      (
        'time_007',
        demo_user_id,
        'task_008',
        'proj_002',
        'Creating React testing examples and code samples',
        105,
        '2025-01-15',
        '2025-01-15T15:45:00Z',
        '2025-01-15T15:45:00Z'
      ),
      (
        'time_008',
        demo_user_id,
        'task_011',
        'proj_004',
        'Planning social media content calendar for January',
        60,
        '2025-01-14',
        '2025-01-14T10:30:00Z',
        '2025-01-14T10:30:00Z'
      );

    RAISE NOTICE 'Demo data created successfully';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating demo data: %', SQLERRM;
END $$;

-- Final verification and status report
DO $$
DECLARE
    demo_user_id uuid := '550e8400-e29b-41d4-a716-446655440000';
    demo_email text := 'demo@creatorflow.com';
    
    -- Authentication verification
    auth_user_exists boolean;
    email_confirmed boolean;
    has_password boolean;
    identity_exists boolean;
    profile_exists boolean;
    
    -- Data verification
    project_count int;
    task_count int;
    milestone_count int;
    time_entry_count int;
    
    -- Sample data
    sample_project text;
    sample_task text;
    
    -- Overall status
    auth_ready boolean;
    data_ready boolean;
    
BEGIN
    -- Check authentication components
    SELECT 
        EXISTS(SELECT 1 FROM auth.users WHERE email = demo_email),
        COALESCE((SELECT email_confirmed_at IS NOT NULL FROM auth.users WHERE email = demo_email), false),
        COALESCE((SELECT encrypted_password IS NOT NULL AND encrypted_password != '' FROM auth.users WHERE email = demo_email), false),
        EXISTS(SELECT 1 FROM auth.identities WHERE user_id = demo_user_id AND provider = 'email'),
        EXISTS(SELECT 1 FROM profiles WHERE id = demo_user_id)
    INTO auth_user_exists, email_confirmed, has_password, identity_exists, profile_exists;
    
    -- Check demo data
    SELECT COUNT(*) INTO project_count FROM projects WHERE user_id = demo_user_id;
    SELECT COUNT(*) INTO task_count FROM tasks WHERE user_id = demo_user_id;
    SELECT COUNT(*) INTO milestone_count FROM milestones WHERE user_id = demo_user_id;
    SELECT COUNT(*) INTO time_entry_count FROM time_entries WHERE user_id = demo_user_id;
    
    -- Get sample data
    SELECT title INTO sample_project FROM projects WHERE user_id = demo_user_id ORDER BY created_at LIMIT 1;
    SELECT title INTO sample_task FROM tasks WHERE user_id = demo_user_id ORDER BY created_at LIMIT 1;
    
    -- Determine readiness
    auth_ready := auth_user_exists AND email_confirmed AND has_password AND identity_exists AND profile_exists;
    data_ready := project_count > 0 AND task_count > 0;
    
    -- Provide comprehensive status report
    RAISE NOTICE '';
    RAISE NOTICE '🎯 ===== CREATORFLOW DATABASE SETUP COMPLETE ===== 🎯';
    RAISE NOTICE '';
    
    -- Authentication Status
    RAISE NOTICE '🔐 AUTHENTICATION STATUS:';
    RAISE NOTICE '   User Account: %', CASE WHEN auth_user_exists THEN '✅ CREATED' ELSE '❌ MISSING' END;
    RAISE NOTICE '   Email Confirmed: %', CASE WHEN email_confirmed THEN '✅ YES' ELSE '❌ NO' END;
    RAISE NOTICE '   Password Hash: %', CASE WHEN has_password THEN '✅ SET' ELSE '❌ MISSING' END;
    RAISE NOTICE '   Email Identity: %', CASE WHEN identity_exists THEN '✅ CONFIGURED' ELSE '❌ MISSING' END;
    RAISE NOTICE '   User Profile: %', CASE WHEN profile_exists THEN '✅ CREATED' ELSE '❌ MISSING' END;
    RAISE NOTICE '';
    
    -- Data Status
    RAISE NOTICE '📊 DEMO DATA STATUS:';
    RAISE NOTICE '   Projects: % (e.g., "%")', project_count, COALESCE(sample_project, 'None available');
    RAISE NOTICE '   Tasks: % (e.g., "%")', task_count, COALESCE(sample_task, 'None available');
    RAISE NOTICE '   Milestones: %', milestone_count;
    RAISE NOTICE '   Time Entries: %', time_entry_count;
    RAISE NOTICE '';
    
    -- Overall Status
    IF auth_ready AND data_ready THEN
        RAISE NOTICE '🎉 SUCCESS! CreatorFlow database is fully operational!';
        RAISE NOTICE '';
        RAISE NOTICE '🔑 DEMO LOGIN CREDENTIALS:';
        RAISE NOTICE '   📧 Email: demo@creatorflow.com';
        RAISE NOTICE '   🔒 Password: demo123456';
        RAISE NOTICE '';
        RAISE NOTICE '🌟 DEMO INCLUDES:';
        RAISE NOTICE '   • % realistic content creation projects', project_count;
        RAISE NOTICE '   • % tasks across different completion stages', task_count;
        RAISE NOTICE '   • % project milestones for progress tracking', milestone_count;
        RAISE NOTICE '   • % time tracking entries with sample data', time_entry_count;
        RAISE NOTICE '';
        RAISE NOTICE '🚀 Database is ready! You can now run the application and log in.';
        
    ELSE
        RAISE NOTICE '⚠️  Setup incomplete - Issues detected:';
        IF NOT auth_ready THEN 
            RAISE NOTICE '   ❌ Authentication issues detected';
            IF NOT auth_user_exists THEN RAISE NOTICE '      - No user account in auth.users'; END IF;
            IF NOT email_confirmed THEN RAISE NOTICE '      - Email not confirmed'; END IF;
            IF NOT has_password THEN RAISE NOTICE '      - No password hash set'; END IF;
            IF NOT identity_exists THEN RAISE NOTICE '      - Email identity missing'; END IF;
            IF NOT profile_exists THEN RAISE NOTICE '      - User profile missing'; END IF;
        END IF;
        IF NOT data_ready THEN 
            RAISE NOTICE '   ❌ Demo data issues detected';
            IF project_count = 0 THEN RAISE NOTICE '      - No projects created'; END IF;
            IF task_count = 0 THEN RAISE NOTICE '      - No tasks created'; END IF;
        END IF;
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '💡 NEXT STEPS:';
    RAISE NOTICE '   1. Start your application: npm run dev';
    RAISE NOTICE '   2. Navigate to the login page';
    RAISE NOTICE '   3. Use the demo credentials to log in';
    RAISE NOTICE '   4. Explore all CreatorFlow features with realistic data';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 TROUBLESHOOTING:';
    RAISE NOTICE '   • Check Supabase environment variables in .env';
    RAISE NOTICE '   • Verify Supabase project is connected';
    RAISE NOTICE '   • Check browser console for any errors';
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE '';
    
END $$;