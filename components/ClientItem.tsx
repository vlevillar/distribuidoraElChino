import React from 'react'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'
import AccountModal from '@/modals/AccountModal'
import EditClient from '@/modals/EditClient'
import DelClientModal from '@/modals/DeleteClientModal'

interface Client {
  _id: string
  name: string
  address: string
  phone: string
  type: string
}

const ClientItem: React.FC<{ client: Client; fetchData: () => void }> = ({
  client,
  fetchData
}) => {
  const { name, address, phone, type, _id } = client

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{name}</p>
          <p className='text-small text-default-500'>Telefono: {phone}</p>
          <p className='text-small text-default-500'>Dirección: {address}</p>
          <p className='text-small text-default-500'>Tipo: {type}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardFooter className='flex items-center justify-center gap-3'>
        <EditClient client={client} fetchData={fetchData} />
        <AccountModal />
        <DelClientModal name={name} id={_id} fetchData={fetchData} />
      </CardFooter>
    </Card>
  )
}

export default ClientItem
