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
import { getPriceIndexFromSelected } from '@/utils/getPriceIndex'

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
  percent: { number: number }[]
  onProductsChange: (updatedProducts: Product[]) => void
  onUpdatePrice: (productId: string, newPrice: number) => void
}

const OrderResume: React.FC<OrderResumeProps> = ({
  selectedProducts,
  selectedList,
  percent,
  onTotalChange,
  onProductsChange,
  onUpdatePrice
}) => {
  const priceIndex = getPriceIndexFromSelected(selectedList, percent)
  
  useEffect(() => {
    const priceIndex = getPriceIndexFromSelected(selectedList, percent)
    const total = selectedProducts.reduce((sum, product) => {
      const price = product.prices[priceIndex] ?? 0
      return sum + price * product.quantity
    }, 0)
    onTotalChange(total)
  }, [selectedProducts, selectedList, percent])
  

  const handleQuantityChange = (id: string, value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, quantity: numValue } : product
      )
      onProductsChange(updatedProducts)
    }
  }

  const handleWeightChange = (id: string, value: string) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, units: numValue } : product
      )
      onProductsChange(updatedProducts)
    }
  }

console.log("SELECTEDPRODUCTS: ", selectedProducts);
console.log("selectedList:", selectedList)
console.log("percent:", percent.map(p => p.number))
console.log("priceIndex calculado:", getPriceIndexFromSelected(selectedList, percent))


return (
  <Table removeWrapper aria-label='Products table'>
    <TableHeader>
      <TableColumn className='text-center'>Nombre</TableColumn>
      <TableColumn className='text-center'>Cantidad</TableColumn>
      <TableColumn className='max-w-[80px] text-clip text-center'>
        Peso (Kg)
      </TableColumn>
      <TableColumn className='text-center'>$xKG/U</TableColumn>
      <TableColumn className='text-center'>Total</TableColumn>
    </TableHeader>
    <TableBody>
      {selectedProducts?.map(product => {
          const priceIndex = getPriceIndexFromSelected(selectedList, percent)
          const price = product.prices[priceIndex] ?? 0
          const basePrice = product.basePrices?.[priceIndex] ?? price

        return (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <Input
                placeholder='0.00'
                variant='underlined'
                onValueChange={value =>
                  product.measurement === 'unit'
                    ? handleQuantityChange(product._id, value)
                    : handleWeightChange(product._id, value)
                }
              />
            </TableCell>
            <TableCell>
              {product.measurement === 'kilogram' && (
                <Input
                  placeholder='0.00'
                  variant='underlined'
                  onValueChange={value =>
                    handleQuantityChange(product._id, value)
                  }
                />
              )}
            </TableCell>
            <TableCell>
            <EditProductPrice
          initialPrice={basePrice}
          onUpdatePrice={newPrice =>
            onUpdatePrice(product._id, newPrice)
          }
        />
            </TableCell>
            <TableCell>
              {(price * product.quantity).toFixed(2)}
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  </Table>
)
}


export default React.memo(OrderResume)
