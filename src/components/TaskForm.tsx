
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Task } from '@/contexts/ProjectContext';

interface TaskFormProps {
  initialText?: string;
  initialPriority?: Task['priority'];
  onSubmit: (text: string, priority: Task['priority']) => void;
  onCancel: () => void;
  title: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialText = '',
  initialPriority = 'media',
  onSubmit,
  onCancel,
  title,
}) => {
  const [text, setText] = useState(initialText);
  const [priority, setPriority] = useState<Task['priority']>(initialPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim(), priority);
      setText('');
      setPriority('media');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-text">Descrição da Tarefa</Label>
          <Input
            id="task-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite a descrição da tarefa..."
            className="w-full"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-priority">Prioridade</Label>
          <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Baixa
                </div>
              </SelectItem>
              <SelectItem value="media">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
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

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            disabled={!text.trim()}
          >
            {initialText ? 'Atualizar' : 'Adicionar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
