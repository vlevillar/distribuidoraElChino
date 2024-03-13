'use client'

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'
import AccountModal from '@/modals/AccountModal'

export default function OrderItem() {
  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>JUAN</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='flex items-center justify-center flex-col'>
            <p className='underline cursor-pointer'>24 articulos</p>
            <p>$$$</p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className='flex items-center justify-center gap-3'>
        <Button size='sm'>Editar</Button>
        <Button color='danger' size='sm'>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
