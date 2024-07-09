import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { Lock, User } from "react-feather";

export default function RegisterModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${process.env.API_URL}/auth/register`, {
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
        setSuccess('Usuario registrado correctamente');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000); // Cerrar el modal después de 2 segundos
      } else if (response.status === 500) {
        setError('Usuario ya registrado');
      } else {
        setError('Error en el registro');
      }
    } catch (error) {
      setError('Error en la solicitud de registro');
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="secondary">Registrarse</Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Registrarse</ModalHeader>
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
                {error &&
                <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <p style={{ color: 'red' }}>{error}</p>
                </div>}
                {success && 
                <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <p style={{ color: 'green' }}>{success}</p>
                </div>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleRegister}>
                  Registrarse
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
