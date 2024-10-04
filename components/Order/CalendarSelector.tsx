import React, { useEffect, useState } from 'react';
import { Button, Calendar, DateValue, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { Truck } from 'react-feather';

interface CalendarSelectorProps {
  onDateChange: (date: string) => void;
  initialDate?: string;
}

function CalendarSelector({ onDateChange, initialDate }: CalendarSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('Seleccionar fecha de entrega');

  useEffect(() => {
    if (initialDate) {
      setFormattedDate(initialDate);
    }
  }, [initialDate]);

  const handleDateChange = (date: DateValue | null) => {
    setSelectedDate(date);

    if (date && 'day' in date && 'month' in date && 'year' in date) {
      const day = date.day.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const year = date.year.toString();

      const formattedDate = `${day}/${month}/${year}`;
      setFormattedDate(formattedDate);
      onDateChange(formattedDate);
    }
  };

  return (
    <Popover placement='bottom'>
      <PopoverTrigger>
        <Button endContent={<Truck />}>{formattedDate}</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar value={selectedDate} onChange={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
}

export default CalendarSelector;
