import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Tabs, Tab } from "@nextui-org/react";
import { Edit, DollarSign } from 'react-feather';

export default function AccountModal() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="secondary" size="sm">Cuenta corriente</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cuenta corriente: JUAN</ModalHeader>
              <ModalBody className="items-center">
                <Tabs>
                    <Tab title="Cuentas"/>
                    <Tab title="Pago"/>
                    <Tab title="Saldo"/>
                </Tabs>
                <Input
                  autoFocus
                  variant="bordered"
                  endContent={<Edit/>}
                  startContent={<DollarSign/>}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="success" onPress={onClose}>
                  Listo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
