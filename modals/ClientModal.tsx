import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { PlusCircle, Edit, Map, Smartphone, Briefcase } from "react-feather";

interface ClientModalProps {
  onClientCreated: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ onClientCreated }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("");

  const crearCliente = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/clients`, {
        method: "POST",
        headers: {
          "admin": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          address: direccion,
          phone: telefono,
          type: tipo,
        }),
      });
      if (response.ok) {
        console.log("Cliente creado exitosamente");
        onClientCreated();
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
      <Button onPress={onOpen} color="success" startContent={<PlusCircle />}>
        Agregar Cliente
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Agregar cliente
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Nombre"
              placeholder="Nombre del cliente"
              variant="bordered"
              endContent={<Edit />}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <Input
              label="Dirección"
              placeholder="Dirección del cliente"
              variant="bordered"
              endContent={<Map />}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <Input
              label="Telefono"
              placeholder="Telefono del cliente"
              variant="bordered"
              endContent={<Smartphone />}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <Input
              label="Tipo de negocio"
              placeholder="Kiosco, despensa, etc..."
              variant="bordered"
              endContent={<Briefcase />}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cerrar
            </Button>
            <Button color="success" onPress={crearCliente}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ClientModal;