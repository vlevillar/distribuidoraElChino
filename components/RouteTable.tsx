import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react'
import RouteModal from '@/modals/RouteModal'
import StatusSelect from './StatusSelect'
import DelRoute from '@/modals/DeleteRoute'
import { Trash2 } from 'react-feather'
interface RouteTableProps {
  date: string | null
}

interface Route {
  clients: {
    name: string
    type: string
    address: string
    phone: string
    currentAccount: number
    status: string
    _id: string
  }[]
  date: string
  _id: string
}

const RouteTable: React.FC<RouteTableProps> = ({ date }) => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [disabled, setDisabled] = useState(false)
  const [routeId, setRouteId] = useState('')

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const getData = async () => {
    try {
      const dateFormatted = formatDate(date)
      const response = await fetch(
        `https://distributor-api.onrender.com/routes?startDate=${dateFormatted}&endDate=${dateFormatted}`,
        {
          method: 'GET'
        }
      )
      if (response.ok) {
        console.log('Datos obtenidos exitosamente')
        const data = await response.json()
        setRouteId(data._id)
        setRoutes(data)
        if (data.clients.length !== 0) {
          setDisabled(true)
        } else {
          setDisabled(false)
        }
      } else {
        console.error('Error al obtener datos')
        setRoutes([])
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
      setRoutes([])
    }
  }

  useEffect(() => {
    getData()
  }, [date])
  
  const handleDeleteClient = async (routeId: string, clientId: string) => {
    try {
      const response = await fetch(`https://distributor-api.onrender.com/routes/${routeId}/${clientId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('Cliente eliminado exitosamente');
        getData();
      } else {
        console.error('Error al eliminar cliente');
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const handleDeleteSuccess = () => {
    getData();
    setDisabled(false)
  };

  const handleAddRoute = () => {
    getData();
  };

  return (
    <Table
      topContent={
        <div className='flex justify-center '>
          <p>{date}</p>
        </div>
      }
      bottomContent={
        <div className='flex flex-col gap-2'>
          <RouteModal currentDate={date} onAddRoute={handleAddRoute}/>
          <DelRoute
            currentDate={date}
            routeId={routeId}
            disabled={disabled}
            onDeleteSuccess={handleDeleteSuccess} 
          />
        </div>
      }
    >
      <TableHeader>
        <TableColumn>ELIMINAR</TableColumn>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn>DIRECCIÓN</TableColumn>
        <TableColumn>ESTADO</TableColumn>
      </TableHeader>
      <TableBody>
        {/*@ts-ignore*/}
        {routes ? (routes.clients?.map((route, index) => (
            <TableRow key={index}>
              <TableCell>
                <Trash2 color='red' className='cursor-pointer' onClick={() => handleDeleteClient(routeId, route._id)}/>
              </TableCell>
              <TableCell>{route.name}</TableCell>
              <TableCell>{route.address}</TableCell>
              <TableCell className='w-4'>
                <StatusSelect routeId={routeId} clientId={route._id} status={route.status}/>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <div></div>
        )}
      </TableBody>
    </Table>
  )
}

export default RouteTable
