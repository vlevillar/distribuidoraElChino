import CalendarFilter from '@/components/Order/CalendarFilter'
import OrderItem from '@/components/Order/OrderItem'
import OrderModal from '@/modals/Order/OrderModal'
import { Button, Input, Pagination } from '@nextui-org/react'
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
    units?: number
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
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('creation')
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>()
  const [isAdmin, setIsAdmin] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)

  // 1) Al montar: validar token y rol
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/')
      return
    }
    setIsAdmin(localStorage.getItem('role') === 'admin')
  }, [router])

  // reset de página al buscar
  useEffect(() => {
    setPage(1)
  }, [searchTerm, dateRange])

  // dispara la carga cada vez que cambie page, isAdmin, searchTerm, dateRange o selectedFilter
  useEffect(() => {
    const endpoint = isAdmin ? 'orders/all' : 'orders'
    loadOrders(page, endpoint, searchTerm)
  }, [page, isAdmin, searchTerm, dateRange, selectedFilter])

  const loadOrders = async (
    pageNumber = 1,
    endpoint: 'orders' | 'orders/all' = 'orders',
    search = ''
  ) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    let url =
      `${process.env.API_URL}/${endpoint}` +
      `?page=${pageNumber}&limit=${limit}` +
      (search ? `&search=${encodeURIComponent(search)}` : '')

    if (dateRange?.start) {
      url += `&startDate=${dateRange.start.year}-${dateRange.start.month.toString().padStart(2, '0')}-${dateRange.start.day.toString().padStart(2, '0')}`
    }

    if (dateRange?.end) {
      url += `&endDate=${dateRange.end.year}-${dateRange.end.month.toString().padStart(2, '0')}-${dateRange.end.day.toString().padStart(2, '0')}`
    }

    url += `&dateField=${selectedFilter}`

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error('Error al obtener las órdenes')

    const json = await res.json()

    let data: Order[] = []
    let tp = 1
    if (Array.isArray(json)) {
      data = json
      tp = Math.ceil(json.length / limit)
    } else {
      data = json.data ?? []
      tp = json.totalPages ?? 1
    }
    setOrders(data)
    setTotalPages(tp)
  }

  return (
    <div className='flex flex-col items-center py-4'>
      {/* Modal para crear */}
      <div className='pb-4'>
        <OrderModal
          onSuccess={() => {
            setSearchTerm('') // Limpia el filtro de búsqueda
            setDateRange(undefined) // (opcional, si querés resetear filtros de fecha también)
            setPage(1) // Vuelve a la primera página
          }}
        />
      </div>

      {/* Filtros y búsqueda */}
      <div className='flex w-[50%] justify-between gap-3 pb-4'>
        <CalendarFilter
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          setDateRange={setDateRange}
        />
        <Input
          startContent={<Search />}
          placeholder='Buscar pedido por cliente...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de órdenes */}
      <div className='xs:grid-cols-1 grid w-full gap-4 sm:grid-cols-3 md:grid-cols-5'>
        {orders.map(order => (
          <OrderItem
            key={order._id}
            order={order}
            fetchData={loadOrders}
            isAdmin={isAdmin}
            setPage={setPage}
          />
        ))}
      </div>

      {/* Controles de Paginación */}
      <div className='mt-6 flex w-full flex-col items-center gap-2'>
        <Pagination
          page={page}
          total={totalPages}
          onChange={p => setPage(p)}
          color='primary'
        />
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='flat'
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <Button
            size='sm'
            variant='flat'
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Pedidos
