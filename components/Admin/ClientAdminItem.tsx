import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@nextui-org/react'

interface Client {
  _id: string
  name: string
  currentAccount: number
  clientNumber: number
  address: string
  phone: string
  type: string
}

interface ClientAdminItemProps {
  client: Client
  selectedUserId: string | null
  isAdminPanel?: boolean
  isAssigned: boolean
  onAssignmentChange: (clientId: string, isAssigned: boolean) => void
}

const ClientAdminItem: React.FC<ClientAdminItemProps> = ({
  client,
  selectedUserId,
  isAdminPanel,
  isAssigned: initialIsAssigned,
  onAssignmentChange
}) => {
  const [isAssigned, setIsAssigned] = useState(initialIsAssigned)
  const { name, address, phone, type, _id, currentAccount, clientNumber } = client;

  useEffect(() => {
    setIsAssigned(initialIsAssigned)
  }, [initialIsAssigned])

  const handleClick = async () => {
    if (isAdminPanel && selectedUserId) {
      const accessToken = localStorage.getItem('accessToken')
      try {
        const endpoint = isAssigned 
          ? `${process.env.API_URL}/clients/unassign/${_id}/${selectedUserId}`
          : `${process.env.API_URL}/clients/assign/${_id}/${selectedUserId}`

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const newAssignedState = !isAssigned
        setIsAssigned(newAssignedState)
        onAssignmentChange(_id, newAssignedState)
      } catch (error) {
        console.error("Error assigning/unassigning client:", error)
      }
    }
  }


  const content = (
    <PopoverContent>
      <div className='px-1 py-2'>
        <div className='text-small font-bold'>Seleccione un usuario para aplicar cliente</div>
      </div>
    </PopoverContent>
  )

  const cardContent = (
    <Card
      className={`max-w-[300px] text-left ${isAssigned ? 'bg-green-800' : ''}`}
      isPressable={!!selectedUserId}
      onPress={handleClick}
    >
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
    </Card>
  )

  return (
    <>
      {!selectedUserId ? (
        <Popover backdrop='opaque'>
          <PopoverTrigger>{cardContent}</PopoverTrigger>
          {content}
        </Popover>
      ) : (
        cardContent
      )}
    </>
  )
}

export default ClientAdminItem