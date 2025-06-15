
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Plus, Filter, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import KanbanColumn from '@/components/KanbanColumn';
import LiveClock from '@/components/LiveClock';
import { useProjects, Task } from '@/contexts/ProjectContext';

type TaskFilter = 'todas' | 'recentes' | 'antigas' | 'alta' | 'media' | 'baixa';

const Index = () => {
  const { tasks, activeProject, addTask, moveTask } = useProjects();
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('media');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex">
          <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Bem-vindo ao Sistema de Projetos
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crie seu primeiro projeto para começar a organizar suas tarefas
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter(task => task.projectId === activeProject.id);

  const getFilteredTasks = (tasks: Task[]) => {
    switch (filter) {
      case 'recentes':
        return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'antigas':
        return [...tasks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'alta':
      case 'media':
      case 'baixa':
        return tasks.filter(task => task.priority === filter);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks(projectTasks);

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const doingTasks = filteredTasks.filter(task => task.status === 'doing');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];
    
    moveTask(draggableId, newStatus);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), newTaskPriority);
      setNewTaskText('');
      setNewTaskPriority('media');
      setIsAddingTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar isCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="lg:hidden"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeProject.name}
                </h1>
                {activeProject.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {activeProject.description}
                  </p>
                )}
              </div>
            </div>
            
            <LiveClock />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={filter} onValueChange={(value: TaskFilter) => setFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as Tarefas</SelectItem>
                    <SelectItem value="recentes">Recém Adicionadas</SelectItem>
                    <SelectItem value="antigas">Mais Antigas</SelectItem>
                    <SelectItem value="alta">Prioridade Alta</SelectItem>
                    <SelectItem value="media">Prioridade Média</SelectItem>
                    <SelectItem value="baixa">Prioridade Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="task-text">Descrição da Tarefa</Label>
                    <Input
                      id="task-text"
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      placeholder="Digite a descrição da tarefa..."
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-priority">Prioridade</Label>
                    <Select value={newTaskPriority} onValueChange={(value: Task['priority']) => setNewTaskPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            Baixa
                          </div>
                        </SelectItem>
                        <SelectItem value="media">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            Média
                          </div>
                        </SelectItem>
                        <SelectItem value="alta">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            Alta
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    Adicionar Tarefa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 p-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <KanbanColumn
                title="To Do"
                status="todo"
                tasks={todoTasks}
                count={todoTasks.length}
              />
              <KanbanColumn
                title="Doing"
                status="doing"
                tasks={doingTasks}
                count={doingTasks.length}
              />
              <KanbanColumn
                title="Done"
                status="done"
                tasks={doneTasks}
                count={doneTasks.length}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Index;
