
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/contexts/ProjectContext';
import { Tag, Calendar, Paperclip, Share, Trash2 } from 'lucide-react';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSave: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

const COLUMN_LABELS: Record<Task['status'], string> = {
  todo: 'To Do',
  doing: 'Doing',
  done: 'Done',
};

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onOpenChange,
  task,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState(task?.text ?? '');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState(false);

  React.useEffect(() => {
    setTitle(task?.text ?? '');
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    onSave(task.id, { text: title });
    setEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
          {/* Left (infos) */}
          <div className="md:col-span-5 col-span-1 space-y-6">
            {/* Task Title editable */}
            <Input
              className="text-2xl font-bold px-0 border-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent"
              value={title}
              onChange={e => setTitle(e.target.value)}
              readOnly={!editing}
              autoFocus={editing}
              aria-label="Título da tarefa"
            />

            {/* Status (Column name) */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded px-2 py-0.5 font-medium">
                {COLUMN_LABELS[task.status]}
              </span>
            </div>

            {/* Description textarea */}
            <div>
              <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Descrição</div>
              <Textarea
                className="min-h-[120px] resize-y"
                placeholder="Adicione mais detalhes sobre esta tarefa"
                value={description}
                onChange={e => setDescription(e.target.value)}
                readOnly={!editing}
                aria-label="Descrição da tarefa"
              />
            </div>
          </div>

          {/* Right (actions) */}
          <div className="md:col-span-2 col-span-1 flex flex-col gap-2 items-center h-full">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
              disabled
              title="Colocar etiqueta (em breve)"
            >
              <Tag className="w-4 h-4" />
              Colocar etiqueta
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
              disabled
              title="Data de entrega (em breve)"
            >
              <Calendar className="w-4 h-4" />
              Data de entrega
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
              disabled
              title="Anexar documentos (em breve)"
            >
              <Paperclip className="w-4 h-4" />
              Anexar documentos
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-start"
              disabled
              title="Compartilhar tarefa (em breve)"
            >
              <Share className="w-4 h-4" />
              Compartilhar
            </Button>
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2 justify-start mt-6"
              onClick={() => {
                onDelete(task.id);
                onOpenChange(false);
              }}
              title="Excluir tarefa"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>
        </div>
        {/* Edit/Save/Cancel buttons */}
        <div className="mt-8 flex gap-2">
          {editing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={!title.trim()}
                className="bg-blue-600 text-white"
              >
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setTitle(task.text ?? '');
                }}
                type="button"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)} variant="default">
              Editar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
