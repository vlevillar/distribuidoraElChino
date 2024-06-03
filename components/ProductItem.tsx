'use client'

import DelProductModal from '@/modals/DeleteProductModal';
import EditProduct from '@/modals/EditProduct';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import { Edit, Trash } from 'react-feather'

interface ProductItemProps {
    id: string;
    price: string;
    name: string;
    fetchData: () => void
  }
  
export default function ProductItem( { price, name, id, fetchData }: ProductItemProps ) {
    const product = { _id: id, name, price }
    return (
        <Card className="max-w-[300px]">
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col">
                    <p className="text-md">{name}</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className='flex items-center'>
                <p>${price}</p>
            </CardBody>
            <Divider />
            <CardFooter className='flex gap-3 justify-center items-center'>
                <EditProduct  product={product} fetchData={fetchData}/>
                <DelProductModal name={name} id={id} fetchData={fetchData}/>
            </CardFooter>
        </Card>
    )
}
