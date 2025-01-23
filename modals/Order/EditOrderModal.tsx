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
  _id: string;
  code?: string;
  name: string;
  prices: number[];
  quantity: number;
  selectedMeasurement?: string;
  basePrices?: number[];
  measurement?: string;   // <-- AÑADIDO
  units?: number;
  selectedPrice?: number;
  estimate?: number;      // <-- AÑADIDO (peso aproximado por unidad)
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [selected, setSelected] = useState<number | null>(isAdmin ? null : 1);

  const memoizedSelectedProducts = useMemo(
    () => selectedProducts,
    [selectedProducts.map(p => p._id).join(',')]
  );

  // =========================================================
  // 1) Obtiene listas de precios
  // =========================================================
  const getPricesList = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  // =========================================================
  // 2) Efectos
  // =========================================================
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
        phone: '',
      });
      setSelectedProducts(order.products);
      setDiscount(order.discount);
      setSelected(order.selectedList);
      calculateTotalWithDiscount(); // recalculamos
      setDescription(order.description);
      setDeliveryDate(order.deliveryDate);
      const admin = localStorage.getItem('role');
      setIsAdmin(admin === 'admin');
    }
  }, [order, isOpen]);

  useEffect(() => {
    calculateTotalWithDiscount();
  }, [total, discount]);

  // =========================================================
  // 3) Handlers de cliente, productos, fecha, etc.
  // =========================================================
  const handleSelectedClientChange = (clients: Client[]) => {
    setSelectedClient(clients.length > 0 ? clients[0] : null);
  };

  // Cuando se edita algo en EditOrderResume
  const handleProductsChange = (updatedProducts: Product[]) => {
    console.log('Updating products:', updatedProducts);
    setSelectedProducts(updatedProducts);
  };

  const handleDateChange = (date: string) => {
    setDeliveryDate(date);
  };

  // Cuando buscamos productos nuevos
  const handleSelectedProductSearchChange = useCallback(
    (products: Product[]) => {
      setSelectedProducts(prevProducts => {
        return products.map(newProduct => {
          const existingProduct = prevProducts.find(p => p._id === newProduct._id);
          return existingProduct
            ? {
                ...newProduct,
                quantity: existingProduct.quantity,
                units: existingProduct.units,
                // Mantenemos measure/estimate si existía
                measurement: existingProduct.measurement ?? newProduct.measurement,
                estimate: existingProduct.estimate ?? newProduct.estimate
              }
            : {
                ...newProduct,
                quantity: newProduct.quantity ?? 0,
                units: newProduct.units ?? 0,
              };
        });
      });
    },
    []
  );

  const handleSelectionChange = (key: number) => {
    console.log('Setting selected from ListSelector:', key);
    setSelected(key);
  };

  // =========================================================
  // 4) Manejo de Subtotal/Descuento
  // =========================================================
  const handleTotalChange = (t: number) => {
    setTotal(t);
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

  // =========================================================
  // 5) Actualizar precio de producto
  // =========================================================
  const handleUpdateProductPrice = useCallback(
    (productId: string, newPrice: number) => {
      setSelectedProducts(prevProducts =>
        prevProducts.map(product =>
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
    },
    [selected]
  );

  // =========================================================
  // 6) Actualizar orden en backend
  // =========================================================
  const handleUpdateOrder = async () => {
    if (!selectedClient || selectedProducts.length === 0) {
      console.error('Client or products not selected');
      return;
    }

    const transformedProducts = selectedProducts.map(product => {
      return {
        ...product,
        total: product.prices[selected ?? 0] * product.quantity,
        code: String(product.code),
      };
    });

    const orderData = {
      clientId: selectedClient._id,
      clientName: selectedClient.name,
      clientNumber: selectedClient.clientNumber,
      products: transformedProducts,
      discount,
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
          Authorization: `Bearer ${accessToken}`,
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

  // =========================================================
  // 7) Calcular "aproximado" (kilogram)
  //     => quantity * estimate * price
  // =========================================================
  const calculateApproximate = useCallback(() => {
    if (!selectedProducts.length) return 0;

    return selectedProducts.reduce((acc, product) => {
      if (product.measurement === 'kilogram') {
        const price = product.prices[selected ?? 0] ?? 0;
        const qty = product.quantity || 0;
        // "estimate" = peso promedio del producto
        const estimateVal = product.estimate ?? 0;
        return acc + qty * estimateVal * price;
      }
      return acc;
    }, 0);
  }, [selectedProducts, selected]);

  const approximateTotal = calculateApproximate();

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
                  endContent={<Info />}
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
                  <CalendarSelector
                    onDateChange={handleDateChange}
                    initialDate={order.deliveryDate}
                  />
                </div>

                {/*
                  EditOrderResume maneja:
                  - selectedProducts
                  - selectedList (selected)
                  - onTotalChange (para setTotal)
                  - onProductsChange (cuando cambian quantity, etc.)
                  - onUpdatePrice (actualiza precio)
                */}
                <EditOrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  onProductsChange={handleProductsChange}
                  onUpdatePrice={handleUpdateProductPrice}
                />

                {/* MOSTRAR EL APROXIMADO A LA DERECHA */}
                <div className='flex justify-end my-2'>
                  <p>
                    <b>Aprox (KG):</b> ${' '}
                    {approximateTotal.toFixed(2)}
                  </p>
                </div>

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
                    <p>
                      Total: <b>$ {totalWithDiscount.toFixed(2)}</b>
                    </p>
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
