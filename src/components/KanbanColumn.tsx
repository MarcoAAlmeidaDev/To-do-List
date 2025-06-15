
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';
import { Task } from '@/contexts/ProjectContext';

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
  return (
    <div className={`flex-1 ${getColumnColor(status)} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
          {count}
        </span>
      </div>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[400px] ${
              snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-700' : ''
            } rounded-lg transition-colors duration-200`}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
              />
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
    </div>
  );
};

export default KanbanColumn;
