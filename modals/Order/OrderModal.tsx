import React, { useCallback, useEffect, useState } from 'react'
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
import { Info, Percent, PlusCircle } from 'react-feather'
import SearchOrderClient from '@/components/Order/SearchOrderClient'
import SearchOrderProduct from '@/components/Order/SearchOrderProduct'
import OrderResume from '@/components/Order/OrderResume'
import ListSelector from '@/components/Percent/ListSelector'
import CalendarSelector from '@/components/Order/CalendarSelector'

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
  units?: number
  selectedPrice?: number
  basePrices?: number[]
}

interface OrderModalProps {
  onSuccess: () => void
}

export default function OrderModal({ onSuccess }: OrderModalProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [percent, setPercent] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [isAdmin, setIsadmin] = useState(false)
  const [discount, setDiscount] = useState('')
  const [total, setTotal] = useState(0)
  const [totalWithDiscount, setTotalWithDiscount] = useState(0)
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
  const [showError, setShowError] = useState<boolean>(false);
  const [description, setDescription] = useState('') // Estado para la descripción
  const [selected, setSelected] = useState<number | null>(isAdmin ? null : 1);

  useEffect(() => {
    getPricesList()
    const admin = localStorage.getItem('role') === "admin"
    setIsadmin(admin)
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
    setSelectedProducts((prevProducts) => {
      const updatedProducts = newProducts.map((newProduct) => {
        const existingProduct = prevProducts.find(
          (p) => p._id === newProduct._id
        );
        return existingProduct
          ? {
              ...newProduct,
              prices: existingProduct.prices,
              basePrices:
                existingProduct.basePrices || [...newProduct.prices],
              quantity: existingProduct.quantity,
              units: existingProduct.units,
            }
          : { ...newProduct, basePrices: [...newProduct.prices] };
      });
  
      // Verifica si los arrays realmente son diferentes
      if (
        JSON.stringify(prevProducts) === JSON.stringify(updatedProducts)
      ) {
        return prevProducts; // No actualices el estado si no hay cambios
      }
  
      return updatedProducts;
    });
  };
  
  
  const handleTotalChange = useCallback((total: number) => {
    setTotal(total);
}, []);

const handleProductsChange = useCallback((updatedProducts: Product[]) => {
    setSelectedProducts(updatedProducts);
}, []);

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


  const handleClose = () => {
    setSelectedClient(null)
    setSelectedProducts([])
    setDiscount('')
    setTotal(0)
    setTotalWithDiscount(0)
    setDeliveryDate(null)
    setDescription('') 
  }

  const handleSelectionChange = useCallback((key: any) => {
    setSelected(key)
  }, [])

  const calculateTotalWithDiscount = () => {
    const discountValue = parseFloat(discount)
    if (!isNaN(discountValue)) {
      const newTotal = total - total * (discountValue / 100)
      setTotalWithDiscount(newTotal)
    } else {
      setTotalWithDiscount(total)
    }
  }

  const handleDateChange = (date: string) => {
    setDeliveryDate(date); 
    setShowError(false);
  }

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
    if (!deliveryDate) {
      setShowError(true);
      return;
    }

    const transformedProducts = selectedProducts.map(product => ({
      ...product,
      quantity: product.quantity,
      code: String(product.code)
    }))

    console.log(transformedProducts);
    

    const orderData = {
      clientId: selectedClient._id,
      clientName: selectedClient.name,
      clientNumber: selectedClient.clientNumber,
      clientAddress: selectedClient.address,
      clientPhone: selectedClient.phone,
      products: transformedProducts,
      discount: discount,
      selectedList: Number(selected),
      deliveryDate,
      description
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
        size='xl'
        scrollBehavior='outside'
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
                <Input 
                  label='Descripción' 
                  placeholder='Ingresar descripción (opcional)' 
                  endContent={<Info/>} 
                  className='py-1'
                  onChange={e => setDescription(e.target.value)} 
                />
                <div className='flex justify-between z-10'>
                  <ListSelector
                    handle={handleSelectionChange}
                    selected={selected}
                    list={percent}
                    isAdmin={isAdmin}
                  />
                  <CalendarSelector onDateChange={handleDateChange}         showError={showError}
        isRequired/>
                </div>
                <OrderResume
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
