import ClientItem from "@/components/ClientItem";
import ClientModal from "@/modals/ClientModal";
import React from "react";

const Productos = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ClientModal />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        <ClientItem />
        <ClientItem />
        <ClientItem />
        <ClientItem />
      </div>
    </div>
  );
};

export default Productos;
