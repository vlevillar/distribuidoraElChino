import CalendarFilter from '@/components/Order/CalendarFilter'
import OrderItem from '@/components/Order/OrderItem'
import OrderModal from '@/modals/Order/OrderModal'
import { Input } from '@nextui-org/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Search } from 'react-feather'
import { DateValue, RangeValue } from '@nextui-org/react'

interface Order {
  _id: string
  clientId: string
  clientName: string
  clientNumber: number
  products: {
    _id: string
    name: string
    prices: number[]
    quantity: number
    units:number
    measurement: string
  }[]
  discount: string
  date: string 
  deliveryDate: string
  documentNumber: number
  type: string
  selectedList: number
  description: string
}

type FilterType = 'creation' | 'delivery'

const Pedidos = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('creation')
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const admin = localStorage.getItem('role')
    setIsAdmin(admin === 'admin')
    if (!accessToken) {
      console.error('No se encontró el token de acceso')
      router.push('/')
      return
    }
    fetchOrders()
  }, [isAdmin])

  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('No se encontró el token de acceso')
        return
      }
      const response = await fetch(isAdmin ? `${process.env.API_URL}/orders/all` : `${process.env.API_URL}/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Error al obtener las órdenes')
      }
    } catch (error) {
      console.error('Error al obtener las órdenes:', error)
    }
  }

  const filteredOrders = orders.filter(order => {
    // Filtrar por nombre de cliente
    const matchesSearch = order.clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const orderDate = new Date(
      selectedFilter === 'creation' ? order.date : order.deliveryDate?.split('/').reverse().join('-') 
    )

    const startDate = dateRange?.start
      ? new Date(dateRange.start.year, dateRange.start.month - 1, dateRange.start.day)
      : null

    const endDate = dateRange?.end
      ? new Date(dateRange.end.year, dateRange.end.month - 1, dateRange.end.day)
      : null

    const matchesDateRange = startDate && endDate
      ? orderDate >= startDate && orderDate <= endDate
      : true

    return matchesSearch && matchesDateRange
  })

  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-col pb-4'>
          <OrderModal onSuccess={fetchOrders} />
        </div>
      <div className='flex justify-between gap-3 pb-4'>
        <div>
          <CalendarFilter
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            setDateRange={setDateRange} 
          />
        </div>
        <Input
          startContent={<Search />}
          type='text'
          placeholder='Buscar pedido por cliente...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='xs:grid-cols-1 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {filteredOrders.map(order => (
          <OrderItem
            key={order._id}
            order={order}
            fetchData={fetchOrders}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default Pedidos
