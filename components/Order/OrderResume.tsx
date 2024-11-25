import React, { useEffect } from 'react'
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react'
import EditProductPrice from '@/modals/Order/EditProductPrice'

interface Product {
  _id: string
  code?: string
  name: string
  prices: number[]
  quantity: number
  units?: number
  measurement?: string
  selectedPrice?: number
  basePrices?: number[]
}

interface OrderResumeProps {
  selectedProducts: Product[]
  selectedList: number | null
  onTotalChange: (total: number) => void
  onProductsChange: (updatedProducts: Product[]) => void
  onUpdatePrice: (productId: string, newPrice: number) => void
}

const OrderResume: React.FC<OrderResumeProps> = ({
  selectedProducts,
  selectedList,
  onTotalChange,
  onProductsChange,
  onUpdatePrice
}) => {
  useEffect(() => {
    calculateTotal()
  }, [selectedProducts, selectedList])

  const handleQuantityChange = (id: string, value: string) => {
    console.log('Changing quantity:', id, value)
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, quantity: numValue } : product
      )
      onProductsChange(updatedProducts)
    }
  }

  const handleWeightChange = (id: string, value: string) => {
    console.log('Changing Weight:', id, value)
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, units: numValue } : product
      )
      onProductsChange(updatedProducts)
    }
  }

  const calculateTotal = () => {
    const total = selectedProducts.reduce((sum, product) => {
      const price = product.prices[selectedList ?? 0]
      return sum + price * product.quantity
    }, 0)
    onTotalChange(total)
  }

  return (
    <Table removeWrapper aria-label='Products table'>
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>
          Unidades/
          <br />
          Peso
        </TableColumn>
        <TableColumn className='max-w-[80px] text-clip'>
          Cantidad
          <br />
          (Solo Kg)
        </TableColumn>
        <TableColumn>$xKG/U</TableColumn>
        <TableColumn>Total</TableColumn>
      </TableHeader>
      <TableBody>
        {selectedProducts?.map(product => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <Input
                placeholder='0.00'
                variant='underlined'
                value={(product.quantity ?? 0).toString()} // Asegurar que sea un string y tenga un valor inicial
                onValueChange={value =>
                  handleQuantityChange(product._id, value)
                }
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder={product.measurement === 'unit' ? '-' : '0.00'}
                variant='underlined'
                readOnly={product.measurement === 'unit'}
                disabled={product.measurement === 'unit'}
                onValueChange={value => handleWeightChange(product._id, value)}
              />
            </TableCell>
            <TableCell>
              {selectedList !== null ? (
                <EditProductPrice
                  initialPrice={
                    product.basePrices && selectedList !== null
                      ? product.basePrices[selectedList] // Precio base como número
                      : product.prices[selectedList]
                  }
                  onUpdatePrice={newPrice =>
                    onUpdatePrice(product._id, newPrice)
                  }
                />
              ) : (
                'N/A'
              )}
            </TableCell>
            <TableCell>
              {selectedList !== null
                ? (product.prices[selectedList] * product.quantity).toFixed(2)
                : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default React.memo(OrderResume)
