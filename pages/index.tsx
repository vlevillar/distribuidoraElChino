import React, { useEffect, useState } from 'react'
import LoginModal from '@/modals/LoginModal'
import { Avatar, Button } from '@nextui-org/react'
import RegisterModal from '@/modals/RegisterModal'
import RecoverModal from '@/modals/RecoverModal'
import OpenRoute from '@/components/OpenRoute'

export default function Home() {
  const [isLogged, setIsLogged] = useState(false)
  const [userProfile, setUserProfile] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const storedUserId = localStorage.getItem('userId')
    if (storedUsername && storedUserId) {
      setIsLogged(true)
      setUserProfile(storedUsername)
      setUserId(storedUserId)
      fetchUserData(storedUserId)
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.API_URL}/user/${userId}`)
      if (!response.ok) {
        throw new Error('Error al obtener los datos del usuario')
      }
      const userData = await response.json()
      setSelectedDate(userData.selectedDate)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleLogin = (profile: string, newUserId: string) => {
    setIsLogged(true)
    setUserProfile(profile)
    setUserId(newUserId)
    localStorage.setItem('username', profile)
    localStorage.setItem('userId', newUserId)
    fetchUserData(newUserId)
  }

  const handleLogout = () => {
    setIsLogged(false)
    setUserProfile(null)
    setUserId(null)
    setSelectedDate(null)
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    localStorage.removeItem('openroute')
  }

  return (
    <div className='flex flex-col items-center justify-around'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <p>Bienvenido!</p>
        {isLogged ? (
          <div className='flex flex-col items-center justify-center'>
            <div className='flex items-center justify-center gap-2'>
              <Avatar showFallback src='https://images.unsplash.com/broken' />
              <p>{userProfile}</p>
            </div>
            <Button color='danger' className='my-2' onPress={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div className='flex justify-between gap-2 py-2 pb-4'>
            <LoginModal onLogin={handleLogin} setUserId={setUserId} />
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
