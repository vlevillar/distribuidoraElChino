import React, { useEffect } from 'react'
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

interface Product {
  _id: string
  code?: string
  name: string
  prices: number[]
  quantity: number
  selectedMeasurement?: string
  selectedPrice?: number
}

interface EditOrderResumeProps {
  selectedProducts: Product[]
  selectedList: number
  onProductsChange: (updatedProducts: Product[]) => void
  onTotalChange: (total: number) => void
}

const EditOrderResume: React.FC<EditOrderResumeProps> = ({
  selectedProducts,
  selectedList,
  onTotalChange,
  onProductsChange
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState<{
    [key: string]: Selection
  }>({})
  const [quantities, setQuantities] = React.useState<{ [key: string]: string }>(
    {}
  )

  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      const quantity = Number(quantities[product._id] || product.quantity)
      const price = product.prices[selectedList]
      return sum + price * quantity
    }, 0)
    onTotalChange(total)
  }, [selectedProducts, quantities, selectedList, onTotalChange])

  useEffect(() => {
    const mergedArray = selectedProducts.map(product => {
      const selectedKey = Array.from(
        selectedKeys[product._id] || new Set(['Kg.'])
      )[0]
      const selectedKeyString = String(selectedKey)

      const selectedMeasurement =
        selectedKeyString === 'Kg.' ? 'kilogram' : 'unit'

      const pxkg = product.prices[selectedList]

      return {
        ...product,
        selectedMeasurement,
        quantity: Number(quantities[product._id] || product.quantity),
        selectedPrice: pxkg
      }
    })

  }, [selectedProducts, selectedKeys, quantities, selectedList])

  useEffect(() => {
    const initialQuantities: { [key: string]: string } = {}
    selectedProducts.forEach(product => {
      initialQuantities[product._id] = String(product.quantity)
    })
    setQuantities(initialQuantities)
  }, [selectedProducts])

  const handleQuantityChange = (id: string, value: string) => {
    console.log('Changing quantity:', id, value)
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, quantity: numValue } : product
      )
      setQuantities(prevQuantities => ({ ...prevQuantities, [id]: value })) // Actualiza las cantidades
      onProductsChange(updatedProducts)
    }
  }

  const handleSelectionChange = (id: string, keys: Selection) => {
    setSelectedKeys(prev => ({ ...prev, [id]: keys }))
  }

  const getSelectedValue = (id: string) => {
    return Array.from(selectedKeys[id] || new Set(['Kg.']))
      .join(', ')
      .replaceAll('_', ' ')
  }

  return (
    <Table removeWrapper aria-label='Example static collection table'>
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Cantidad</TableColumn>
        <TableColumn>KG/U</TableColumn>
        <TableColumn>PxKG/U</TableColumn>
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
                type='number'
                onChange={e =>
                  handleQuantityChange(product._id, e.target.value)
                }
                value={String(product.quantity)}
              />
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant='bordered' className='capitalize'>
                    {getSelectedValue(product._id)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='Single selection example'
                  variant='flat'
                  disallowEmptySelection
                  selectionMode='single'
                  selectedKeys={selectedKeys[product._id] || new Set(['Kg.'])}
                  onSelectionChange={(keys: Selection) =>
                    handleSelectionChange(product._id, keys)
                  }
                >
                  <DropdownItem key='Kg.'>KG</DropdownItem>
                  <DropdownItem key='U.'>U.</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
            <TableCell>{product.prices[selectedList].toFixed(2)}</TableCell>
            <TableCell>
              {(
                product.prices[selectedList] *
                Number(quantities[product._id] || product.quantity)
              ).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default EditOrderResume
