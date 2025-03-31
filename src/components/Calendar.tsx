
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getDaysOfWeek } from '../utils/dateUtils';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek(currentDate));
  const { getScheduledTasks, getTaskById, unscheduleTask } = useAppContext();

  useEffect(() => {
    setDaysOfWeek(getDaysOfWeek(currentDate));
  }, [currentDate]);

  const navigateToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const navigateToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        // Update the task with the new scheduled date
        task.scheduledDate = date;
      }
    }
  };

  const handleTaskRemove = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    unscheduleTask(taskId);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={navigateToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={navigateToToday}>Today</Button>
        </div>
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-xl font-bold">Weekly Calendar</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-1 p-2 overflow-auto">
        {daysOfWeek.map((day) => (
          <div key={day.formattedDate} className="flex flex-col h-full">
            <div className="text-center p-2 border-b sticky top-0 bg-card z-10">
              <div className="font-medium">{day.dayName}</div>
              <div className="text-2xl">{day.dayNumber}</div>
              <div className="text-sm text-muted-foreground">{day.month}</div>
            </div>
            
            <div 
              className="flex-1 p-1 overflow-y-auto bg-accent/20"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day.formattedDate)}
            >
              {getScheduledTasks(day.formattedDate).map(task => {
                const taskEl = getTaskById(task.id);
                return (
                  <Card 
                    key={task.id} 
                    className={cn(
                      "mb-2 cursor-pointer hover:shadow-md transition-shadow",
                      taskEl?.completed && "opacity-70"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div className={cn("text-sm font-medium", taskEl?.completed && "line-through")}>
                          {task.title}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 -mt-1 -mr-1 text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleTaskRemove(task.id, e)}
                        >
                          <span className="sr-only">Remove</span>
                          &times;
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
