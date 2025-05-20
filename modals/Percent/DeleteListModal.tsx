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
import { Trash2, X } from 'react-feather'

interface Props {
  percent: number | null
  number: number | null
  index: string | number | undefined
  isLast: boolean
  onDeleteSuccess: Function
}

const DelListModal: React.FC<Props> = ({
  number,
  percent,
  index,
  onDeleteSuccess,
  isLast
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDelete = function () {
    onDeleteSuccess()
  }

  const handleDeleteList = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json' // Especificar el tipo de contenido como JSON
        },
        body: JSON.stringify({ number: number }) // Convertir el objeto a cadena JSON
      })
      if (response.ok) {
        console.log('Ruta eliminada exitosamente')
        onClose()
        handleDelete()
      } else {
        console.error('Error al eliminar la ruta')
      }
    } catch (error) {
      console.error('Error al eliminar la ruta:', error)
    }
  }

  return (
    <>
      <Button onPress={onOpen} key={index} className='w-full'>
        <div className='flex justify-around gap-4'>
          <p>Lista {number}</p>
          <p>{percent}%</p>
        </div>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement='center'>
        {!isLast ? (
          <ModalContent>
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody className='flex items-center justify-center'>
                ¿Eliminar lista numero: {number}?
              </ModalBody>
              <ModalFooter className='flex items-center justify-center'>
                <Button color='danger' onPress={handleDeleteList}>
                  <Trash2 />
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        ) : (
          <ModalContent>
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody className='flex items-center justify-center'>
                No se puede eliminar la unica lista
              </ModalBody>
              <ModalFooter className='flex items-center justify-center'>
                <Button color='danger' onPress={onClose}>
                  <X />
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        )}
      </Modal>
    </>
  )
}

export default DelListModal
