
import React, { useState } from 'react';
import { Plus, Folder, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const { projects, activeProject, setActiveProject, addProject } = useProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim(), newProjectDescription.trim() || undefined);
      setNewProjectName('');
      setNewProjectDescription('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0 z-10`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projetos</h2>
        )}
      </div>

      {/* Projects List */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {!isCollapsed && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="project-name">Nome do Projeto</Label>
                  <Input
                    id="project-name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Digite o nome do projeto"
                  />
                </div>
                <div>
                  <Label htmlFor="project-description">Descrição (opcional)</Label>
                  <Input
                    id="project-description"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="Digite uma descrição"
                  />
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  Criar Projeto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {projects.map((project) => (
          <Button
            key={project.id}
            variant={activeProject?.id === project.id ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
            size="sm"
            onClick={() => setActiveProject(project)}
          >
            <Folder className="w-4 h-4 mr-2 flex-shrink-0" />
            {!isCollapsed && (
              <span className="truncate">{project.name}</span>
            )}
          </Button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 mr-2" />
          ) : (
            <Sun className="w-4 h-4 mr-2" />
          )}
          {!isCollapsed && (theme === 'light' ? 'Modo Escuro' : 'Modo Claro')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
          onClick={() => console.log('Configurações clicadas')}
        >
          <Settings className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Configurações'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start ${isCollapsed ? 'px-2' : ''} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
          onClick={() => console.log('Logout clicado')}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && 'Sair'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
