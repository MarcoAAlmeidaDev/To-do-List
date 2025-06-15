
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { PlayCircle, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task, useProjects } from '@/contexts/ProjectContext';

interface KanbanCardProps {
  task: Task;
  index: number;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-500';
    case 'media':
      return 'bg-orange-500';
    case 'baixa':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'alta':
      return 'destructive' as const;
    case 'media':
      return 'default' as const;
    case 'baixa':
      return 'secondary' as const;
    default:
      return 'outline' as const;
  }
};

const KanbanCard: React.FC<KanbanCardProps> = ({ task, index }) => {
  const { updateTaskStatus, deleteTask } = useProjects();

  const handleStatusChange = () => {
    if (task.status === 'todo') {
      updateTaskStatus(task.id, 'doing');
    } else if (task.status === 'doing') {
      updateTaskStatus(task.id, 'done');
    }
  };

  const getStatusButton = () => {
    if (task.status === 'todo') {
      return (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleStatusChange}
          className="p-1 h-auto text-blue-600 hover:text-blue-800"
        >
          <PlayCircle className="w-4 h-4" />
        </Button>
      );
    } else if (task.status === 'doing') {
      return (
        <Button
          size="sm"
          variant="ghost"
          onClick={handleStatusChange}
          className="p-1 h-auto text-green-600 hover:text-green-800"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      );
    }
    return null;
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            snapshot.isDragging ? 'shadow-lg rotate-3 scale-105' : ''
          } transition-all duration-200`}
        >
          <div className="flex items-start gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0 mt-1`} />
            <p className="text-sm text-gray-900 dark:text-white flex-1 leading-relaxed">
              {task.text}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-1">
              {getStatusButton()}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteTask(task.id)}
                className="p-1 h-auto text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {new Date(task.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
