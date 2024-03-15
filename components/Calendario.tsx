import React, { useState } from 'react';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';

const Calendario = () => {
  const [startDate, setStartDate] = useState(new Date());

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

  const formatDateString = (date: Date) => {
    const formattedDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    return formattedDate;
  };

  const startOfWeek = new Date(startDate);
  startOfWeek.setDate(startDate.getDate() - startDate.getDay()); // Ir al domingo de la semana actual

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Ir al sábado de la semana actual

  return (
    <div>
      <div className="flex items-center">
        <ArrowLeftCircle className="mr-2 cursor-pointer" onClick={goToPreviousWeek} />
        <div className='border-4 p-1 rounded-md'>
        <h2>{formatDateString(startOfWeek)} - {formatDateString(endOfWeek)}</h2>
        </div>
        <ArrowRightCircle className="ml-2 cursor-pointer" onClick={goToNextWeek} />
      </div>
    </div>
  );
};

export default Calendario;
