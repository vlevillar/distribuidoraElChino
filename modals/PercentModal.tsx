'use client'
import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react'
import {
  Plus,
  Percent
} from 'react-feather'

export default function PercentModal( { lastNumber, onSuccess}: { lastNumber: number, onSuccess:Function } ) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [percent, setPercent] = useState(0)

  const handlePost = function(){
    
  }

  const createPercent = async () => {
    try {
      const response = await fetch("https://distributor-api.onrender.com/pricesList", {
        method: "POST",
        headers: {
          "admin" : "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percent: percent,

        }),
      });
      if (response.ok) {
        console.log("Cliente creado exitosamente");
        onClose();
      } else {
        console.error("Error al crear cliente");
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color='primary' size='sm'>
        <Plus />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Agregar lista
              </ModalHeader>
              <ModalBody className='items-center'>
                <Input
                  autoFocus
                  variant='bordered'
                  label={'Lista Nº ' + lastNumber}
                  type='number'
                  endContent={<Percent />}
                  onChange={(e) => setPercent(+e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='success' onPress={createPercent}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
