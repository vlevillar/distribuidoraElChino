import React, { useState, useEffect } from "react";
import ClientItem from "@/components/Clients/ClientItem";
import ClientModal from "@/modals/Clients/ClientModal";
import { useRouter } from "next/router";

interface Client {
  _id: string;
  name: string;
  currentAccount: number;
  clientNumber: number;
  address: string;
  phone: string;
  type: string;
}

const Productos: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchData();
    const admin = localStorage.getItem('role');
    const accessToken = localStorage.getItem('accessToken');
    setIsAdmin(admin === 'admin')
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      router.push("/")
      return;
    }
  }, []);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/clients`,{
        headers:{
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const sortedClients = [...clients].sort((a, b) => a.clientNumber - b.clientNumber);

  return (
    <div className="flex items-center justify-center flex-col">
      {isAdmin &&
      <div className="pb-4 flex flex-col">
        <ClientModal onClientCreated={fetchData} />
      </div>
      }
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {sortedClients.map((client) => (
          <ClientItem key={client._id} client={client} fetchData={fetchData} isAdmin={isAdmin}/>
        ))}
      </div>
    </div>
  );
};

export default Productos;
