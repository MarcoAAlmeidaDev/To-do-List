
import React from 'react';
import { CheckCircle2, Circle, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/contexts/ProjectContext';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getPriorityColor: (priority: Task['priority']) => string;
  getPriorityBadgeVariant: (priority: Task['priority']) => "default" | "secondary" | "destructive" | "outline";
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  getPriorityColor,
  getPriorityBadgeVariant,
}) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg border-l-4 ${
      task.status === 'done'
        ? 'bg-gray-50 border-l-gray-300 opacity-75' 
        : `border-l-${getPriorityColor(task.priority).split('-')[1]}-500`
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag Handle */}
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          {/* Priority Indicator */}
          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1 h-auto hover:bg-transparent"
          >
            {task.status === 'done' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </Button>

          {/* Task Text */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${
              task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500">
                {new Date(task.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-2 h-auto text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              disabled={task.status === 'done'}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="p-2 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
