import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, Goal, Task } from '../data/types';
import { initialRoles } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  roles: Role[];
  selectedRoleId: string | null;
  selectedGoalId: string | null;
  addRole: (title: string, description: string) => void;
  addGoal: (roleId: string, title: string, description: string) => void;
  addTask: (goalId: string, title: string, description: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteRole: (roleId: string) => void;
  deleteGoal: (goalId: string) => void;
  deleteTask: (taskId: string) => void;
  scheduleTask: (taskId: string, date: string) => void;
  unscheduleTask: (taskId: string) => void;
  selectRole: (roleId: string | null) => void;
  selectGoal: (goalId: string | null) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getScheduledTasks: (date: string) => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const addRole = (title: string, description: string) => {
    const newRole: Role = {
      id: uuidv4(),
      title,
      description,
      goals: []
    };
    setRoles([...roles, newRole]);
  };

  const addGoal = (roleId: string, title: string, description: string) => {
    const newGoal: Goal = {
      id: uuidv4(),
      title,
      description,
      roleId,
      tasks: []
    };
    
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          goals: [...role.goals, newGoal]
        };
      }
      return role;
    }));
  };

  const addTask = (goalId: string, title: string, description: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      goalId
    };
    
    setRoles(roles.map(role => {
      return {
        ...role,
        goals: role.goals.map(goal => {
          if (goal.id === goalId) {
            return {
              ...goal,
              tasks: [...goal.tasks, newTask]
            };
          }
          return goal;
        })
      };
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setRoles(roles.map(role => {
      return {
        ...role,
        goals: role.goals.map(goal => {
          return {
            ...goal,
            tasks: goal.tasks.map(task => {
              if (task.id === taskId) {
                return {
                  ...task,
                  ...updates
                };
              }
              return task;
            })
          };
        })
      };
    }));
  };

  const deleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
    if (selectedRoleId === roleId) {
      setSelectedRoleId(null);
      setSelectedGoalId(null);
    }
  };

  const deleteGoal = (goalId: string) => {
    setRoles(roles.map(role => {
      return {
        ...role,
        goals: role.goals.filter(goal => goal.id !== goalId)
      };
    }));
    if (selectedGoalId === goalId) {
      setSelectedGoalId(null);
    }
  };

  const deleteTask = (taskId: string) => {
    setRoles(roles.map(role => {
      return {
        ...role,
        goals: role.goals.map(goal => {
          return {
            ...goal,
            tasks: goal.tasks.filter(task => task.id !== taskId)
          };
        })
      };
    }));
  };

  const scheduleTask = (taskId: string, date: string) => {
    updateTask(taskId, { scheduledDate: date });
  };

  const unscheduleTask = (taskId: string) => {
    updateTask(taskId, { 
      scheduledDate: undefined,
      scheduledHour: undefined 
    });
  };

  const selectRole = (roleId: string | null) => {
    setSelectedRoleId(roleId);
    setSelectedGoalId(null);
  };

  const selectGoal = (goalId: string | null) => {
    setSelectedGoalId(goalId);
  };

  const getTaskById = (taskId: string): Task | undefined => {
    for (const role of roles) {
      for (const goal of role.goals) {
        const task = goal.tasks.find(t => t.id === taskId);
        if (task) return task;
      }
    }
    return undefined;
  };

  const getScheduledTasks = (date: string): Task[] => {
    const tasks: Task[] = [];
    roles.forEach(role => {
      role.goals.forEach(goal => {
        goal.tasks.forEach(task => {
          if (task.scheduledDate === date) {
            tasks.push(task);
          }
        });
      });
    });
    return tasks;
  };

  return (
    <AppContext.Provider value={{
      roles,
      selectedRoleId,
      selectedGoalId,
      addRole,
      addGoal,
      addTask,
      updateTask,
      deleteRole,
      deleteGoal,
      deleteTask,
      scheduleTask,
      unscheduleTask,
      selectRole,
      selectGoal,
      getTaskById,
      getScheduledTasks
    }}>
      {children}
    </AppContext.Provider>
  );
};
