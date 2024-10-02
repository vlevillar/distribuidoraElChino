import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  initialClient?: Client | null | undefined;
}

export default function SearchOrderClient({ onSelectedClientsChange, initialClient }: SearchClientProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [displayedClients, setDisplayedClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null | undefined>(initialClient);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const CLIENTS_PER_PAGE = 10;

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
        setClients(data.sort((a: Client, b: Client) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedClient(initialClient); 
  }, [initialClient]);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedClients(filtered.slice(0, CLIENTS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > CLIENTS_PER_PAGE);
  }, [searchTerm, clients]);

  const loadMoreClients = useCallback(() => {
    if (loading) return;
    setLoading(true);
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const nextClients = filtered.slice(page * CLIENTS_PER_PAGE, (page + 1) * CLIENTS_PER_PAGE);
    setDisplayedClients(prev => [...prev, ...nextClients]);
    setPage(prev => prev + 1);
    setHasMore(filtered.length > (page + 1) * CLIENTS_PER_PAGE);
    setLoading(false);
  }, [clients, searchTerm, page, loading]);

  const lastClientElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreClients();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadMoreClients, hasMore]);

  const handleChipClick = (client: Client) => {
    if (selectedClient?._id === client._id) {
      setSelectedClient(null);
      onSelectedClientsChange([]);
    } else {
      setSelectedClient(client);
      onSelectedClientsChange([client]);
    }
  };
  
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Input
          placeholder="Buscar cliente"
          startContent={<Users />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="scroll-container flex h-24 flex-wrap gap-1 overflow-y-auto">
          {displayedClients.map((client, index) => (
            <Chip
              key={client._id}
              onClick={() => handleChipClick(client)}
              color={selectedClient?._id === client._id ? 'success' : 'default'}
              ref={index === displayedClients.length - 1 ? lastClientElementRef : null}
            >
              {client.name}
            </Chip>
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </CardBody>
    </Card>
  );
}