
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/contexts/ProjectContext';
import { Tag, Calendar, Paperclip, Share, Trash2, Users, Eye, CheckSquare, Clock, Plus } from 'lucide-react';

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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]">
          {/* Main Content Area */}
          <div className="lg:col-span-3 p-6 space-y-6 overflow-y-auto">
            {/* Header with icon and title */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center mt-1">
                <CheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <Input
                  className="text-xl font-semibold px-0 border-none shadow-none focus:ring-0 focus-visible:ring-0 bg-transparent text-gray-900 dark:text-white"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  readOnly={!editing}
                  autoFocus={editing}
                  placeholder="Título da tarefa"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    na lista
                  </span>
                  <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                    {COLUMN_LABELS[task.status]}
                  </span>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>Seguir</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Descrição</h3>
                </div>
                {!editing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </div>
              
              {editing ? (
                <div className="ml-8 space-y-3">
                  <Textarea
                    className="min-h-[120px] resize-y"
                    placeholder="Adicione uma descrição mais detalhada..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={!title.trim()}
                      size="sm"
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(false);
                        setTitle(task.text ?? '');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="ml-8">
                  {description ? (
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {description}
                    </div>
                  ) : (
                    <div 
                      className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setEditing(true)}
                    >
                      Adicione uma descrição mais detalhada...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Atividade</h3>
              </div>
              
              <div className="ml-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    U
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Escrever um comentário..."
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-800 p-4 space-y-4 border-l border-gray-200 dark:border-gray-700">
            {/* Add to card section */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Adicionar ao cartão
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Membros
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Etiquetas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Checklist
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Datas
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Anexo
                </Button>
              </div>
            </div>

            {/* Power-Ups section */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Power-Ups
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar power-ups
              </Button>
            </div>

            {/* Actions section */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Ações
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => {
                    onDelete(task.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Arquivar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
