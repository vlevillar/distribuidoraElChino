'use client'

import { Button, Card, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import { Edit, Trash } from 'react-feather'

export default function ProductItem() {

    return (
        <Card className="max-w-[300px]">
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col">
                    <p className="text-md">JAMON</p>
                    <p className="text-small text-default-500">STOCK:12</p>
                    <p className="text-small text-default-500">CODE:121212</p>
                </div>
            </CardHeader>
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
