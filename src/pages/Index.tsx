
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useProjects } from '@/contexts/ProjectContext';
import Sidebar from '@/components/Sidebar';
import KanbanColumn from '@/components/KanbanColumn';
import LiveClock from '@/components/LiveClock';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { activeProject, tasks, updateTaskStatus } = useProjects();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filter, setFilter] = useState('todas');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Drag handler (update task status)
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !activeProject) return;

    const { draggableId, source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newStatus = destination.droppableId as 'todo' | 'doing' | 'done';
    updateTaskStatus(draggableId, newStatus);
    // If you need `updateTaskOrder`, implement it in context later.
  };

  // Get filtered tasks for the column, based on active project
  const getFilteredTasks = (status: 'todo' | 'doing' | 'done') => {
    if (!activeProject) return [];

    // Get all tasks for this project and status
    const statusTasks = tasks
      .filter(task => task.projectId === activeProject.id && task.status === status);

    switch (filter) {
      case 'recentes':
        return [...statusTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'antigas':
        return [...statusTasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'alta':
        return statusTasks.filter(task => task.priority === 'alta');
      case 'media':
        return statusTasks.filter(task => task.priority === 'media');
      case 'baixa':
        return statusTasks.filter(task => task.priority === 'baixa');
      default:
        return statusTasks;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeProject ? activeProject.name : 'Selecione um Projeto'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as tarefas</SelectItem>
                  <SelectItem value="recentes">Recém adicionadas</SelectItem>
                  <SelectItem value="antigas">Mais antigas</SelectItem>
                  <SelectItem value="alta">Prioridade Alta</SelectItem>
                  <SelectItem value="media">Prioridade Média</SelectItem>
                  <SelectItem value="baixa">Prioridade Baixa</SelectItem>
                </SelectContent>
              </Select>

              <LiveClock />
            </div>
          </div>

          {activeProject?.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">{activeProject.description}</p>
          )}
        </header>

        {/* Content */}
        <main className="p-6">
          {activeProject ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn
                  title="To Do"
                  status="todo"
                  tasks={getFilteredTasks('todo')}
                  count={getFilteredTasks('todo').length}
                />
                <KanbanColumn
                  title="Doing"
                  status="doing"
                  tasks={getFilteredTasks('doing')}
                  count={getFilteredTasks('doing').length}
                />
                <KanbanColumn
                  title="Done"
                  status="done"
                  tasks={getFilteredTasks('done')}
                  count={getFilteredTasks('done').length}
                />
              </div>
            </DragDropContext>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Selecione um projeto para começar a gerenciar suas tarefas
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
