
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  text: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  activeProject: Project | null;
  addProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project | null) => void;
  addTask: (text: string, priority: Task['priority']) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

const PROJECTS_KEY = 'kanban-projects';
const TASKS_KEY = 'kanban-tasks';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const savedTasks = localStorage.getItem(TASKS_KEY);
    
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) {
        setActiveProject(parsedProjects[0]);
      }
    }
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addProject = (name: string, description?: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
    if (!activeProject) {
      setActiveProject(newProject);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    if (activeProject?.id === id) {
      const remaining = projects.filter(p => p.id !== id);
      setActiveProject(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const addTask = (text: string, priority: Task['priority']) => {
    if (!activeProject) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      priority,
      status: 'todo',
      createdAt: new Date(),
      projectId: activeProject.id,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      tasks,
      activeProject,
      addProject,
      deleteProject,
      setActiveProject,
      addTask,
      updateTaskStatus,
      updateTask,
      deleteTask,
      moveTask,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
