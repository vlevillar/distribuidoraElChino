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
  measurement?: string // <-- Para saber si es 'kilogram'
  estimate?: number // <-- Campo para el peso aproximado de cada unidad
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
  const [showError, setShowError] = useState<boolean>(false)
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    getPricesList()
    const admin = localStorage.getItem('role') === 'admin'
    setIsadmin(admin)
  }, [])

  // Recalcula total con descuento cada vez que cambie 'total' o 'discount'
  useEffect(() => {
    calculateTotalWithDiscount()
  }, [total, discount])

  // ==============================
  // 1) Cargar lista de precios
  // ==============================
  const getPricesList = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('No se encontró el token de acceso')
        return
      }
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
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

  // ==============================
  // 2) Manejo de cliente
  // ==============================
  const handleSelectedClientChange = (clients: Client[]) => {
    setSelectedClient(clients.length > 0 ? clients[0] : null)
  }

  // ==============================
  // 3) Manejo de productos (selección)
  // ==============================
  const handleSelectedProductChange = (newProducts: Product[]) => {
    setSelectedProducts(prevProducts => {
      const updatedProducts = newProducts.map(newProduct => {
        const existingProduct = prevProducts.find(p => p._id === newProduct._id)
        return existingProduct
          ? {
              ...newProduct,
              prices: existingProduct.prices,
              basePrices: existingProduct.basePrices || [...newProduct.prices],
              quantity: existingProduct.quantity,
              units: existingProduct.units,
              measurement:
                existingProduct.measurement ?? newProduct.measurement,
              estimate: existingProduct.estimate ?? newProduct.estimate
            }
          : { ...newProduct, basePrices: [...newProduct.prices] }
      })

      // Verifica si hay cambios reales
      if (JSON.stringify(prevProducts) === JSON.stringify(updatedProducts)) {
        return prevProducts
      }
      return updatedProducts
    })
  }

  // ==============================
  // 4) Calcular total (OrderResume avisa con onTotalChange)
  // ==============================
  const handleTotalChange = useCallback((newTotal: number) => {
    setTotal(newTotal)
  }, [])

  // ==============================
  // 5) Manejar cambios en productos (cantidad, etc.)
  // ==============================
  const handleProductsChange = useCallback((updatedProducts: Product[]) => {
    setSelectedProducts(updatedProducts)
  }, [])

  // ==============================
  // 6) Actualizar precio individual de un producto
  // ==============================
  const handleUpdateProductPrice = useCallback(
    (productId: string, newPrice: number) => {
      setSelectedProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId
            ? {
                ...product,
                prices: product.prices.map((price, index) =>
                  index === (selected ?? 0) ? newPrice : price
                )
              }
            : product
        )
      )
    },
    [selected]
  )

  // ==============================
  // 7) Cerrar modal y limpiar
  // ==============================
  const handleClose = () => {
    setSelectedClient(null)
    setSelectedProducts([])
    setDiscount('')
    setTotal(0)
    setTotalWithDiscount(0)
    setDeliveryDate(null)
    setDescription('')
  }

  // ==============================
  // 8) Manejo de la lista de precios seleccionada
  // ==============================
  const handleSelectionChange = useCallback((key: any) => {
    setSelected(key)
  }, [])

  // ==============================
  // 9) Recalcular total con descuento
  // ==============================
  const calculateTotalWithDiscount = () => {
    const discountValue = parseFloat(discount)
    if (!isNaN(discountValue)) {
      const newTotal = total - total * (discountValue / 100)
      setTotalWithDiscount(newTotal)
    } else {
      setTotalWithDiscount(total)
    }
  }

  // ==============================
  // 10) Manejo de la fecha
  // ==============================
  const handleDateChange = (date: string) => {
    setDeliveryDate(date)
    setShowError(false)
  }

  // ==============================
  // 11) Crear orden
  // ==============================
  const handleCreateOrder = async () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.error('No se encontró el token de acceso')
      return
    }
    if (!selectedClient || selectedProducts.length === 0) {
      console.error('Client or products not selected')
      return
    }
    if (!deliveryDate) {
      setShowError(true)
      return
    }

    const transformedProducts = selectedProducts.map(product => ({
      ...product,
      quantity: product.quantity,
      code: String(product.code)
    }))
    console.log(transformedProducts)

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
          Authorization: `Bearer ${accessToken}`
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

  // ==============================
  // 12) Calcular "aproximado" para productos 'kilogram'
  //     => quantity * estimate * price
  // ==============================
  const calculateApproximate = useCallback(() => {
    if (!selectedProducts.length) return 0

    return selectedProducts.reduce((acc, product) => {
      // Solo aplica a 'kilogram'
      if (product.measurement === 'kilogram') {
        const price = product.prices[selected ?? 0] ?? 0
        const qty = product.units || 0
        // El "estimate" que llega desde backend (peso aproximado de cada unidad)
        // O 0 si no viene
        const estimateVal = product.estimate ?? 0
        // Multiplicamos
        return acc + qty * estimateVal * price
      }
      // Si es unit, lo ignoramos en el "aproximado"
      return acc
    }, 0)
  }, [selectedProducts, selected])

  // Obtenemos ese aproximado
  const approximateTotal = calculateApproximate()

  return (
    <>
      <Button onPress={onOpen} color='success' startContent={<PlusCircle />}>
        Agregar pedido
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        onOpenChange={onOpenChange}
        isDismissable={false}
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
                  endContent={<Info />}
                  className='py-1'
                  onChange={e => setDescription(e.target.value)}
                />
                <div className='z-10 flex justify-between'>
                  <ListSelector
                    handle={handleSelectionChange}
                    selected={selected}
                    list={percent}
                    isAdmin={isAdmin}
                  />
                  <CalendarSelector
                    onDateChange={handleDateChange}
                    showError={showError}
                    isRequired
                  />
                </div>
                {/* 
                  NOTE: OrderResume ya maneja "onTotalChange"
                  para actualizar 'total' cada vez que cambian
                  'selectedProducts' o 'selectedList'
                */}
                <OrderResume
                  selectedProducts={selectedProducts}
                  selectedList={selected}
                  onTotalChange={handleTotalChange}
                  onProductsChange={handleProductsChange}
                  onUpdatePrice={handleUpdateProductPrice}
                />
                {/* 2) Subtotal, descuento, total */}
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
                    <p>Aprox: $ {approximateTotal.toFixed(2)}</p>
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
