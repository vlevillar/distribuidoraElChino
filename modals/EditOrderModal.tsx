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
import { Percent } from 'react-feather'
import SearchOrderClient from '@/components/SearchOrderClient'
import SearchOrderProduct from '@/components/SearchOrderProduct'
import ListTabs from '@/components/ListTabs'
import EditOrderResume from '@/components/EditOrderResume'

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
  quantity: number;
  selectedMeasurement?: string; 
  selectedPrice?: number; 
}

interface Order {
  _id: string;
  clientId: string;
  clientName: string;
  clientNumber: number;
  products: Product[];
  discount: string;
}

interface EditOrderModalProps {
  order: Order;
  onSuccess: () => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onSuccess }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [percent, setPercent] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [discount, setDiscount] = useState('')
  const [total, setTotal] = useState(0)
  const [totalWithDiscount, setTotalWithDiscount] = useState(0)
console.log(percent);

  useEffect(() => {
    getPricesList()
  }, [])

  useEffect(() => {
    setSelectedClient({
      _id: order.clientId,
      clientNumber: order.clientNumber,
      name: order.clientName,
      address: '',
      type: '',
      phone: ''
    })
    setSelectedProducts(order.products)
    setDiscount(order.discount)
    calculateTotalWithDiscount()
  }, [order])

  useEffect(() => {
    calculateTotalWithDiscount()
  }, [total, discount])

  const getPricesList = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/pricesList`,
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

  const handleUpdateOrder = async () => {
    if (!selectedClient || selectedProducts.length === 0) {
      console.error('Client or products not selected');
      return;
    }

    const transformedProducts = selectedProducts.map(product => ({
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
      const response = await fetch(`${process.env.API_URL}/pricesList/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        console.log('Order updated successfully');
        onClose()
        onSuccess()
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
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Editar pedido
              </ModalHeader>
              <ModalBody>
                <SearchOrderClient
                  onSelectedClientsChange={handleSelectedClientChange}
                  initialClient={selectedClient}
                />
                <SearchOrderProduct
                  onSelectedProductChange={handleSelectedProductChange}
                  initialProducts={selectedProducts}
                />
                <ListTabs
                  handle={handleSelectionChange}
                  selected={selected}
                  list={percent}
                />
                {/* <EditOrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  setProducts={setProducts}
                /> */}
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
  )
}

export default EditOrderModal
