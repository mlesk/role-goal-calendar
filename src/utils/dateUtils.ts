
import { format, startOfWeek, addDays } from 'date-fns';

export const getDaysOfWeek = (date: Date = new Date()) => {
  // Start the week on Saturday
  const startDate = startOfWeek(date, { weekStartsOn: 6 });
  
  // Generate an array of 7 days starting from Saturday
  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(startDate, i);
    return {
      date: day,
      formattedDate: format(day, 'yyyy-MM-dd'),
      dayName: format(day, 'EEEE'),
      dayNumber: format(day, 'd'),
      month: format(day, 'MMM')
    };
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'MMM d');
};
