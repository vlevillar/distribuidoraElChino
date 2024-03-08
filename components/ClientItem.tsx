'use client'

import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'
import AccountModal from '@/modals/AccountModal'

export default function ClientItem() {
  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>JUAN</p>
          <p className='text-small text-default-500'>TEL:12</p>
          <p className='text-small text-default-500'>Dirección:121212</p>
        </div>
      </CardHeader>
      <Divider />
      <CardFooter className='flex items-center justify-center gap-3'>
        <Button size='sm'>Editar</Button>
        <AccountModal />
        <Button color='danger' size='sm'>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
