import React, { useState, useEffect } from "react";
import ClientItem from "@/components/ClientItem";
import ClientModal from "@/modals/ClientModal";

const Productos = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://distributor-api.onrender.com/clients");
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ClientModal />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {clients.map((client, index) => (
          <ClientItem key={index} client={client} />
        ))}
      </div>
    </div>
  );
};

export default Productos;
