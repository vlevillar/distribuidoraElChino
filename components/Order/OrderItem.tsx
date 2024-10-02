import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'
import DelOrderModal from '@/modals/Order/DeleteOrderModal'
import ViewOrderResume from '@/modals/Order/ViewOrderResume'
import EditOrderModal from '@/modals/Order/EditOrderModal'
import { FileText, Printer } from 'react-feather'
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
  date: string;
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

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{order.clientName}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-small'>Fecha: {order.date.split('T')[0]}</p>
          <ViewOrderResume
            orderData={order.products}
            selectedList={order.selectedList}
          />
          <p>Total: ${totalPrice.toFixed(2)}</p>
          <div className='mt-2 flex justify-around gap-6'>
            <Link
              href={`${process.env.API_URL}/orders/${order._id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Printer className='cursor-pointer' />
            </Link>
            {isAdmin && (
              <Link
                href={`${process.env.API_URL}/remits/${order._id}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <FileText className='cursor-pointer' />
              </Link>
            )}
          </div>
        </div>
      </CardBody>
      {fetchData && isAdmin ? (
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
