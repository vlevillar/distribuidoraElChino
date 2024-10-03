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
}
interface Client {
  _id: string
  name: string
  address: string
  type: string
  phone: string
}

const RouteModal: React.FC<Props> = ({ currentDate, onAddRoute }) => {
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
  
      // Ensure clients is an array and not empty
      if (!Array.isArray(selectedClients) || selectedClients.length === 0) {
        console.error('La lista de clientes está vacía o no es un array válido');
        return;
      }
  
      // Format the date to ISO 8601
      const isoDate = formattedDate ? new Date(formattedDate).toISOString() : null;
      if (!isoDate) {
        console.error('Fecha inválida');
        return;
      }
  
      const payload = {
        clients: selectedClients,
        date: isoDate
      };
  
      console.log('Payload being sent:', payload); // Log the payload for debugging
  
      const response = await fetch(
        `${process.env.API_URL}/routes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json' // Add this line
          },
          body: JSON.stringify(payload)
        }
      );
  
      if (response.ok) {
        console.log('Ruta creada exitosamente');
        onClose();
        onAddRoute();
      } else {
        const errorData = await response.json();
        console.error('Error al crear ruta:', errorData);
      }
    } catch (error) {
      console.error('Error al crear ruta:', error);
    }
  }

  const handleSelectedClientsChange = (clients: Client[]) => {
    setSelectedClients(clients)
  }

  console.log(selectedClients);
  

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
