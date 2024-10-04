import React from 'react'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react'
import DelOrderModal from '@/modals/Order/DeleteOrderModal'
import ViewOrderResume from '@/modals/Order/ViewOrderResume'
import EditOrderModal from '@/modals/Order/EditOrderModal'

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
  deliveryDate: string
  description: string
}

interface OrderAdminItemProps {
  order: Order
  fetchData?: () => void
  isAssigned: boolean
  selectedUserId: string | null
  onAssignmentChange: (orderId: string, isAssigned: boolean) => void
}

export default function OrderAdminItem({ 
  order, 
  fetchData, 
  isAssigned,
  selectedUserId,
  onAssignmentChange 
}: OrderAdminItemProps) {
  const totalPrice = order.products.reduce((total, product) => {
    const selectedPrice = product.prices[order.selectedList]
    return total + selectedPrice * product.quantity
  }, 0)

  const handleAssignmentChange = async () => {
    if (selectedUserId) {
      const accessToken = localStorage.getItem('accessToken')
      try {
        const endpoint = isAssigned
          ? `${process.env.API_URL}/orders/unassign/${order._id}/${selectedUserId}`
          : `${process.env.API_URL}/orders/assign/${order._id}/${selectedUserId}`

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        onAssignmentChange(order._id, !isAssigned)
      } catch (error) {
        console.error("Error assigning/unassigning order:", error)
      }
    }
  }

  const content = (
    <PopoverContent>
      <div className='px-1 py-2'>
        <div className='text-small font-bold'>Seleccione un usuario para aplicar pedido</div>
      </div>
    </PopoverContent>
  )


  const cardContent = (
    <Card className={`max-w-[300px] ${isAssigned ? 'bg-green-800' : ''}`} isPressable={!!selectedUserId} onPress={handleAssignmentChange}>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{order.clientName}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex flex-col items-center justify-center'>
          <ViewOrderResume
            orderData={order.products}
            selectedList={order.selectedList}
          />
          <p>Total: ${totalPrice.toFixed(2)}</p>
        </div>
      </CardBody>
      {fetchData ? (
        <>
          <Divider />
          <CardFooter className='flex items-center justify-center gap-3'>
            <EditOrderModal order={order} onSuccess={fetchData} />
            <DelOrderModal
              name={order.clientName}
              id={order._id}
              fetchData={fetchData}
            />
          </CardFooter>
        </>
      ) : null}
    </Card>
  )

  return (
    <>
      {!selectedUserId ? (
        <Popover backdrop='opaque'>
          <PopoverTrigger>{cardContent}</PopoverTrigger>
          {content}
        </Popover>
      ) : (
        cardContent
      )}
    </>
  )
}