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
import { PlusCircle, Edit, Map, Smartphone } from "react-feather";

interface Props {
  currentDate: string | null;
}

const RouteModal: React.FC<Props> = ({ currentDate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const crearCliente = async () => {
    try {
      const response = await fetch("https://distributor-api.onrender.com/clients", {
        method: "POST",
        headers: {
          "admin" : "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nombre,
          address: direccion,
          phone: telefono
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
      <Button onPress={onOpen} color="primary" startContent={<PlusCircle />}>
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

export default RouteModal;