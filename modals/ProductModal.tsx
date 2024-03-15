import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input } from "@nextui-org/react";
import { PlusCircle, Package, DollarSign, Edit } from 'react-feather';

export default function ProductModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="success" startContent={<PlusCircle/>}>Agregar Producto</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Agregar producto</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Nombre"
                  placeholder="Nombre del producto"
                  variant="bordered"
                  endContent={<Edit/>}
                />
                <Input
                  label="Stock"
                  placeholder="0"
                  type="number"
                  variant="bordered"
                  endContent={<Package/>}
                />
                <div className="flex gap-4">
                <Checkbox>Kg</Checkbox>
                <Checkbox>Unidad</Checkbox>
                </div>
                <Input
                  label="Precio"
                  placeholder="0.00"
                  type="number"
                  variant="bordered"
                  endContent={<DollarSign/>}
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
