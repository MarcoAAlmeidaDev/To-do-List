
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Task } from '@/contexts/ProjectContext';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onOpenChange, task, onSave, onDelete }) => {
  const [editing, setEditing] = useState(false);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Tarefa' : 'Detalhes da Tarefa'}</DialogTitle>
        </DialogHeader>
        {editing ? (
          <TaskForm
            initialText={task.text}
            initialPriority={task.priority}
            title="Editar Tarefa"
            onSubmit={(text, priority) => {
              onSave(task.id, { text, priority });
              setEditing(false);
              onOpenChange(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <div className="font-semibold">Descrição</div>
              <div className="mt-1">{task.text}</div>
            </div>
            <div>
              <div className="font-semibold">Prioridade</div>
              <span
                className={
                  task.priority === 'alta'
                    ? 'text-red-600 font-semibold'
                    : task.priority === 'media'
                    ? 'text-yellow-600 font-semibold'
                    : 'text-blue-600 font-semibold'
                }
              >
                {task.priority[0].toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  onOpenChange(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
