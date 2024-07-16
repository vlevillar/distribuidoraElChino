import React, { forwardRef, useEffect, useState } from 'react'
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
import { Calendar, Percent, PlusCircle } from 'react-feather'
import SearchOrderClient from '@/components/SearchOrderClient'
import SearchOrderProduct from '@/components/SearchOrderProduct'
import OrderResume from '@/components/OrderResume'
import ListTabs from '@/components/ListTabs'

interface Client {
  _id: string
  clientNumber: number
  name: string
  address: string
  type: string
  phone: string
}

interface Product {
  _id: string
  code?: string
  name: string
  prices: number[]
  quantity: number
  selectedMeasurement?: string
  selectedPrice?: number
}

interface OrderModalProps {
  onSuccess: () => void
}

export default function OrderModal({ onSuccess }: OrderModalProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [percent, setPercent] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState(0)
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'GET',
        headers:{'Authorization': `Bearer ${accessToken}`}
      })
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

  const handleSelectedProductChange = (newProducts: Product[]) => {
    setSelectedProducts(prevProducts => {
      return newProducts.map(newProduct => {
        const existingProduct = prevProducts.find(p => p._id === newProduct._id);
        return existingProduct ? { ...newProduct, quantity: existingProduct.quantity } : newProduct;
      });
    });
  };

  const handleProductsChange = (updatedProducts: Product[]) => {
    console.log('Updating products:', updatedProducts);
    setSelectedProducts(updatedProducts);
  };

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
console.log('selected: ',selectedProducts);

  const handleCreateOrder = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No se encontró el token de acceso');
      return;
    }
    if (!selectedClient || selectedProducts.length === 0) {
      console.error('Client or products not selected')
      return
    }

    const transformedProducts = selectedProducts.map(product => ({
      ...product,
      quantity: product.quantity,
      code: String(product.code)
    }))

    const orderData = {
      clientId: selectedClient._id,
      clientName: selectedClient.name,
      clientNumber: selectedClient.clientNumber,
      products: transformedProducts,
      discount: discount,
      selectedList: Number(selected)
    }

    try {
      const response = await fetch(`${process.env.API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        console.log('Order created successfully')
        onClose()
        onSuccess()
        handleClose()
      } else {
        console.error('Error creating order')
      }
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

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
                <div className='flex justify-between z-10'>
                  <ListTabs
                    handle={handleSelectionChange}
                    selected={selected}
                    list={percent}
                  />
                </div>
                <OrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  onProductsChange={handleProductsChange}
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
                  color='success'
                  onPress={handleCreateOrder}
                  isDisabled={total === 0}
                >
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
