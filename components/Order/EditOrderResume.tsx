import React, { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Selection
} from '@nextui-org/react'
import EditProductPrice from '@/modals/Order/EditProductPrice'

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
    Record<string, { quantity: number; weight: number }>
  >({})

  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      const isByWeight = product.measurement !== 'unit';
      const amount = isByWeight
        ? Number(productStates[product._id]?.weight || product.units || 0) // Peso en kg
        : Number(productStates[product._id]?.quantity || product.quantity); // Unidades
  
      const price = selectedList !== null ? product.prices[selectedList] || 0 : 0;
      return sum + price * amount;
    }, 0);
    onTotalChange(total);
  }, [selectedProducts, productStates, selectedList, onTotalChange]);
  

  useEffect(() => {
    const initialStates = selectedProducts.reduce(
      (acc, product) => {
        acc[product._id] = {
          quantity: product.quantity,
          weight: product.units ?? 0
        }
        return acc
      },
      {} as Record<string, { quantity: number; weight: number }>
    )
    setProductStates(initialStates)
  }, [selectedProducts])

  const handleProductChange = (
    id: string,
    key: 'quantity' | 'weight',
    value: string
  ) => {
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      setProductStates(prevStates => ({
        ...prevStates,
        [id]: {
          ...prevStates[id],
          [key]: numValue
        }
      }))

      const updatedProducts = selectedProducts.map(product =>
        product._id === id
          ? {
              ...product,
              [key === 'quantity' ? 'quantity' : 'units']: numValue
            }
          : product
      )
      onProductsChange(updatedProducts)
    }
  }

  return (
    <Table removeWrapper aria-label='Example static collection table'>
      <TableHeader>
        <TableColumn className='text-center'>Nombre</TableColumn>
        <TableColumn className='text-center'>Unidades</TableColumn>
        <TableColumn className='max-w-[80px] text-clip text-center'>
          Peso
          <br />
          <b>(Solo Kg)</b>
        </TableColumn>
        <TableColumn className='text-center'>$xKG/U</TableColumn>
        <TableColumn className='text-center'>Total</TableColumn>
      </TableHeader>
      <TableBody>
        {selectedProducts?.map(product => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <Input
                placeholder='0.00'
                variant='underlined'
                value={String(productStates[product._id]?.quantity ?? 0)}
                onValueChange={value =>
                  handleProductChange(product._id, 'quantity', value)
                }
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder={product.measurement === 'unit' ? '-' : '0.00'}
                variant='underlined'
                readOnly={product.measurement === 'unit'}
                disabled={product.measurement === 'unit'}
                value={String(productStates[product._id]?.weight ?? 0)}
                onValueChange={value =>
                  handleProductChange(product._id, 'weight', value)
                }
              />
            </TableCell>
            <TableCell>
              {selectedList !== null ? (
                <EditProductPrice
                  initialPrice={
                    product.basePrices && selectedList !== null
                      ? product.basePrices[selectedList]
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
    ? (
        product.prices[selectedList] *
        (product.measurement !== 'unit'
          ? Number(productStates[product._id]?.weight || product.units || 0) // Peso
          : Number(productStates[product._id]?.quantity || product.quantity) // Unidades
        )
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
