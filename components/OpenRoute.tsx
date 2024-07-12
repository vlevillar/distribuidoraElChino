import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import { Unlock } from 'react-feather'
import StatusSelect from './StatusSelect'

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

interface OpenRouteProps {
  isLogged: boolean
  userId: string | null
}

const OpenRoute: React.FC<OpenRouteProps> = ({ isLogged, userId }) => {
  const [routeData, setRouteData] = useState<Route | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLogged && userId) {
        try {
          const response = await fetch(`${process.env.API_URL}/user/${userId}`)
          if (response.ok) {
            const userData = await response.json()
            setDate(userData.selectedDate)
            localStorage.setItem('openRoute', userData.selectedDate)
          } else {
            console.error(
              'Error al obtener datos del usuario:',
              response.statusText
            )
          }
        } catch (error) {
          console.error('Error en la solicitud de datos del usuario:', error)
        }
      } else {
        setDate(null)
        setRouteData(null)
        localStorage.removeItem('openRoute')
      }
    }

    fetchUserData()
  }, [isLogged, userId])

  useEffect(() => {
    if (!date) return

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/routes?date=${date}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.ok) {
          const data: Route[] = await response.json()
          setRouteData(data[0] || null) // Asumiendo que data es un array y solo necesitas el primer elemento
        } else {
          console.error('Error al obtener datos:', response.statusText)
        }
      } catch (error) {
        console.error('Error en la solicitud de datos:', error)
      }
    }

    fetchData()
  }, [date])

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <Table
      isStriped
      aria-label='Tabla de Ruta Abierta'
      topContent={
        <div className='flex items-center justify-center gap-2'>
          <Unlock size={18} /> <p>Ruta abierta: {formatDate(date)}</p>
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Dirección</TableColumn>
        <TableColumn>Teléfono</TableColumn>
        <TableColumn>Estado</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={
          date
            ? 'No hay clientes en la ruta abierta.'
            : 'No hay rutas abiertas.'
        }
      >
        {routeData?.clients.map((client: RouteClient) => (
          <TableRow key={client._id}>
            <TableCell className='w-[25%]'>{client.name}</TableCell>
            <TableCell className='w-[25%]'>{client.address}</TableCell>
            <TableCell className='w-[25%]'>{client.phone}</TableCell>
            <TableCell className='w-[25%]'>
              <StatusSelect
                routeId={routeData._id}
                clientId={client._id}
                status={client.status}
              />
            </TableCell>
          </TableRow>
        )) || []}
      </TableBody>
    </Table>
  )
}

export default OpenRoute
