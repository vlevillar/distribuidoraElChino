import OrderItem from "@/components/Order/OrderItem";
import OrderModal from "@/modals/Order/OrderModal";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Search } from "react-feather";

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
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchOrders = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/orders/all`, {
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
    const admin = localStorage.getItem('role');
    setIsAdmin(admin === 'admin');
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      router.push("/");
      return;
    }
  }, []);

  const filteredOrders = orders
    .filter(order =>
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex items-center justify-center flex-col">
      {isAdmin &&
        <div className="pb-4 flex flex-col">
          <OrderModal onSuccess={fetchOrders} />
        </div>
      }
      <div className="pb-4">
        <Input
        startContent={<Search/>}
          type="text"
          placeholder="Buscar pedido por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1">
        {filteredOrders.map((order) => (
          <OrderItem key={order._id} order={order} fetchData={fetchOrders} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
