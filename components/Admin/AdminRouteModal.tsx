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
import SearchClient from '@/components/Clients/SearchClient'

interface Props {
  currentDate: string | null
  onAddRoute: () => void; 
  userId: string | null
  routeId: string | null
}

interface Client {
  _id: string
  name: string
  address: string
  type: string
  phone: string
}

const AdminRouteModal: React.FC<Props> = ({ currentDate, onAddRoute, userId, routeId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedClients, setSelectedClients] = useState<Client[]>([])  
 
  const convertDateFormat = (dateString : string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const formattedDate = currentDate ? convertDateFormat(currentDate) : null;

  
  const crearCliente = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      
      const createResponse = await fetch(
        `${process.env.API_URL}/routes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            clients: selectedClients,
            date: formattedDate
          })
        }
      )

      if (createResponse.ok) {
        const newRoute = await createResponse.json();
        console.log('Ruta creada exitosamente');

        if (userId) {
          const assignResponse = await fetch(
            `${process.env.API_URL}/routes/assign/${newRoute._id}/${userId}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                date: formattedDate
              })
            }
          )

          if (assignResponse.ok) {
            console.log('Ruta asignada exitosamente');
          } else {
            console.error('Error al asignar ruta');
          }
        }

        onClose()
        onAddRoute()
      } else {
        console.error('Error al crear ruta')
      }
    } catch (error) {
      console.error('Error al crear o asignar ruta:', error)
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

export default AdminRouteModal
