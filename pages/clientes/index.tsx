import React, { useState, useEffect } from "react";
import ClientItem from "@/components/ClientItem";
import ClientModal from "@/modals/ClientModal";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/clients`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  console.log(clients);

  // Ordenar la lista de clientes por clientNumber
  const sortedClients = [...clients].sort((a, b) => a.clientNumber - b.clientNumber);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ClientModal onClientCreated={fetchData} />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {sortedClients.map((client) => (
          <ClientItem key={client._id} client={client} fetchData={fetchData} />
        ))}
      </div>
    </div>
  );
};

export default Productos;
