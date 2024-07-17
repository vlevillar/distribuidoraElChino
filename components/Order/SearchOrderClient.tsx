import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Divider, Input, Chip } from '@nextui-org/react';
import { Users } from 'react-feather';

interface Client {
  id?: string
  _id: string
  clientNumber: number;
  name: string
  address: string
  type: string
  phone: string
}

interface SearchClientProps {
  onSelectedClientsChange: (clients: Client[]) => void;
  initialClient?: Client | null | undefined; // Propiedad opcional para inicializar el cliente seleccionado
}

export default function SearchOrderClient({ onSelectedClientsChange, initialClient }: SearchClientProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null | undefined>(initialClient); // Inicialización con initialClient

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No se encontró el token de acceso');
          return;
        }
        const response = await fetch(`${process.env.API_URL}/clients`,
          {
            headers: {'Authorization': `Bearer ${accessToken}`}
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedClient(initialClient); // Actualización del cliente seleccionado al inicializar
  }, [initialClient]);

  const handleChipClick = (client: Client) => {
    if (selectedClient?.id === client.id) {
      setSelectedClient(client);
      onSelectedClientsChange([client]);
    } else {
      setSelectedClient(null);
      onSelectedClientsChange([]);
    }
  };
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedClients = filteredClients.slice().sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <Card className='max-w-[400px]'>
      <CardHeader className='flex gap-3'>
        <Input
          placeholder='Buscar cliente'
          startContent={<Users />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='scroll-container flex h-24 flex-wrap gap-1 overflow-y-auto'>
          {sortedClients.map(client => (
            <Chip
              key={client._id}
              onClick={() => handleChipClick(client)}
              color={selectedClient?._id === client._id ? 'success' : 'default'}
            >
              {client.name}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
