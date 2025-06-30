import { useState, useEffect } from 'react';
import { Project, Task, Milestone, ContentCalendarEvent } from '../types';
import { generateId } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';

interface Store {
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  calendarEvents: ContentCalendarEvent[];
  currentProject: Project | null;
}

const initialStore: Store = {
  projects: [],
  tasks: [],
  milestones: [],
  calendarEvents: [],
  currentProject: null,
};

export function useStore() {
  const { user } = useAuth();
  const supabaseData = useSupabaseData();
  
  const [store, setStore] = useState<Store>(initialStore);

  // Load user data from Supabase when available
  useEffect(() => {
    if (!user) {
      setStore(initialStore);
      return;
    }

    if (!supabaseData.loading) {
      setStore({
        projects: supabaseData.projects,
        tasks: supabaseData.tasks,
        milestones: supabaseData.milestones,
        calendarEvents: [], // We'll implement calendar events later
        currentProject: null,
      });
    }
  }, [user, supabaseData]);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'milestones' | 'tasks'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [],
      tasks: [],
    };

    // Add to local state immediately
    setStore(prev => ({ ...prev, projects: [...prev.projects, newProject] }));

    // Save to Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('projects')
          .insert({
            id: newProject.id,
            user_id: user.id,
            title: newProject.title,
            description: newProject.description,
            category: newProject.category,
            deadline: newProject.deadline,
            priority: newProject.priority,
            status: newProject.status,
            color: newProject.color,
            tags: newProject.tags,
            progress: newProject.progress,
          });

        if (error) {
          console.error('Error saving project to Supabase:', error);
          // Revert local state on error
          setStore(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== newProject.id) }));
        }
      } catch (error) {
        console.error('Error saving project:', error);
        // Revert local state on error
        setStore(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== newProject.id) }));
      }
    }

    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatedProject = { ...updates, updatedAt: new Date().toISOString() };
    
    // Update local state immediately
    setStore(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, ...updatedProject } : p
      ),
    }));

    // Update in Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            title: updates.title,
            description: updates.description,
            category: updates.category,
            deadline: updates.deadline,
            priority: updates.priority,
            status: updates.status,
            color: updates.color,
            tags: updates.tags,
            progress: updates.progress,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating project in Supabase:', error);
        }
      } catch (error) {
        console.error('Error updating project:', error);
      }
    }
  };

  const deleteProject = async (id: string) => {
    // Update local state immediately
    setStore(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tasks: prev.tasks.filter(t => t.projectId !== id),
      milestones: prev.milestones.filter(m => m.projectId !== id),
    }));

    // Delete from Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting project from Supabase:', error);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'subtasks'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: [],
    };

    // Add to local state immediately
    setStore(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));

    // Save to Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .insert({
            id: newTask.id,
            user_id: user.id,
            project_id: newTask.projectId,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            status: newTask.status,
            assignee: newTask.assignee,
            deadline: newTask.deadline,
            tags: newTask.tags,
            time_spent: newTask.timeSpent,
          });

        if (error) {
          console.error('Error saving task to Supabase:', error);
          // Revert local state on error
          setStore(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== newTask.id) }));
        }
      } catch (error) {
        console.error('Error saving task:', error);
        // Revert local state on error
        setStore(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== newTask.id) }));
      }
    }

    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTask = { ...updates, updatedAt: new Date().toISOString() };
    
    // Update local state immediately
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, ...updatedTask } : t
      ),
    }));

    // Update in Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: updates.title,
            description: updates.description,
            priority: updates.priority,
            status: updates.status,
            assignee: updates.assignee,
            deadline: updates.deadline,
            tags: updates.tags,
            time_spent: updates.timeSpent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating task in Supabase:', error);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const deleteTask = async (id: string) => {
    // Update local state immediately
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));

    // Delete from Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error deleting task from Supabase:', error);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const addMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: generateId(),
    };

    // Add to local state immediately
    setStore(prev => ({ ...prev, milestones: [...prev.milestones, newMilestone] }));

    // Save to Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('milestones')
          .insert({
            id: newMilestone.id,
            user_id: user.id,
            project_id: newMilestone.projectId,
            title: newMilestone.title,
            description: newMilestone.description,
            deadline: newMilestone.deadline,
            status: newMilestone.status,
            progress: newMilestone.progress,
            order: newMilestone.order,
          });

        if (error) {
          console.error('Error saving milestone to Supabase:', error);
          // Revert local state on error
          setStore(prev => ({ ...prev, milestones: prev.milestones.filter(m => m.id !== newMilestone.id) }));
        }
      } catch (error) {
        console.error('Error saving milestone:', error);
        // Revert local state on error
        setStore(prev => ({ ...prev, milestones: prev.milestones.filter(m => m.id !== newMilestone.id) }));
      }
    }

    return newMilestone;
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    // Update local state immediately
    setStore(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id ? { ...m, ...updates } : m
      ),
    }));

    // Update in Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('milestones')
          .update({
            title: updates.title,
            description: updates.description,
            deadline: updates.deadline,
            status: updates.status,
            progress: updates.progress,
            order: updates.order,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating milestone in Supabase:', error);
        }
      } catch (error) {
        console.error('Error updating milestone:', error);
      }
    }
  };

  const setCurrentProject = (project: Project | null) => {
    setStore(prev => ({ ...prev, currentProject: project }));
  };

  return {
    ...store,
    loading: supabaseData.loading,
    error: supabaseData.error,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addMilestone,
    updateMilestone,
    setCurrentProject,
  };
}