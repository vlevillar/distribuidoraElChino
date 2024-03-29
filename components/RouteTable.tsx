import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import RouteModal from '@/modals/RouteModal';
import StatusSelect from './StatusSelect';

interface RouteTableProps {
  date: string | null;
}

const RouteTable: React.FC<RouteTableProps> = ({ date }) => {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    getData();
  }, [date]); 

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const getData = async () => {
    try {
      const dateFormatted = formatDate(date); // Formatear la fecha actual
      const response = await fetch(`https://distributor-api.onrender.com/routes?startDate=${dateFormatted}&endDate=${dateFormatted}`, {
        method: "GET",
      });
      
      if (response.ok) {
        console.log("Datos obtenidos exitosamente");
        const data = await response.json(); 
        setRoutes(data);
      } else {
        console.error("Error al obtener datos");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  return (
    <Table
      topContent={
        <div className='flex justify-center'>
          <p>{date}</p>
        </div>
      }
      bottomContent={<RouteModal currentDate={date} />}
    >
      <TableHeader>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn>DIRECCIÓN</TableColumn>
        <TableColumn>ESTADO</TableColumn>
      </TableHeader>
      <TableBody>
        {routes.map((route, index) => (
          <TableRow key={index}>
            <TableCell>{route.client}</TableCell>
            <TableCell>valpa 10</TableCell>
            <TableCell className='w-4'><StatusSelect/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RouteTable;
