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
  currentDate: string | null
  routeId?: string | null
  disabled?: boolean
  onDeleteSuccess: () => void; 
}

const DelRoute: React.FC<Props> = ({ currentDate, routeId, disabled, onDeleteSuccess }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDeleteRoute = async () => {
    try {
      if (routeId) {
        const response = await fetch(`https://distributor-api.onrender.com/routes/${routeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          console.log('Ruta eliminada exitosamente');
          onClose();
          onDeleteSuccess();
        } else {
          console.error('Error al eliminar la ruta');
        }
      }
    } catch (error) {
      console.error('Error al eliminar la ruta:', error);
    }
  };

  return (
    <>
      {disabled ? (
        <Button
          disabled={disabled}
          onPress={onOpen}
          color='danger'
          startContent={<Trash2 />}
        >
          Borrar Ruta
        </Button>
      ) : (
        <Button disabled={disabled} startContent={<Trash2 />}>
          Borrar Ruta
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} placement='center'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'></ModalHeader>
          <ModalBody className='flex items-center justify-center'>
            ¿Eliminar ruta del: {currentDate}?
          </ModalBody>
          <ModalFooter className='flex items-center justify-center'>
            <Button color='danger' onPress={handleDeleteRoute}>
              <Trash2 />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DelRoute
