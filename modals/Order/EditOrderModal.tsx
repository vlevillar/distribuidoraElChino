import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react';
import { Info, Percent } from 'react-feather';
import SearchOrderClient from '@/components/Order/SearchOrderClient';
import SearchOrderProduct from '@/components/Order/SearchOrderProduct';
import EditOrderResume from '@/components/Order/EditOrderResume';
import ListSelector from '@/components/Percent/ListSelector';
import CalendarSelector from '@/components/Order/CalendarSelector';

interface Client {
  _id: string;
  clientNumber: number;
  name: string;
  address: string;
  type: string;
  phone: string;
}

interface Product {
  _id: string
  code?: string
  name: string
  prices: number[]
  quantity: number
  selectedMeasurement?: string
  basePrices?: number[]
  measurement?: string
  units?: number
  selectedPrice?: number
}

interface Order {
  _id: string;
  clientId: string;
  clientName: string;
  clientNumber: number;
  products: Product[];
  discount: string;
  selectedList: number;
  deliveryDate: string;
  description: string;
}

interface EditOrderModalProps {
  order: Order;
  onSuccess: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onSuccess }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [percent, setPercent] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState(''); 
  const [total, setTotal] = useState(0);
  const [totalWithDiscount, setTotalWithDiscount] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [selected, setSelected] = useState<number | null>(isAdmin ? null : 1);

  const memoizedSelectedProducts = useMemo(() => selectedProducts, [selectedProducts.map(p => p._id).join(',')]);

  const getPricesList = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      getPricesList();
    }
  }, [isOpen, getPricesList]);

  useEffect(() => {
    if (order && isOpen) {
      setSelectedClient({
        _id: order.clientId,
        clientNumber: order.clientNumber,
        name: order.clientName,
        address: '',
        type: '',
        phone: ''
      });
      setSelectedProducts(order.products);
      setDiscount(order.discount);
      setSelected(order.selectedList);
      calculateTotalWithDiscount();
      setDescription(order.description); // Inicializa el estado de descripción
      setDeliveryDate(order.deliveryDate); // Inicializa la fecha de entrega
      const admin = localStorage.getItem('role')
      setIsAdmin(admin === 'admin')
    }
  }, [order, isOpen]);

  useEffect(() => {
    calculateTotalWithDiscount();
  }, [total, discount]);

  const handleSelectedClientChange = (clients: Client[]) => {
    setSelectedClient(clients.length > 0 ? clients[0] : null);
  };

  const handleProductsChange = (updatedProducts: Product[]) => {
    console.log('Updating products:', updatedProducts);
    setSelectedProducts(updatedProducts);
  };

  const handleDateChange = (date: string) => {
    setDeliveryDate(date); 
  }

  const handleSelectedProductSearchChange = useCallback((products: Product[]) => {
    setSelectedProducts(prevProducts => {
      return products.map(newProduct => {
        const existingProduct = prevProducts.find(p => p._id === newProduct._id);
        return existingProduct ? { ...newProduct, quantity: existingProduct.quantity } : { ...newProduct, quantity: 1 };
      });
    });
  }, []);

  const handleSelectionChange = (key: number) => {
    console.log('Setting selected from ListSelector:', key);
    setSelected(key);
  };

  const handleTotalChange = (total: number) => {
    setTotal(total);
  };

  const calculateTotalWithDiscount = () => {
    const discountValue = parseFloat(discount);
    if (!isNaN(discountValue)) {
      const newTotal = total - total * (discountValue / 100);
      setTotalWithDiscount(newTotal);
    } else {
      setTotalWithDiscount(total);
    }
  };

  const handleUpdateProductPrice = useCallback((productId: string, newPrice: number) => {
    setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
            product._id === productId
                ? {
                      ...product,
                      prices: product.prices.map((price, index) =>
                          index === (selected ?? 0) ? newPrice : price
                      ),
                  }
                : product
        )
    );
}, [selected]);

const handleUpdateOrder = async () => {
  if (!selectedClient || selectedProducts.length === 0) {
    console.error('Client or products not selected');
    return;
  }

  const transformedProducts = selectedProducts.map(product => {
    const isByWeight = product.measurement !== 'unit';
    const amount = isByWeight
      ? product.units ?? 0 // Usa `weight` si es por peso
      : product.quantity;   // Usa `quantity` si es por unidad

    return {
      ...product,
      total: product.prices[selected ?? 0] * amount, // Calcula el total correctamente
      code: String(product.code), // Asegúrate de transformar el código en string si es necesario
    };
  });

  const orderData = {
    clientId: selectedClient._id,
    clientName: selectedClient.name,
    clientNumber: selectedClient.clientNumber,
    products: transformedProducts,
    discount: discount,
    selectedList: Number(selected),
    deliveryDate,
    description,
  };

  try {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.API_URL}/orders/${order._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      console.log('Order updated successfully');
      onClose();
      onSuccess();
    } else {
      console.error('Error updating order');
    }
  } catch (error) {
    console.error('Error updating order:', error);
  }
};


  return (
    <>
      <Button onPress={onOpen} size='sm'>
        Editar
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        size='xl'
        scrollBehavior='outside'
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Editar pedido
              </ModalHeader>
              <ModalBody>
                <div className='flex-col'>
                  <SearchOrderClient
                    onSelectedClientsChange={handleSelectedClientChange}
                    initialClient={selectedClient}
                  />
                </div>
                <div className='flex-col'>
                  <SearchOrderProduct
                    onSelectedProductChange={handleSelectedProductSearchChange}
                    initialProducts={memoizedSelectedProducts}
                  />
                </div>
                <Input
                  label='Descripción' 
                  placeholder='Ingresar descripción (opcional)'
                  className='py-1' 
                  endContent={<Info/>} 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className='flex justify-between z-10'>
                  <ListSelector
                  isAdmin={isAdmin}
                    handle={handleSelectionChange}
                    selected={selected}
                    list={percent}
                  />
                  <CalendarSelector onDateChange={handleDateChange} initialDate={order.deliveryDate}/>
                </div>
                <EditOrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  onProductsChange={handleProductsChange}
                  onUpdatePrice={handleUpdateProductPrice}
                />
                <div className='flex justify-end'>
                  <div>
                    <Input
                      label='Descuento'
                      placeholder='0.00'
                      variant='underlined'
                      type='number'
                      value={discount}
                      onChange={e => setDiscount(e.target.value)}
                      endContent={<Percent />}
                    />
                    <p>Subtotal: $ {total.toFixed(2)}</p>
                    {discount ? <p>Descuento: {discount}%</p> : null}
                    <p>Total: <b>$ {totalWithDiscount.toFixed(2)}</b></p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
                <Button 
                  color='primary' 
                  onPress={handleUpdateOrder}
                  isDisabled={total === 0}
                >
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditOrderModal;
