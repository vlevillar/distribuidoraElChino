import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react'
import { Percent, PlusCircle } from 'react-feather'
import SearchOrderClient from '@/components/SearchOrderClient'
import SearchOrderProduct from '@/components/SearchOrderProduct'
import OrderResume from '@/components/OrderResume'
import ListTabs from '@/components/ListTabs'

interface Client {
  _id: string
  clientNumber: number;
  name: string
  address: string
  type: string
  phone: string
}

interface Product {
  _id: string;
  code?: string;
  name: string;
  prices: number[];
  quantity?: number;
  selectedMeasurement?: string; 
  selectedPrice?: number; 
}



export default function OrderModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [percent, setPercent] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [discount, setDiscount] = useState('')
  const [total, setTotal] = useState(0)
  const [totalWithDiscount, setTotalWithDiscount] = useState(0)

  useEffect(() => {
    getPricesList()
  }, [])

  useEffect(() => {
    calculateTotalWithDiscount()
  }, [total, discount])

  const getPricesList = async () => {
    try {
      const response = await fetch(
        `https://distributor-api.onrender.com/pricesList`,
        {
          method: 'GET'
        }
      )
      if (response.ok) {
        console.log('Datos de precios obtenidos exitosamente')
        const data = await response.json()
        setPercent(data)
      } else {
        console.error('Error al obtener datos de precios')
      }
    } catch (error) {
      console.error('Error al obtener datos de precios:', error)
    }
  }

  const handleSelectedClientChange = (clients: Client[]) => {
    setSelectedClient(clients.length > 0 ? clients[0] : null)
  }

  const handleSelectedProductChange = (products: Product[]) => {
    setSelectedProducts(products)
  }

  const handleClose = () => {
    setSelectedClient(null)
    setSelectedProducts([])
    setDiscount('')
    setTotal(0)
    setTotalWithDiscount(0)
  }

  const handleSelectionChange = (key: any) => {
    setSelected(key)
  }

  const handleTotalChange = (total: number) => {
    setTotal(total)
  }

  const calculateTotalWithDiscount = () => {
    const discountValue = parseFloat(discount)
    if (!isNaN(discountValue)) {
      const newTotal = total - total * (discountValue / 100)
      setTotalWithDiscount(newTotal)
    } else {
      setTotalWithDiscount(total)
    }
  }

  const handleCreateOrder = async () => {
    if (!selectedClient || products.length === 0) {
      console.error('Client or products not selected');
      return;
    }
  
    const transformedProducts = products.map(product => ({
      ...product,
      code: String(product.code)
    }));
  
    const orderData = {
      clientId: selectedClient._id,
      clientName: selectedClient.name,
      clientNumber: selectedClient.clientNumber,
      products: transformedProducts,
      discount: discount,
    };
  
    try {
      const response = await fetch('https://distributor-api.onrender.com/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
  
      if (response.ok) {
        console.log('Order created successfully');
        onClose()
        handleClose();
      } else {
        console.error('Error creating order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
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
                <ListTabs
                  handle={handleSelectionChange}
                  selected={selected}
                  list={percent}
                />
                <OrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  setProducts={setProducts}
                />
                <div className='flex justify-end'>
                  <div>
                    <Input
                      label='Descuento'
                      placeholder='0.00'
                      variant='underlined'
                      type='number'
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
                <Button color='success' onPress={handleCreateOrder}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
