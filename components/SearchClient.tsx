import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Chip,
  CardFooter
} from '@nextui-org/react'
import { Users, XCircle } from 'react-feather'

interface Client {
  _id: string
  name: string
  address: string
  type: string
  phone: string
}

interface SearchClientProps {
  onSelectedClientsChange: (clients: Client[]) => void;
}

export default function SearchClient({ onSelectedClientsChange }: SearchClientProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedChips, setSelectedChips] = useState<boolean[]>([])
  const [selectedClients, setSelectedClients] = useState<Client[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://distributor-api.onrender.com/clients'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch clients')
        }
        const data = await response.json()
        setClients(data)
        setSelectedChips(new Array(data.length).fill(false))
      } catch (error) {
        console.error('Error fetching clients:', error)
      }
    }
    
    fetchData()
  }, [])

  const handleChipClick = (index: number) => {
    setSelectedChips((prevSelectedChips: boolean[]) => {
      const updatedChips = [...prevSelectedChips];
      updatedChips[index] = !updatedChips[index];
      return updatedChips;
    });

    const selectedClient = filteredClients[index];
    if (!selectedChips[index]) {
      const newSelectedClients = [...selectedClients, selectedClient];
      setSelectedClients(newSelectedClients);
      onSelectedClientsChange(newSelectedClients)
    } else {
      const newSelectedClients = selectedClients.filter(client => client._id !== selectedClient._id);
      setSelectedClients(newSelectedClients);
      onSelectedClientsChange(newSelectedClients)
    }
  };
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          {sortedClients.map((client, index) => (
            <Chip
              key={client._id}
              onClick={() => handleChipClick(index)}
              color={selectedChips[index] ? 'success' : 'default'}
            >
              {client.name}
            </Chip>
          ))}
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className='flex flex-col w-full'>
          <div className='w-full'>
            <p>Clientes Seleccionados:</p>
          </div>
          <div className='scroll-container flex h-24 w-full flex-wrap gap-1 overflow-y-auto pt-2'>
            {selectedClients.map(client => (
              <Chip
                className='cursor-pointer'
                key={client._id}
                onClick={() => handleChipClick(filteredClients.findIndex(c => c._id === client._id))}
                variant='faded'
                color='danger'
                startContent={<XCircle size={18} />}
              >
                {client.name}
              </Chip>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
