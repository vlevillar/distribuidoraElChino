import React, { useEffect, useState } from 'react'
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
  name: string
  prices: number[]
  quantity: number // Usado para kilogramos o unidades
  units?: number // Solo relevante para productos por peso (kilogramos)
  basePrices?: number[]
  measurement?: string // 'unit' o 'kilogram'
}

interface EditOrderResumeProps {
  selectedProducts: Product[]
  selectedList: number | null
  onProductsChange: (updatedProducts: Product[]) => void
  onTotalChange: (total: number) => void
  onUpdatePrice: (productId: string, newPrice: number) => void
}

const EditOrderResume: React.FC<EditOrderResumeProps> = ({
  selectedProducts,
  selectedList,
  onTotalChange,
  onProductsChange,
  onUpdatePrice
}) => {
  const [productStates, setProductStates] = useState<
    Record<string, { quantity: number; units: number }>
  >({})

  useEffect(() => {
    const initialStates = selectedProducts.reduce(
      (acc, product) => ({
        ...acc,
        [product._id]: {
          quantity: product.quantity,
          units: product.units || 0
        }
      }),
      {}
    )
    setProductStates(initialStates)
  }, [selectedProducts])

  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      const quantity =
        product.measurement === 'kilogram'
          ? productStates[product._id]?.quantity || 0
          : productStates[product._id]?.quantity || 0 // Para productos por unidad
      const price = selectedList !== null ? product.prices[selectedList] || 0 : 0
      return sum + price * quantity
    }, 0)
    onTotalChange(total)
  }, [selectedProducts, productStates, selectedList, onTotalChange])

  const handleProductChange = (
    id: string,
    key: 'quantity' | 'units',
    value: string
  ) => {
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setProductStates(prevStates => ({
        ...prevStates,
        [id]: {
          ...prevStates[id],
          [key]: numValue
        }
      }))
      const updatedProducts = selectedProducts.map(product =>
        product._id === id
          ? { ...product, [key]: numValue }
          : product
      )
      onProductsChange(updatedProducts)
    }
  }

  return (
    <Table removeWrapper aria-label="Order Resume Table">
      <TableHeader>
        <TableColumn className="text-center">Nombre</TableColumn>
        <TableColumn className="text-center">Cantidad</TableColumn>
        <TableColumn className="max-w-[80px] text-clip text-center">
          Peso (Kg)
        </TableColumn>
        <TableColumn className="text-center">$xKG/U</TableColumn>
        <TableColumn className="text-center">Total</TableColumn>
      </TableHeader>
      <TableBody>
        {selectedProducts.map(product => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <Input
                placeholder="0"
                variant="underlined"
                value={String(
                  product.measurement === 'kilogram'
                    ? productStates[product._id]?.units || product.units || 0
                    : productStates[product._id]?.quantity || product.quantity
                )}
                onValueChange={value =>
                  handleProductChange(
                    product._id,
                    product.measurement === 'kilogram' ? 'units' : 'quantity',
                    value
                  )
                }
              />
            </TableCell>
            <TableCell>
              {product.measurement === 'kilogram' && (
                <Input
                  placeholder="0.00"
                  variant="underlined"
                  value={String(
                    productStates[product._id]?.quantity || product.quantity
                  )}
                  onValueChange={value =>
                    handleProductChange(product._id, 'quantity', value)
                  }
                />
              )}
            </TableCell>
            <TableCell>
              {selectedList !== null ? (
                <EditProductPrice
                  initialPrice={product.prices[selectedList]}
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
                ? (
                    (product.prices[selectedList] || 0) *
                    (product.measurement === 'kilogram'
                      ? productStates[product._id]?.quantity || 0
                      : productStates[product._id]?.quantity || 0)
                  ).toFixed(2)
                : 'N/A'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default EditOrderResume
