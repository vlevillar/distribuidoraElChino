import ClientAdminItem from '@/components/Admin/ClientAdminItem';
import { Checkbox, Input } from '@nextui-org/react';
import React, { useCallback, useMemo, useState } from 'react';
import { Search } from 'react-feather';

interface Client {
  _id: string;
  name: string;
  currentAccount: number;
  clientNumber: number;
  address: string;
  phone: string;
  type: string;
}

interface AddClientsProps {
  clients?: Client[]
  selectedUserId: string | null
  userClients: Set<string>
  onUserClientsChange: (newUserClients: Set<string>) => void
}

export default function AddClients({
  clients = [],
  selectedUserId,
  userClients,
  onUserClientsChange
}: AddClientsProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);

  const filteredClients = useMemo(() => {
    let result = clients;
    if (isSelected) {
      result = result.filter(client => userClients.has(client._id));
    }
    if (searchValue) {
      result = result.filter(
        client =>
          client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.type.toLowerCase().includes(searchValue.toLowerCase()) ||
          client.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return result;
  }, [clients, searchValue, isSelected, userClients]);

  const handleAssignmentChange = useCallback((clientId: string, isAssigned: boolean) => {
    const newUserClients = new Set(userClients)
    if (isAssigned) {
      newUserClients.add(clientId)
    } else {
      newUserClients.delete(clientId)
    }
    onUserClientsChange(newUserClients)
  }, [userClients, onUserClientsChange])

  return (
    <div>
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='w-full'>
          <Input
            placeholder='Buscar cliente'
            value={searchValue}
            onValueChange={setSearchValue}
            startContent={<Search />}
            size='sm'
          />
        </div>
        <div>
          <Checkbox isSelected={isSelected} onValueChange={setIsSelected} color='success'>
            Mostrar solo seleccionados
          </Checkbox>
        </div>
      </div>
      <div className='xs:grid-cols-1 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {filteredClients.map(client => (
           <ClientAdminItem
           key={client._id}
           client={client}
           isAdminPanel
           selectedUserId={selectedUserId}
           isAssigned={userClients.has(client._id)}
           onAssignmentChange={handleAssignmentChange}/>
        ))}
      </div>
    </div>
  );
}