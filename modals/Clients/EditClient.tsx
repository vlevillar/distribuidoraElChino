import React, { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react'
import { Briefcase, Edit, Map, Smartphone } from 'react-feather'

interface Client {
  _id: string
  name: string
  address: string
  phone: string
  type: string
}

const EditClient: React.FC<{ client: Client, fetchData: () => void }> = ({ client, fetchData }) => {
  const { name, address, phone, type, _id } = client
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [nombre, setNombre] = useState(name)
  const [direccion, setDireccion] = useState(address)
  const [telefono, setTelefono] = useState(phone)
  const [tipo, setTipo] = useState(type)

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/clients`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: _id, 
          name: nombre,
          address: direccion,
          phone: telefono,
          type: tipo
        })
      });
      if (response.ok) {
        console.log('Cliente editado exitosamente');
        onClose()
        fetchData()
      } else {
        console.error('Error al editar cliente');
      }
    } catch (error) {
      console.error('Error al editar cliente:', error);
    }
  };

  return (
    <>
      <Button onPress={onOpen} size='sm'>
        Editar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Editar cliente: {name}
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Nombre'
                  placeholder='Nombre del cliente'
                  variant='bordered'
                  endContent={<Edit />}
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
                <Input
                  label='Dirección'
                  placeholder='Dirección del cliente'
                  variant='bordered'
                  endContent={<Map />}
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                />
                <Input
                  label='Telefono'
                  placeholder='Telefono del cliente'
                  variant='bordered'
                  endContent={<Smartphone />}
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
                <Input
                  label='Tipo de negocio'
                  placeholder='Kiosco, despensa, etc...'
                  variant='bordered'
                  endContent={<Briefcase />}
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='success' onPress={handleSubmit}>
                  Listo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditClient
