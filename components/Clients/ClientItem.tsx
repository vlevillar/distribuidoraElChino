import React from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  Divider,
} from '@nextui-org/react'
import AccountModal from '@/modals/Clients/AccountModal'
import EditClient from '@/modals/Clients/EditClient'
import DelClientModal from '@/modals/Clients/DeleteClientModal'

interface Client {
  _id: string
  name: string
  currentAccount: number
  clientNumber: number
  address: string
  phone: string
  type: string
}

interface ClientItemProps {
  client: Client
  fetchData?: () => void
  isAdmin?: boolean;
}

const ClientItem: React.FC<ClientItemProps> = ({ fetchData, client, isAdmin }) => {
  const { name, address, phone, type, _id, currentAccount, clientNumber } =
    client

  return (
    <>
      <Card className='max-w-[300px] text-left'>
        <CardHeader className='flex items-center gap-3'>
          <div className='flex flex-col'>
            <p className='text-md font-bold'>{name}</p>
            <p className='text-small text-default-500'>
              <b>Telefono:</b> {phone}
            </p>
            <p className='text-small text-default-500'>
              <b>Dirección:</b> {address}
            </p>
            <p className='text-small text-default-500'>
              <b>Tipo:</b> {type}
            </p>
            <p className='text-small text-default-500'>
              <b>Numero:</b> {clientNumber}
            </p>
            <p className='text-small text-default-500'>
              <b>Cuenta corriente:</b> ${currentAccount ? currentAccount : 0}{' '}
            </p>
          </div>
        </CardHeader>
        
        {fetchData && isAdmin ? (
          <>
            <Divider />
            <CardFooter className='flex items-center justify-center gap-3'>
              <EditClient client={client} fetchData={fetchData} />
              <AccountModal client={client} fetchData={fetchData} />
              <DelClientModal name={name} id={_id} fetchData={fetchData} />
            </CardFooter>
          </>
        ) : null}
      </Card>
    </>
  )
}

export default ClientItem
