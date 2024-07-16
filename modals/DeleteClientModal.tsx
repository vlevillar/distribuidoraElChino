import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@nextui-org/react'
import { Trash2 } from 'react-feather'

interface Props {
  name: string
  id: string 
  fetchData: () => void
}

const DelClientModal: React.FC<Props> = ({ name, id, fetchData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDeleteClient = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(
        `${process.env.API_URL}/clients/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );
      if (response.ok) {
        console.log('Cliente eliminado exitosamente');
        onClose();
        fetchData()
      } else {
        console.error('Error al eliminar el cliente');
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };
  
  return (
    <>
      <Button onPress={onOpen} size='sm' color='danger'>
        Eliminar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement='center'>
        <ModalContent>
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody className='flex items-center justify-center'>
                ¿Eliminar a {name}?
              </ModalBody>
              <ModalFooter className='flex items-center justify-center'>
                <Button color='danger' onPress={handleDeleteClient}>
                  <Trash2 />
                </Button>
              </ModalFooter>
            </>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DelClientModal
