import OrderItem from "@/components/Order/OrderItem";
import OrderModal from "@/modals/Order/OrderModal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  clientId: string;
  clientName: string;
  clientNumber: number;
  products: {
    _id: string;
    name: string;
    prices: number[];
    quantity: number;
    measurement: string;
  }[];
  discount: string;
  date: string;
  documentNumber: number;
  type: string;
  selectedList: number;
}

const Pedidos = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter()

  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
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

  useEffect(() => {
    fetchOrders();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      router.push("/")
      return;
    }
  }, []);

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <OrderModal onSuccess={fetchOrders}/>
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {orders.map((order) => (
          <OrderItem key={order._id} order={order} fetchData={fetchOrders}/>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
