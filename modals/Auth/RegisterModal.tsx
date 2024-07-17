import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

export default function RegisterModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
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
          name,
          username,
          password
        })
      });

      if (response.status === 201) {
        setSuccess('Usuario registrado correctamente');
        setTimeout(() => {
          setSuccess('');
          setName("")
          setPassword("")
          setUsername("")
          onClose();
        }, 2000);
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
                  label="Nombre y apellido"
                  placeholder="Ingrese su nombre y apellido"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Usuario"
                  placeholder="Ingrese su usuario"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
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
