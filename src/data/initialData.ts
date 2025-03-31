
import { Role } from './types';

export const initialRoles: Role[] = [
  {
    id: '1',
    title: 'Work',
    description: 'Professional responsibilities',
    goals: [
      {
        id: '1-1',
        title: 'Complete Q2 Project',
        description: 'Finish all deliverables for Q2 project',
        roleId: '1',
        tasks: [
          {
            id: '1-1-1',
            title: 'Create project plan',
            description: 'Outline project timeline and resources',
            completed: false,
            goalId: '1-1',
          },
          {
            id: '1-1-2',
            title: 'Schedule kick-off meeting',
            description: 'Set up initial meeting with stakeholders',
            completed: false,
            goalId: '1-1',
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Personal',
    description: 'Personal development and life goals',
    goals: [
      {
        id: '2-1',
        title: 'Learn new skill',
        description: 'Develop a new skill to enhance personal growth',
        roleId: '2',
        tasks: [
          {
            id: '2-1-1',
            title: 'Research courses',
            description: 'Find relevant courses or resources',
            completed: false,
            goalId: '2-1',
          }
        ]
      }
    ]
  }
];
