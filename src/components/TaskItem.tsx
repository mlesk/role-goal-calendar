
import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task } from '../data/types';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from '../utils/dateUtils';
import { Calendar, Trash, GripVertical, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask } = useAppContext();
  const taskRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    if (taskRef.current) {
      const rect = taskRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(taskRef.current, rect.width / 2, rect.height / 2);
    }
  };

  // Format the hour display
  const formatHour = (hour?: number) => {
    if (hour === undefined) return '';
    return hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`;
  };

  return (
    <div 
      ref={taskRef}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md group hover:bg-accent cursor-pointer",
        task.completed && "opacity-70"
      )}
      draggable
      onDragStart={handleDragStart}
    >
      <GripVertical className="h-4 w-4 opacity-50 cursor-grab" />
      
      <Checkbox 
        checked={task.completed}
        onCheckedChange={(checked) => updateTask(task.id, { completed: !!checked })}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className={cn("truncate text-sm", task.completed && "line-through")}>
          {task.title}
        </div>
        {task.scheduledDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(task.scheduledDate)}
            {task.scheduledHour !== undefined && (
              <>
                <Clock className="h-3 w-3 ml-2 mr-1" />
                {formatHour(task.scheduledHour)}
              </>
            )}
          </div>
        )}
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash className="h-4 w-4 text-destructive hover:text-destructive/80" />
      </button>
    </div>
  );
};

export default TaskItem;
