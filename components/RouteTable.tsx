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
import DelRoute from '@/modals/DeleteRoute';
interface RouteTableProps {
  date: string | null;
}

const RouteTable: React.FC<RouteTableProps> = ({ date }) => {
  const [routes, setRoutes] = useState<any[]>([]);

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
  
  useEffect(() => {
  const getData = async () => {
    try {
      const dateFormatted = formatDate(date);
      const response = await fetch(`https://distributor-api.onrender.com/routes?startDate=${dateFormatted}&endDate=${dateFormatted}`, {
        method: "GET",
      });
      if (response.ok) {
        console.log("Datos obtenidos exitosamente");
        const data = await response.json(); 
        setRoutes(data);
      } else {
        console.error("Error al obtener datos");
        setRoutes([])
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setRoutes([])
    }
  };
    getData();
  }, [date]); 

  return (
    <Table
      topContent={
        <div className='flex justify-center '>
          <p>{date}</p>
        </div>
      }
      bottomContent={
      <div className='flex flex-col gap-2'>
        <RouteModal currentDate={date} />
        <DelRoute currentDate={date}/>
      </div>}
    >
      <TableHeader>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn>DIRECCIÓN</TableColumn>
        <TableColumn>ESTADO</TableColumn>
      </TableHeader>
      <TableBody>
        {/*@ts-ignore*/}
        {routes ? (routes.clients?.map((route, index) => (
          <TableRow key={index}>
            <TableCell>{route.name}</TableCell>
            <TableCell>{route.address}</TableCell>
            <TableCell className='w-4'><StatusSelect/></TableCell>
          </TableRow>
        ))) : <div></div>}
      </TableBody>
    </Table>
  );
};

export default RouteTable;
