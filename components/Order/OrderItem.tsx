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
import { FileText, Info, Printer } from 'react-feather'
import Link from 'next/link'

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
  date: string
  deliveryDate: string
  description: string
}

interface OrderItemProps {
  order: Order
  fetchData?: () => void
  isAdmin?: boolean
}

export default function OrderItem({
  order,
  fetchData,
  isAdmin
}: OrderItemProps) {
  const totalPrice = order.products.reduce((total, product) => {
    const selectedPrice = product.prices[order.selectedList]
    return total + selectedPrice * product.quantity
  }, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-md'>{order.clientName}</p>
          {order.description ? (
            <Popover placement='bottom'>
              <PopoverTrigger className='cursor-pointer'>
                <Info color='grey' size='20px' />
              </PopoverTrigger>
              <PopoverContent>
                <div className='px-1 py-2'>
                  <div className='text-small font-bold'>Descripción:</div>
                  <div className='text-tiny'>{order.description}</div>
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-small'>
            Fecha de creación: {formatDate(order.date)}
          </p>
          <p className='text-small'>
            Fecha de entrega:{' '}
            {order.deliveryDate ? order.deliveryDate : 'Sin especificar'}
          </p>
          <ViewOrderResume
            orderData={order.products}
            selectedList={order.selectedList}
          />
          <p>Total: ${totalPrice.toFixed(2)}</p>
          {isAdmin && (
            <div className='mt-2 flex justify-around gap-6'>
              <Link
                href={`${process.env.API_URL}/orders/${order._id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Printer className='cursor-pointer' />
              </Link>
              <Link
                href={`${process.env.API_URL}/remits/${order._id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FileText className='cursor-pointer' />
              </Link>
            </div>
          )}
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
}
