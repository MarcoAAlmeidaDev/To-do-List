
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';

export type Priority = 'baixa' | 'media' | 'alta';
export type TaskFilter = 'todas' | 'ativas' | 'completas';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
}

const Index = () => {
  const { tasks, addTask, updateTask, deleteTask, reorderTasks } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ativas') return !task.completed;
    if (filter === 'completas') return task.completed;
    return true;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-blue-500';
    }
  };

  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  const handleAddTask = (text: string, priority: Priority) => {
    addTask(text, priority);
    setIsAddingTask(false);
  };

  const handleEditTask = (task: Task, text: string, priority: Priority) => {
    updateTask(task.id, { text, priority });
    setEditingTask(null);
  };

  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Lista de Tarefas Aprimorada
          </h1>
          <p className="text-gray-600 text-lg">
            Organize suas tarefas com prioridades, filtros e muito mais!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Circle className="w-5 h-5" />
                <span className="font-semibold">Ativas</span>
              </div>
              <div className="text-2xl font-bold">{activeTasksCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Completas</span>
              </div>
              <div className="text-2xl font-bold">{completedTasksCount}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Total</span>
              </div>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <Select value={filter} onValueChange={(value: TaskFilter) => setFilter(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="ativas">Ativas</SelectItem>
                    <SelectItem value="completas">Completas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => setIsAddingTask(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Task Form */}
        {isAddingTask && (
          <Card className="mb-6 border-2 border-purple-200">
            <CardContent className="p-6">
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => setIsAddingTask(false)}
                title="Adicionar Nova Tarefa"
              />
            </CardContent>
          </Card>
        )}

        {/* Edit Task Form */}
        {editingTask && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardContent className="p-6">
              <TaskForm
                initialText={editingTask.text}
                initialPriority={editingTask.priority}
                onSubmit={(text, priority) => handleEditTask(editingTask, text, priority)}
                onCancel={() => setEditingTask(null)}
                title="Editar Tarefa"
              />
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <Card>
          <CardContent className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                <p>
                  {filter === 'todas' 
                    ? 'Comece adicionando uma nova tarefa!' 
                    : `Não há tarefas ${filter === 'ativas' ? 'ativas' : 'completas'} no momento.`}
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {filteredTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transform transition-all duration-200 ${
                                snapshot.isDragging ? 'scale-105 rotate-2 shadow-xl' : ''
                              }`}
                            >
                              <TaskItem
                                task={task}
                                onToggle={() => updateTask(task.id, { completed: !task.completed })}
                                onEdit={() => setEditingTask(task)}
                                onDelete={() => deleteTask(task.id)}
                                getPriorityColor={getPriorityColor}
                                getPriorityBadgeVariant={getPriorityBadgeVariant}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Priority Legend */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Legenda de Prioridades:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Alta Prioridade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Média Prioridade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Baixa Prioridade</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
