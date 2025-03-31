
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Role } from '../data/types';
import GoalItem from './GoalItem';
import NewItemForm from './NewItemForm';
import { Trash, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface RoleItemProps {
  role: Role;
}

const RoleItem: React.FC<RoleItemProps> = ({ role }) => {
  const { addGoal, deleteRole, selectedRoleId, selectRole } = useAppContext();
  const [isOpen, setIsOpen] = useState(selectedRoleId === role.id);
  const [newGoalDialogOpen, setNewGoalDialogOpen] = useState(false);

  const handleCreateGoal = (title: string, description: string) => {
    addGoal(role.id, title, description);
  };

  const handleRoleClick = () => {
    selectRole(isOpen ? null : role.id);
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-accent cursor-pointer">
          <CollapsibleTrigger asChild onClick={handleRoleClick}>
            <div className="flex items-center flex-1">
              <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", !isOpen && "-rotate-90")} />
              <span className="font-semibold">{role.title}</span>
            </div>
          </CollapsibleTrigger>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); setNewGoalDialogOpen(true); }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); deleteRole(role.id); }}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="pl-6 mt-2">
            {role.goals.length > 0 ? (
              role.goals.map(goal => (
                <GoalItem key={goal.id} goal={goal} />
              ))
            ) : (
              <div className="text-sm text-muted-foreground py-2 px-2">
                No goals yet. Add your first goal!
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <NewItemForm 
        open={newGoalDialogOpen}
        onOpenChange={setNewGoalDialogOpen}
        onSubmit={handleCreateGoal}
        title="Create New Goal"
      />
    </div>
  );
};

export default RoleItem;
