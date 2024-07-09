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

const OpenRoute: React.FC = () => {
  const [routeData, setRouteData] = useState<Route | null>(null)
  const [date, setDate] = useState<string | null>(null)

  useEffect(() => {
    const storedRoute = localStorage.getItem('openRoute')
    if (storedRoute) {
      setDate(storedRoute)
    }
  }, [])

  const formatDate = (dateString: string | null): string | null => {
    if (!dateString) return null
    const [day, month, year] = dateString.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  useEffect(() => {
    if (!date) return

    const dateFormatted = formatDate(date)
    console.log(dateFormatted)

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/routes?date=${dateFormatted}`,
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

  return (
    <Table
      isStriped
      aria-label='Tabla de Ruta Abierta'
      topContent={
        <div className='flex items-center justify-center gap-2'>
          <Unlock size={18} /> <p>Ruta abierta: {date}</p>
        </div>
      }
    >
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Dirección</TableColumn>
        <TableColumn>Teléfono</TableColumn>
        <TableColumn>Estado</TableColumn>
      </TableHeader>
      <TableBody emptyContent='No hay rutas abiertas.'>
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
