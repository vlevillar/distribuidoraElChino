import React, { useState, useEffect } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';
export interface WeekDates {
  [day: string]: string;
}

interface Props {
  updateWeekDates: (weekDates: WeekDates) => void;
}

const Calendario: React.FC<Props> = ({ updateWeekDates }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startOfWeek, setStartOfWeek] = useState<Date | null>(null);

  useEffect(() => {
    const start = new Date(startDate);
    start.setDate(startDate.getDate() - startDate.getDay()); 
    setStartOfWeek(start); 
    updateWeekDates(generateWeekDates(start));
  }, [startDate]);

  const generateWeekDates = (startOfWeek: Date): WeekDates => {
    const weekDates: WeekDates = {};
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const formattedDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(currentDate);
      weekDates[getDayName(i)] = formattedDate;
    }
    return weekDates;
  };

  const getDayName = (index: number): string => {
    const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    return days[index];
  };

  const formatDateString = (date: Date): string => {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  const goToPreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const goToNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
  };

  return (
    <div>
      <div className="flex items-center">
        <ArrowLeftCircle className="mr-2 cursor-pointer" onClick={goToPreviousWeek} />
        <div className='border-4 p-1 rounded-md'>
          <h2>{startOfWeek ? formatDateString(startOfWeek) : ''} - {formatDateString(new Date(startDate))}</h2>
        </div>
        <ArrowRightCircle className="ml-2 cursor-pointer" onClick={goToNextWeek} />
      </div>
    </div>
  );
};

export default Calendario;
