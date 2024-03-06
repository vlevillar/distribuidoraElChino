'use client'

import { Button, Card, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import { Edit, Trash } from 'react-feather'

export default function ClientItem() {

    return (
        <Card className="max-w-[300px]">
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col">
                    <p className="text-md">JUAN</p>
                    <p className="text-small text-default-500">TEL:12</p>
                    <p className="text-small text-default-500">Dirección:121212</p>
                </div>
            </CardHeader>
            <Divider />
            <CardFooter className='flex gap-3 justify-center items-center'>
                <Button size='sm'>
                    Editar
                </Button>
                <Button color='secondary' size='sm'>
                    Cuenta corriente
                </Button>
                <Button color='danger' size='sm'>
                    Eliminar
                </Button>
            </CardFooter>
        </Card>
    )
}
