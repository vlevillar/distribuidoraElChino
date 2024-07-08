import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react';
import DelOrderModal from '@/modals/DeleteOrderModal';
import ViewOrderResume from '@/modals/ViewOrderResume';
import EditOrderModal from '@/modals/EditOrderModal';

interface OrderItemProps {
  order: {
    _id: string;
    clientName: string;
    clientId: string;
    clientNumber: number;
    products: {
      _id: string;
      name: string;
      prices: number[];
      quantity: number;
      measurement: string;
    }[];
    discount: string;
  };
  fetchData: () => void;
}

export default function OrderItem({ order, fetchData }: OrderItemProps) {
  const totalItems = order.products.length;
  const totalPrice = order.products.reduce((total, product) => {
    const selectedPrice = product.prices[0];
    return total + selectedPrice * product.quantity;
  }, 0);

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{order.clientName}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex items-center justify-center flex-col'>
          <ViewOrderResume orderData={order.products}/>
          <p>Total: ${totalPrice.toFixed(2)}</p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className='flex items-center justify-center gap-3'>
        <EditOrderModal order={order} onSuccess={fetchData} />
        <DelOrderModal 
          name={order.clientName} 
          id={order._id} 
          fetchData={fetchData}
        />
      </CardFooter>
    </Card>
  );
}
