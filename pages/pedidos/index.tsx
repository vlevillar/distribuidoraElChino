import OrderItem from "@/components/OrderItem";
import OrderModal from "@/modals/OrderModal";
import React from "react";

const Pedidos = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <OrderModal />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        <OrderItem />
        <OrderItem />
        <OrderItem />
        <OrderItem />
      </div>
    </div>
  );
};

export default Pedidos;
