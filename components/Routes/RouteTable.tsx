import React, { useEffect, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@nextui-org/react'
import RouteModal from '@/modals/Routes/RouteModal'
import StatusSelect from './StatusSelect'
import DelRoute from '@/modals/Routes/DeleteRoute'
import { Lock, Trash2 } from 'react-feather'

interface RouteTableProps {
  date: string | null
  isAdmin: boolean
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

const RouteTable: React.FC<RouteTableProps> = ({ date, isAdmin }) => {
  const [routes, setRoutes] = useState<Route[]>([])
  const [disabled, setDisabled] = useState(false)
  const [routeId, setRouteId] = useState('')
  const [username, setUsername] = useState<string | null>(null)
  const [isOpenRoute, setIsOpenRoute] = useState<boolean | null>(null)

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
        `${process.env.API_URL}/routes?date=${dateFormatted}`,
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

      const userId = localStorage.getItem('userId')
      if (userId) {
        const userResponse = await fetch(
          `${process.env.API_URL}/user/${userId}`
        )
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setIsOpenRoute(userData.selectedDate === dateFormatted)
          localStorage.setItem('openRoute', userData.selectedDate || '')
        } else {
          console.error(
            'Error al obtener datos del usuario:',
            userResponse.statusText
          )
        }
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
      setDisabled(false)
    }
  }

  useEffect(() => {
    getData()
    const storedUsername = localStorage.getItem('username')
    setUsername(storedUsername)
  }, [date])

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

  const handleOpenRoute = async () => {
    try {
      const dateFormatted = formatDate(date)
      if (!dateFormatted) {
        console.error('Fecha no válida para abrir la ruta')
        return
      }

      const response = await fetch(
        `${process.env.API_URL}/user/${username}/selectedDate`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            selectedDate: dateFormatted
          })
        }
      )

      if (response.ok) {
        console.log('Ruta abierta exitosamente')
        localStorage.setItem('openRoute', dateFormatted)
        setIsOpenRoute(true)
      } else {
        console.error('Error al abrir ruta:', response.statusText)
      }
    } catch (error) {
      console.error('Error al abrir ruta:', error)
    }
  }

  const handleCloseRoute = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(
        `${process.env.API_URL}/user/${username}/selectedDate`,
        {
          method: 'DELETE',
          headers:{'Authorization': `Bearer ${accessToken}`}
        }
      )
      if (response.ok) {
        console.log('Ruta cerrada exitosamente')
        localStorage.removeItem('openRoute')
        setIsOpenRoute(false)
      } else {
        console.error('Error al cerrar ruta')
      }
    } catch (error) {
      console.error('Error al cerrar ruta:', error)
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
          {isAdmin &&
          <>
          <RouteModal currentDate={date} onAddRoute={handleAddRoute} />
          <DelRoute
            currentDate={date}
            routeId={routeId}
            disabled={disabled}
            onDeleteSuccess={handleDeleteSuccess}
          />
          </>
      }
          {username ? (
            isOpenRoute ? (
              <Button
                color='danger'
                onClick={handleCloseRoute}
                startContent={<Lock size={'22'} />}
              >
                Cerrar Ruta
              </Button>
            ) : (
              <Button
                color='success'
                onClick={handleOpenRoute}
                startContent={<Lock size={'22'} />}
              >
                Abrir Ruta
              </Button>
            )
          ) : (
            <div className='flex items-center justify-center'>
              <p style={{ color: 'red' }}>
                Usuario no encontrado, inicie sesión
              </p>
            </div>
          )}
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

export default RouteTable
