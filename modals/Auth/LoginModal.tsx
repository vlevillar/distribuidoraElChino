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
import { Lock, User } from 'react-feather'

interface LoginModalProps {
  onLogin: (username: string, userId: string) => void
  setUserId: (id: string) => void
}

export default function LoginModal({ onLogin, setUserId }: LoginModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    try {
      const loginResponse = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      if (loginResponse.status === 201) {
        const loginData = await loginResponse.json()
        const accessToken = loginData.access_token

        const profileResponse = await fetch(
          `${process.env.API_URL}/auth/profile`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        )

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          console.log(profileData)
          setUserId(profileData.id)
          localStorage.setItem('userId', profileData.id)
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('username', profileData.username)
          onLogin(profileData.username, profileData.id)
          onClose()
        } else {
          console.error(
            'Error al obtener el perfil:',
            profileResponse.statusText
          )
        }
      } else {
        setError('Usuario o contraseña incorrectos')
        console.error('Error al iniciar sesión:', loginResponse.statusText)
      }
    } catch (error) {
      setError('Error en la solicitud de inicio de sesión')
      console.error('Error en la solicitud de inicio de sesión:', error)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <>
      <Button onPress={onOpen} color='primary'>
        Ingresar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Ingresar
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={
                    <User className='pointer-events-none flex-shrink-0 text-2xl text-default-400' />
                  }
                  label='Usuario'
                  placeholder='Ingrese su usuario'
                  variant='bordered'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <Input
                  endContent={
                    <Lock className='pointer-events-none flex-shrink-0 text-2xl text-default-400' />
                  }
                  label='Contraseña'
                  placeholder='Ingrese su contraseña'
                  type='password'
                  variant='bordered'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <p style={{ color: 'red' }}>{error}</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={() => {
                    onClose()
                    clearError()
                  }}
                >
                  Cerrar
                </Button>
                <Button color='primary' onPress={handleLogin}>
                  Iniciar sesión
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
