import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  TableHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  TableRow,
  TableCell,
  TableColumn,
  TableBody,
  Table,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Selection
} from '@nextui-org/react';
import { Percent, PlusCircle } from 'react-feather';
import SearchOrderClient from '@/components/SearchOrderClient';
import SearchOrderProduct from '@/components/SearchOrderProduct';
import OrderResume from '@/components/OrderResume';
import ListTabs from '@/components/ListTabs';

interface Client {
  _id: number;
  name: string;
  address: string;
  type: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  prices: number[];
  quantity: number;
}

export default function OrderModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [percent, setPercent] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState(0);
  const [discount, setDiscount] = useState(""); 
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPricesList();
  }, []);

  const getPricesList = async () => {
    try {
      const response = await fetch(
        `https://distributor-api.onrender.com/pricesList`,
        {
          method: 'GET'
        }
      );
      if (response.ok) {
        console.log('Datos de precios obtenidos exitosamente');
        const data = await response.json();
        setPercent(data);
      } else {
        console.error('Error al obtener datos de precios');
      }
    } catch (error) {
      console.error('Error al obtener datos de precios:', error);
    }
  };

  const handleSelectedClientChange = (clients: Client[]) => {
    setSelectedClient(clients.length > 0 ? clients[0] : null);
  };

  const handleSelectedProductChange = (products: Product[]) => {
    setSelectedProducts(products);
  };

  const handleClose = () => {
    setSelectedClient(null);
    setSelectedProducts([]);
  };

  const handleSelectionChange = (key: any) => {
    setSelected(key);
  };

  const handleTotalChange = (total: number) => {
    setTotal(total);
  };

  return (
    <>
      <Button onPress={onOpen} color='success' startContent={<PlusCircle />}>
        Agregar pedido
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onOpenChange={onOpenChange}
        placement='top-center'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Agregar pedido
              </ModalHeader>
              <ModalBody>
                <SearchOrderClient
                  onSelectedClientsChange={handleSelectedClientChange}
                />
                <SearchOrderProduct
                  onSelectedProductChange={handleSelectedProductChange}
                />
                <ListTabs handle={handleSelectionChange} selected={selected} list={percent}/>
                <OrderResume 
                  selectedProducts={selectedProducts} 
                  selectedList={selected} 
                  onTotalChange={handleTotalChange}
                />
                <div className='flex justify-end'>
                  <div>
                  <Input
                  label='Descuento'
                  placeholder='0.00'
                  variant='underlined'
                  type='number'
                  onChange={(e) => setDiscount(e.target.value)}
                  endContent={<Percent/>}
                  />
                  <p>Total: ${total.toFixed(2)}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button color='success' onPress={onClose}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
