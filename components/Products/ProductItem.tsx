import DelProductModal from '@/modals/Products/DeleteProductModal';
import EditProduct from '@/modals/Products/EditProduct';
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'

interface ProductItemProps {
    id: string;
    price: string;
    name: string;
    fetchData: () => void;
    isAdmin: boolean;
  }
  
export default function ProductItem( { price, name, id, fetchData, isAdmin }: ProductItemProps ) {
    const product = { _id: id, name, price }
    console.log('esadmin', isAdmin);
    
    return (
        <Card className="max-w-[300px]">
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col">
                    <p className="text-md">{name}</p>
                </div>
            </CardHeader>
            <Divider />
            {isAdmin &&
                <CardBody className='flex items-center'>
                    <p>${price}</p>
                </CardBody>
            }
            <Divider />
            <CardFooter className='flex gap-3 justify-center items-center'>
                {isAdmin &&
                    <EditProduct  product={product} fetchData={fetchData}/>
                }
                <DelProductModal name={name} id={id} fetchData={fetchData}/>
            </CardFooter>
        </Card>
    )
}
