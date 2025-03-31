
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Goal } from '../data/types';
import TaskItem from './TaskItem';
import NewItemForm from './NewItemForm';
import { Trash, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const { addTask, deleteGoal, selectedGoalId, selectGoal } = useAppContext();
  const [isOpen, setIsOpen] = useState(selectedGoalId === goal.id);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  const handleCreateTask = (title: string, description: string) => {
    addTask(goal.id, title, description);
  };

  const handleGoalClick = () => {
    selectGoal(isOpen ? null : goal.id);
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent cursor-pointer">
          <CollapsibleTrigger asChild onClick={handleGoalClick}>
            <div className="flex items-center flex-1">
              <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isOpen && "-rotate-90")} />
              <span className="font-medium">{goal.title}</span>
            </div>
          </CollapsibleTrigger>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); setNewTaskDialogOpen(true); }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="pl-8 pr-2 space-y-1 mt-1">
            {goal.tasks.length > 0 ? (
              goal.tasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-2">
                No tasks yet. Add your first task!
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <NewItemForm 
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        onSubmit={handleCreateTask}
        title="Create New Task"
      />
    </div>
  );
};

export default GoalItem;
