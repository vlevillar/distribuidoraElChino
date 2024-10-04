import React, { useMemo, useState } from 'react'
import { Input, Checkbox } from '@nextui-org/react'
import { Search } from 'react-feather'
import OrderAdminItem from '@/components/Admin/OrderAdminItem'

interface Product {
  _id: string
  name: string
  prices: number[]
  quantity: number
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
  userId?: string // Añadido para manejar la asignación
  deliveryDate: string
  description: string
}

interface AddOrdersProps {
  orders?: Order[]
  selectedUserId: string | null
  userOrders: Set<string>
  onOrderAssignmentChange: (orderId: string, isAssigned: boolean) => void
}

export default function AddOrder({ 
  orders = [], 
  selectedUserId, 
  userOrders,
  onOrderAssignmentChange
}: AddOrdersProps) {
  const [searchValue, setSearchValue] = useState("")
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false)

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    return orders.filter(order => 
      order.clientName.toLowerCase().includes(searchValue.toLowerCase()) &&
      (!showOnlyAssigned || userOrders.has(order._id))
    )
  }, [orders, searchValue, showOnlyAssigned, userOrders])

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <Input
        placeholder="Buscar pedido"
        value={searchValue}
        onValueChange={setSearchValue}
        startContent={<Search/>}
        size='sm'
      />
      <Checkbox 
        isSelected={showOnlyAssigned}
        onValueChange={setShowOnlyAssigned}
        disabled={!selectedUserId}
      >
        Mostrar solo pedidos asignados
      </Checkbox>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1 mt-2">
        {filteredOrders.map((order) => (
          <OrderAdminItem 
            key={order._id}
            order={order}
            isAssigned={userOrders.has(order._id)}
            selectedUserId={selectedUserId}
            onAssignmentChange={onOrderAssignmentChange}
          />
        ))}
      </div>
    </div>
  )
}