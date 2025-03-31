import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getDaysOfWeek, getHoursOfDay, parseTimeString } from '../utils/dateUtils';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysOfWeek, setDaysOfWeek] = useState(getDaysOfWeek(currentDate));
  const hoursOfDay = getHoursOfDay();
  const { getScheduledTasks, getTaskById, unscheduleTask, updateTask } = useAppContext();

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

  const handleDrop = (e: React.DragEvent, date: string, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        // Update the task with the new scheduled date and hour
        updateTask(taskId, {
          scheduledDate: date,
          scheduledHour: hour
        });
      }
    }
  };

  const handleTaskRemove = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    unscheduleTask(taskId);
  };

  const getTasksForHour = (date: string, hour: number) => {
    return getScheduledTasks(date).filter(task => {
      const taskHour = task.scheduledHour;
      return taskHour === hour;
    });
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

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-[auto_repeat(7,1fr)] min-h-full">
          {/* Time column */}
          <div className="sticky left-0 z-10 bg-background border-r">
            <div className="h-[50px] border-b"></div> {/* Header spacer */}
            {hoursOfDay.map((hourData) => (
              <div 
                key={hourData.hour} 
                className="h-[100px] flex items-start justify-end pr-2 border-b text-sm text-muted-foreground"
              >
                <div className="mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {hourData.formattedHour}
                </div>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {daysOfWeek.map((day) => (
            <div key={day.formattedDate} className="flex flex-col min-w-[150px]">
              <div className="h-[50px] text-center p-2 border-b sticky top-0 bg-card z-10">
                <div className="font-medium">{day.dayName}</div>
                <div className="flex justify-center items-baseline">
                  <span className="text-xl">{day.dayNumber}</span>
                  <span className="text-xs text-muted-foreground ml-1">{day.month}</span>
                </div>
              </div>
              
              {hoursOfDay.map((hourData) => (
                <div 
                  key={`${day.formattedDate}-${hourData.hour}`}
                  className="h-[100px] border-b border-r p-1 bg-accent/10"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.formattedDate, hourData.hour)}
                >
                  {getTasksForHour(day.formattedDate, hourData.hour).map(task => {
                    const taskEl = getTaskById(task.id);
                    return (
                      <Card 
                        key={task.id} 
                        className={cn(
                          "mb-1 cursor-pointer hover:shadow-md transition-shadow",
                          taskEl?.completed && "opacity-70"
                        )}
                      >
                        <CardContent className="p-2">
                          <div className="flex justify-between items-start">
                            <div className={cn("text-xs font-medium truncate", taskEl?.completed && "line-through")}>
                              {task.title}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-4 w-4 -mt-1 -mr-1 text-muted-foreground hover:text-destructive"
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
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
