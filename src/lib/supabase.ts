import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          deadline: string;
          priority: string;
          status: string;
          color: string;
          tags: string[];
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          deadline: string;
          priority: string;
          status: string;
          color: string;
          tags?: string[];
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          deadline?: string;
          priority?: string;
          status?: string;
          color?: string;
          tags?: string[];
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          title: string;
          description: string | null;
          priority: string;
          status: string;
          assignee: string | null;
          deadline: string | null;
          tags: string[];
          time_spent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          title: string;
          description?: string | null;
          priority: string;
          status: string;
          assignee?: string | null;
          deadline?: string | null;
          tags?: string[];
          time_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: string;
          status?: string;
          assignee?: string | null;
          deadline?: string | null;
          tags?: string[];
          time_spent?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          title: string;
          description: string | null;
          deadline: string;
          status: string;
          progress: number;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          title: string;
          description?: string | null;
          deadline: string;
          status: string;
          progress?: number;
          order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          deadline?: string;
          status?: string;
          progress?: number;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_entries: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          project_id: string | null;
          description: string;
          duration: number;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          project_id?: string | null;
          description: string;
          duration: number;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          project_id?: string | null;
          description?: string;
          duration?: number;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}