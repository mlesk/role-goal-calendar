
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import RoleItem from './RoleItem';
import NewItemForm from './NewItemForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Sidebar: React.FC = () => {
  const { roles, addRole } = useAppContext();
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false);

  const handleCreateRole = (title: string, description: string) => {
    addRole(title, description);
  };

  return (
    <div className="h-full flex flex-col border-r bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Roles &amp; Goals</h2>
          <Button variant="outline" size="sm" onClick={() => setNewRoleDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Role
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your roles, goals, and tasks. Drag tasks to the calendar to schedule them.
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {roles.length > 0 ? (
          roles.map(role => (
            <RoleItem key={role.id} role={role} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No roles yet. Create your first role to get started!</p>
            <Button onClick={() => setNewRoleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        )}
      </ScrollArea>

      <NewItemForm 
        open={newRoleDialogOpen}
        onOpenChange={setNewRoleDialogOpen}
        onSubmit={handleCreateRole}
        title="Create New Role"
      />
    </div>
  );
};

export default Sidebar;
