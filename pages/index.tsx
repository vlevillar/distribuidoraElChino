import React, { useState } from 'react';
import LoginModal from '@/modals/LoginModal';
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';
import { Unlock } from 'react-feather';
import RegisterModal from '@/modals/RegisterModal';
import RecoverModal from '@/modals/RecoverModal';

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [userProfile, setUserProfile] = useState<string | null>(null);

  const handleLogin = (profile: string) => {
    setIsLogged(true);
    setUserProfile(profile);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUserProfile(null);
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
          <div className='flex justify-between gap-2 py-2'>
            <LoginModal onLogin={handleLogin} />
            <RegisterModal/>
            <RecoverModal />
          </div>
        )}
      </div>
      <div className='w-full'>
        <Table
          aria-label='Example empty table'
          topContent={
            <div className='flex items-center justify-center gap-2'>
              <Unlock size={18} /> <p>Ruta abierta:</p>
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Direccion</TableColumn>
            <TableColumn>Articulos</TableColumn>
            <TableColumn>Total</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No hay rutas abiertas.'}>
            {isLogged ? (
              <TableRow>
                <TableCell>carlo</TableCell>
                <TableCell>carlospaz</TableCell>
                <TableCell>12 articulos</TableCell>
                <TableCell>$1212</TableCell>
              </TableRow>
            ) : (
              []
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
