import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
} from '@nextui-org/react'
import { PlusCircle, DollarSign, Edit } from 'react-feather'

export default function ProductModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isKilogramChecked, setIsKilogramChecked] = useState(false)
  const [isUnitChecked, setIsUnitChecked] = useState(false)
  const [price, setPrice] = useState('')

  const determineMeasurement = () => {
    if (isKilogramChecked) {
      return 'kilogram'
    } else if (isUnitChecked) {
      return 'unit'
    } else {
      return ''
    }
  }

  const createProduct = async () => {
    try {
      const response = await fetch(
        'https://distributor-api.onrender.com/products',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            code: code,
            measurement: determineMeasurement(),
            price: price
          })
        }
      )
      if (response.ok) {
        console.log('Producto creado exitosamente')
        onClose()
      } else {
        console.error('Error al crear Producto')
      }
    } catch (error) {
      console.error('Error al crear Producto:', error)
    }
  }

  return (
    <>
      <Button onClick={onOpen} color='success' startContent={<PlusCircle />}>
        Agregar Producto
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement='top-center'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Agregar producto
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label='Nombre'
              placeholder='Nombre del producto'
              variant='bordered'
              endContent={<Edit />}
              onChange={e => setName(e.target.value)}
            />
            <Input
              autoFocus
              label='Codigo'
              placeholder='Codigo del producto'
              variant='bordered'
              endContent={<Edit />}
              onChange={e => setCode(e.target.value)}
            />
            <div className='flex gap-4'>
              <Checkbox
                checked={isKilogramChecked}
                onChange={() => setIsKilogramChecked(!isKilogramChecked)}
                isDisabled={isUnitChecked}
              >
                Kg
              </Checkbox>
              <Checkbox
                checked={isUnitChecked}
                onChange={() => setIsUnitChecked(!isUnitChecked)}
                isDisabled={isKilogramChecked}
              >
                Unidad
              </Checkbox>
            </div>
            <Input
              label='Precio'
              placeholder='0.00'
              type='number'
              variant='bordered'
              endContent={<DollarSign />}
              onChange={e => setPrice(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='flat' onClick={onClose}>
              Cerrar
            </Button>
            <Button color='success' onClick={createProduct}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
