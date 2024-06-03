import OrderItem from "@/components/OrderItem";
import OrderModal from "@/modals/OrderModal";
import React, { useEffect, useState } from "react";

interface Order {
  // Define las propiedades de una orden según los datos que esperas del API
  _id: string;
  clientId: string;
  clientName: string;
  clientNumber: number;
  products: {
    _id: string;
    name: string;
    prices: number[];
    quantity: number;
    selectedMeasurement: string;
    selectedPrice: number;
  }[];
  discount: string;
}

const Pedidos = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://distributor-api.onrender.com/order', {
          method: 'GET'
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Error al obtener las órdenes');
        }
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
      }
    };

    fetchOrders();
  }, []);

  console.log(orders);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <OrderModal />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {/* {orders.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))} */}
      </div>
    </div>
  );
};

export default Pedidos;
