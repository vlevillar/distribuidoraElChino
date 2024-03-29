'use client'

import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import { Edit, Trash } from 'react-feather'

interface ProductItemProps {
    price: string; // Especifica el tipo de la propiedad 'price'
  }

export default function ProductItem( { price }: ProductItemProps ) {

    return (
        <Card className="max-w-[300px]">
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col">
                    <p className="text-md">JAMON</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className='flex items-center'>
                <p>{price}</p>
            </CardBody>
            <Divider />
            <CardFooter className='flex gap-3 justify-center items-center'>
                <Button startContent={<Edit/>}>
                    Editar
                </Button>
                <Button color='danger' startContent={<Trash/>}>
                    Eliminar
                </Button>
            </CardFooter>
        </Card>
    )
}
