import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { Lock, User } from "react-feather";

export default function RecoverModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRecover = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${process.env.API_URL}/auth/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (response.status === 201) {
        setSuccess('Contraseña actualizada correctamente');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000); // Cerrar el modal después de 2 segundos
      } else if (response.status === 500) {
        setError('Usuario no encontrado');
      } else {
        setError('Error en la operación');
      }
    } catch (error) {
      setError('Error en la solicitud de recupero');
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="default">Recuperar</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cambiar</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Usuario"
                  placeholder="Ingrese su usuario"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  endContent={
                    <Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Contraseña"
                  placeholder="Ingrese su contraseña"
                  type="password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleRecover}>
                  Cambiar Contraseña
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
