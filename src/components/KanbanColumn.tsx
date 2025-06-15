
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import { Task } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import TaskForm from './TaskForm';
import TaskModal from './TaskModal';
import { useProjects } from '@/contexts/ProjectContext';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: Task[];
  count: number;
}

const getColumnColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-gray-100 dark:bg-gray-800';
    case 'doing':
      return 'bg-blue-50 dark:bg-blue-900/20';
    case 'done':
      return 'bg-green-50 dark:bg-green-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, count }) => {
  const { addTask, updateTask, deleteTask } = useProjects();
  const [isAdding, setIsAdding] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Adiciona nova tarefa já nesse status
  const handleAddTask = (text: string, priority: Task['priority']) => {
    addTask(text, priority);
    setIsAdding(false);
  };

  // Abrir modal ao clicar em tarefa
  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <div className={`flex-1 ${getColumnColor(status)} rounded-lg p-4 flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
          {count}
        </span>
      </div>
      <Button
        variant="outline"
        className="mb-3 w-full flex items-center gap-2"
        onClick={() => setIsAdding(true)}
        size="sm"
      >
        <Plus className="w-4 h-4" /> Adicionar tarefa
      </Button>

      {isAdding && (
        <div className="mb-3">
          <TaskForm
            title="Adicionar Tarefa"
            onSubmit={handleAddTask}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[400px] flex-1 ${
              snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-700' : ''
            } rounded-lg transition-colors duration-200`}
          >
            {tasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleCardClick(task)}
                style={{ cursor: 'pointer' }}
              >
                <KanbanCard
                  task={task}
                  index={index}
                />
              </div>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                {status === 'todo' && 'Arraste tarefas aqui...'}
                {status === 'doing' && 'Tarefas em andamento'}
                {status === 'done' && 'Tarefas concluídas'}
              </div>
            )}
          </div>
        )}
      </Droppable>

      <TaskModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
};

export default KanbanColumn;
