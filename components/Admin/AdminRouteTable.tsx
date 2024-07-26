import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react'
import StatusSelect from '../Routes/StatusSelect'
import DelRoute from '@/modals/Routes/DeleteRoute'
import { Trash2 } from 'react-feather'
import AdminRouteModal from './AdminRouteModal'

interface AdminRouteTableProps {
  date: string | null
  userId: string | null
}

interface RouteClient {
  name: string
  type: string
  address: string
  phone: string
  currentAccount: number
  status: string
  _id: string
}

interface Route {
  clients: RouteClient[]
  date: string
  _id: string
}

const AdminRouteTable: React.FC<AdminRouteTableProps> = ({ date, userId }) => {
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const dateFormatted = formatDate(date)
      if (!dateFormatted) {
        console.error('Fecha no válida')
        return
      }

      const routesResponse = await fetch(
        `${process.env.API_URL}/routes?date=${dateFormatted}&userId=${userId}`,
        {
          method: 'GET',
          headers:{'Authorization': `Bearer ${accessToken}`}
        }
      )

      if (routesResponse.ok) {
        const data = await routesResponse.json()
        console.log('Datos obtenidos exitosamente:', data)
        setRouteId(data[0]?._id || '')
        setRoutes(data)
        setDisabled(data[0]?.clients.length !== 0)
      } else {
        console.error('Error al obtener datos:', routesResponse.statusText)
        setDisabled(false)
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
      setDisabled(false)
    }
  }

  useEffect(() => {
    getData()
  }, [date, userId])

  const handleDeleteClient = async (routeId: string, clientId: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(
        `${process.env.API_URL}/routes/${routeId}/${clientId}`,
        {
          method: 'DELETE',
          headers:{'Authorization': `Bearer ${accessToken}`}
        }
      )
      if (response.ok) {
        console.log('Cliente eliminado exitosamente')
        getData()
      } else {
        console.error('Error al eliminar cliente')
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
    }
  }

  const handleDeleteSuccess = () => {
    getData()
    setDisabled(false)
  }

  const handleAddRoute = () => {
    getData()
  }

  return (
    <Table
      topContent={
        <div className='flex justify-center '>
          <p>{date}</p>
        </div>
      }
      bottomContent={
        <div className='flex flex-col gap-2'>
          <AdminRouteModal currentDate={date} onAddRoute={handleAddRoute} userId={userId} routeId={routeId}/>
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
      <TableBody emptyContent='No hay rutas.'>
        {routes.length > 0
          ? routes.flatMap(route =>
              route.clients.map((client: RouteClient) => (
                <TableRow key={client._id}>
                  <TableCell>
                    <Trash2
                      color='red'
                      className='cursor-pointer'
                      onClick={() => handleDeleteClient(route._id, client._id)}
                    />
                  </TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell className='w-4'>
                    <StatusSelect
                      routeId={route._id}
                      clientId={client._id}
                      status={client.status}
                    />
                  </TableCell>
                </TableRow>
              ))
            )
          : []}
      </TableBody>
    </Table>
  )
}

export default AdminRouteTable
