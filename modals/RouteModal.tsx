import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react'
import { PlusCircle } from 'react-feather'
import SearchClient from '@/components/SearchClient'

interface Props {
  currentDate: string | null
}
interface Client {
  id: number
  name: string
  address: string
  type: string
  phone: string
}

const RouteModal: React.FC<Props> = ({ currentDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedClients, setSelectedClients] = useState<Client[]>([])  
 
  const convertDateFormat = (dateString : string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = currentDate ? convertDateFormat(currentDate) : null;

  const crearCliente = async () => {
    try {
      const response = await fetch(
        'https://distributor-api.onrender.com/routes',
        {
          method: 'POST',
          headers: {
            admin: 'true',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            clients: selectedClients,
            date: formattedDate
          })
        }
      )
      if (response.ok) {
        console.log('Cliente creado exitosamente')
        onClose()
      } else {
        console.error('Error al crear cliente')
      }
    } catch (error) {
      console.error('Error al crear cliente:', error)
    }
  }

  const handleSelectedClientsChange = (clients: Client[]) => {
    setSelectedClients(clients)
  }

  return (
    <>
      <Button onPress={onOpen} color='primary' startContent={<PlusCircle />}>
        Agregar Cliente
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement='top-center'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Agregar cliente
          </ModalHeader>
          <ModalBody>
            <SearchClient
              onSelectedClientsChange={handleSelectedClientsChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='flat' onPress={onClose}>
              Cerrar
            </Button>
            <Button color='success' onPress={crearCliente}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default RouteModal
