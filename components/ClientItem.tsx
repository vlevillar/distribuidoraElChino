import React from "react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react';
import AccountModal from '@/modals/AccountModal';

interface Client {
  name: string;
  address: string;
  phone: string;
  type: string;
}

const ClientItem: React.FC<{ client: Client }> = ({ client }) => {
  const { name, address, phone, type } = client;

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{name}</p>
          <p className='text-small text-default-500'>Telefono: {phone}</p>
          <p className='text-small text-default-500'>Dirección: {address}</p>
          <p className='text-small text-default-500'>Tipo: {type}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardFooter className='flex items-center justify-center gap-3'>
        <Button size='sm'>Editar</Button>
        <AccountModal />
        <Button color='danger' size='sm'>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientItem;
