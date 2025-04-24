import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
}

const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState([]);
  const [userOrders, setUserOrders] = useState<Set<string>>(new Set())
  const [userClients, setUserClients] = useState<Set<string>>(new Set());
  const [userProducts, setUserProducts] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState('clients');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole !== 'admin') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const fetchData = async (url: string, setData: (data: any) => void) => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    };

    fetchData(`${process.env.API_URL}/user`, setUsers);
    fetchData(`${process.env.API_URL}/clients`, setClients);
    fetchData(`${process.env.API_URL}/products`, setProducts);
    fetchData(`${process.env.API_URL}/orders/all`, setOrders);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchClientsByUserId(selectedUserId);
      fetchOrdersByUserId(selectedUserId);
      fetchProductsByUserId(selectedUserId);
      
    }else if (selectedUserId === null){
    fetchClientsByUserId("null");
    fetchOrdersByUserId("null");
    fetchProductsByUserId("null");
    }
  }, [selectedUserId]);

  const fetchClientsByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${process.env.API_URL}/clients/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        if (response.status === 500) {
          setUserClients(new Set());
        }
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setUserClients(new Set(data.map((client: { _id: string }) => client._id)));
    } catch (error) {
      setUserClients(new Set()); 
      console.error('Error fetching clients by user ID:', error);
    }
  };

  const fetchOrdersByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(`${process.env.API_URL}/orders/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setUserOrders(new Set(data.map((order: { _id: string }) => order._id)))
    } catch (error) {
      console.error('Error fetching orders by user ID:', error)
      setUserOrders(new Set())
    }
  }

  const fetchProductsByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(`${process.env.API_URL}/products/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setUserProducts(new Set(data.map((product: { id: string }) => product.id)))
    } catch (error) {
      console.error('Error fetching products by user ID:', error)
      setUserProducts(new Set())
    }
  }

  return {
    users,
    clients,
    userClients,
    userOrders,
    userProducts,
    products,
    orders,
    selected,
    selectedUserId,
    setSelected,
    setUsers,
    setUserClients,
    setUserOrders,
    setUserProducts,
    setSelectedUserId
  };
};

export default useAdminData;
