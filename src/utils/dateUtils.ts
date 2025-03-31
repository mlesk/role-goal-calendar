
import { format, startOfWeek, addDays, parse, isValid } from 'date-fns';

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

export const getHoursOfDay = () => {
  // Generate hours from 5am to 8pm
  return Array.from({ length: 16 }).map((_, i) => {
    const hour = i + 5; // Start from 5am
    return {
      hour,
      formattedHour: hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`,
    };
  });
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'MMM d');
};

// Parse a time string like "10am" or "2pm" to get the hour number
export const parseTimeString = (timeString: string): number | null => {
  if (!timeString) return null;
  
  const match = timeString.match(/^(\d+)(am|pm)$/i);
  if (!match) return null;
  
  let hour = parseInt(match[1], 10);
  const isPm = match[2].toLowerCase() === 'pm';
  
  if (isPm && hour !== 12) hour += 12;
  if (!isPm && hour === 12) hour = 0;
  
  return hour;
};
