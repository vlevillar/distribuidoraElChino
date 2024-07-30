import React, { useEffect, useState } from 'react'
import LoginModal from '@/modals/Auth/LoginModal'
import { Avatar, Button } from '@nextui-org/react'
import RegisterModal from '@/modals/Auth/RegisterModal'
import RecoverModal from '@/modals/Auth/RecoverModal'
import OpenRoute from '@/components/Routes/OpenRoute'

export default function Home() {
  const [isLogged, setIsLogged] = useState(false)
  const [userProfile, setUserProfile] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const authEvent = new Event('authStateChanged');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const storedUserId = localStorage.getItem('userId')
    const storedName = localStorage.getItem('name')
    if (storedUsername && storedUserId) {
      setIsLogged(true)
      setUserProfile(storedUsername)
      setUserId(storedUserId)
      setName(storedName || "")
      fetchUserData(storedUserId)
    }
  }, [])

  const handleLogin = (profile: string, newUserId: string, name: string) => {
    setIsLogged(true)
    setUserProfile(profile)
    setUserId(newUserId)
    setName(name)
    localStorage.setItem('username', profile)
    localStorage.setItem('name', name)
    localStorage.setItem('userId', newUserId)
    fetchUserData(newUserId)
    document.dispatchEvent(authEvent);
  }

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.API_URL}/user/${userId}`)
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario')
      }
      const userData = await response.json()
      localStorage.setItem('role', userData.role)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogout = () => {
    setIsLogged(false)
    setUserProfile(null)
    setUserId(null)
    localStorage.removeItem('username')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('openroute')
    localStorage.removeItem('accessToken')
    document.dispatchEvent(authEvent)
  }

  return (
    <div className='flex flex-col items-center justify-around'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <p>Bienvenido!</p>
        {isLogged ? (
          <div className='flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center gap-2'>
              <Avatar showFallback src='https://images.unsplash.com/broken' />
              <div className='flex-col gap-2'>
              <p>{name}</p>
              <p className='text-slate-400'>@{userProfile}</p>
              </div>
            </div>
            <Button color='danger' className='my-2' onPress={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div className='flex justify-between gap-2 py-2 pb-4'>
            <LoginModal onLogin={handleLogin} setUserId={setUserId}/>
            <RegisterModal />
            <RecoverModal />
          </div>
        )}
      </div>
      <div className='w-full'>
        <OpenRoute isLogged={isLogged} userId={userId} />
      </div>
    </div>
  )
}
