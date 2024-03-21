import React, { useState } from 'react';
import Calendario, { WeekDates } from '@/components/Calendario';
import RouteTable from '@/components/RouteTable';
import { Tab, Tabs } from '@nextui-org/react';

const Rutas = () => {
  const [weekDates, setWeekDates] = useState<WeekDates | null>(null);
  const [selectedDate, setSelectedDate] = useState<WeekDates[0] | null>(null);

  console.log(selectedDate);

  const updateWeekDates = (weekDates: WeekDates) => {
    setWeekDates(weekDates);
  };

  return (
    <>
      <div className='flex flex-col justify-between p-4 md:flex-row'>
        <Tabs
          variant="underlined"
          aria-label="Tabs variants"
          onSelectionChange={(key) => {
            const date = weekDates && weekDates[key];
            setSelectedDate(date);
          }}
        >
          {weekDates &&
            Object.entries(weekDates).map(([day, date]) => (
              <Tab key={day} title={day} />
            ))}
        </Tabs>
        <Calendario updateWeekDates={updateWeekDates} />
      </div>
      <RouteTable date={selectedDate}/>
    </>
  );
};

export default Rutas;
