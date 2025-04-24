import React, { useMemo, useState } from 'react'
import { Input, Checkbox, Pagination, Button } from '@nextui-org/react'
import { Search } from 'react-feather'
import OrderAdminItem from '@/components/Admin/OrderAdminItem'

interface Product {
  _id: string
  name: string
  prices: number[]
  quantity: number
  units?: number
  measurement: string
}

interface Order {
  _id: string
  clientName: string
  clientId: string
  clientNumber: number
  products: Product[]
  discount: string
  selectedList: number
  date: string
  userId?: string // Añadido para manejar la asignación
  deliveryDate: string
  description: string
}

interface AddOrdersProps {
  orders?: Order[]
  page: number
  totalPages: number
  onPageChange: (newPage: number) => void
  searchValue: string
  onSearchChange: (newSearch: string) => void
  selectedUserId: string | null
  userOrders: Set<string>
  onOrderAssignmentChange: (orderId: string, isAssigned: boolean) => void
}

export default function AddOrder({
  orders = [],
  page,
  totalPages,
  onPageChange,
  searchValue,
  onSearchChange,
  selectedUserId,
  userOrders,
  onOrderAssignmentChange
}: AddOrdersProps) {
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false)

  const displayed = React.useMemo(() => {
    return showOnlyAssigned ? orders.filter(o => userOrders.has(o._id)) : orders
  }, [orders, showOnlyAssigned, userOrders])

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Input
        placeholder='Buscar pedido'
        value={searchValue}
        onValueChange={onSearchChange}
        startContent={<Search />}
        size='sm'
      />
      <Checkbox
        isSelected={showOnlyAssigned}
        onValueChange={setShowOnlyAssigned}
        disabled={!selectedUserId}
      >
        Mostrar solo pedidos asignados
      </Checkbox>
      <div className='xs:grid-cols-1 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {displayed.map(order => (
          <OrderAdminItem
            key={order._id}
            order={order}
            isAssigned={userOrders.has(order._id)}
            selectedUserId={selectedUserId}
            onAssignmentChange={onOrderAssignmentChange}
          />
        ))}
      </div>

      <div className='mt-6 flex w-full flex-col items-center gap-2'>
        <Pagination
          page={page}
          total={totalPages}
          onChange={onPageChange}
          color='primary'
        />
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='flat'
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page <= 1}
          >
            Anterior
          </Button>
          <Button
            size='sm'
            variant='flat'
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
