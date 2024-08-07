import React, { useEffect, useState } from 'react';
import Calendario, { WeekDates } from '@/components/Routes/Calendario';
import { Tab, Tabs } from '@nextui-org/react';
import { useRouter } from 'next/router';
import AdminRouteTable from '@/components/Admin/AdminRouteTable';

interface AddRouteProps {
  selectedUserId: string | null;
}

const AddRoute: React.FC<AddRouteProps> = ({ selectedUserId }) => {
  const [weekDates, setWeekDates] = useState<WeekDates | null>(null);
  const [selectedDate, setSelectedDate] = useState<WeekDates[0] | null>(null);
  const router = useRouter()
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      router.push("/")
      return;
    }
  }, []);

  const updateWeekDates = (weekDates: WeekDates) => {
    setWeekDates(weekDates);
  };

  return (
    <div>
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
            Object.entries(weekDates).map(([day]) => (
              <Tab key={day} title={day} aria-label="Tabs variants"/>
            ))}
        </Tabs>
        <Calendario updateWeekDates={updateWeekDates} />
      </div>
      <AdminRouteTable date={selectedDate} userId={selectedUserId}/>
    </div>
  );
};

export default AddRoute;
