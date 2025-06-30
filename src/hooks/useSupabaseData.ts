import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Project, Task, Milestone } from '../types';

interface SupabaseData {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  loading: boolean;
  error: string | null;
}

export function useSupabaseData(): SupabaseData {
  const { user } = useAuth();
  const [data, setData] = useState<SupabaseData>({
    projects: [],
    tasks: [],
    milestones: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      // Fetch milestones
      const { data: milestones, error: milestonesError } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('deadline', { ascending: true });

      if (milestonesError) throw milestonesError;

      // Transform data to match our types
      const transformedProjects: Project[] = (projects || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        category: p.category as Project['category'],
        deadline: p.deadline,
        priority: p.priority as Project['priority'],
        status: p.status as Project['status'],
        color: p.color,
        tags: p.tags || [],
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        progress: p.progress,
        milestones: [],
        tasks: [],
      }));

      const transformedTasks: Task[] = (tasks || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: t.priority as Task['priority'],
        status: t.status as Task['status'],
        assignee: t.assignee,
        deadline: t.deadline,
        tags: t.tags || [],
        projectId: t.project_id,
        timeSpent: t.time_spent,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        subtasks: [], // We'll implement subtasks later if needed
      }));

      const transformedMilestones: Milestone[] = (milestones || []).map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        deadline: m.deadline,
        status: m.status as Milestone['status'],
        progress: m.progress,
        projectId: m.project_id,
        order: m.order,
      }));

      setData({
        projects: transformedProjects,
        tasks: transformedTasks,
        milestones: transformedMilestones,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  };

  return data;
}