import React, { useEffect, useState } from 'react';
import LoginModal from '@/modals/LoginModal';
import {
  Avatar,
  Button,
} from '@nextui-org/react';
import RegisterModal from '@/modals/RegisterModal';
import RecoverModal from '@/modals/RecoverModal';
import OpenRoute from '@/components/OpenRoute';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLogged(true);
      setUserProfile(storedUsername);
    }
  }, []);

  const handleLogin = (profile: string) => {
    setIsLogged(true);
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUserProfile(null);
    localStorage.removeItem('username');
  };

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
            <LoginModal onLogin={handleLogin} />
            <RegisterModal/>
            <RecoverModal />
          </div>
        )}
      </div>
      <div className='w-full'>
        <OpenRoute/>
      </div>
    </div>
  );
}
