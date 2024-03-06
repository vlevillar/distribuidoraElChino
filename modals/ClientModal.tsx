import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { PlusCircle, Edit, Map, Smartphone } from 'react-feather';

export default function ClientModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="success" startContent={<PlusCircle/>}>Agregar Cliente</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar cliente</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Nombre del cliente"
                  variant="bordered"
                  endContent={<Edit/>}
                />
                <Input
                  label="Dirección"
                  placeholder="Dirección del cliente"
                  variant="bordered"
                  endContent={<Map/>}
                />
                <Input
                  label="Telefono"
                  placeholder="Telefono del cliente"
                  variant="bordered"
                  endContent={<Smartphone/>}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="success" onPress={onClose}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
