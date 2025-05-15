import React, { useEffect, useMemo, useState } from 'react'
import { Input, Checkbox, CircularProgress } from '@nextui-org/react'
import { Check, Search } from 'react-feather'
import ProductAdminItem from '@/components/Admin/ProductAdminItem'

interface Product {
  _id: string
  price: string
  name: string
  measurement: string
  code: string
}

interface AddProductsProps {
  products?: Product[]
  selectedUserId: string | null
  userProducts: Set<string>
  onProductAssignmentChange: (productId: string, isAssigned: boolean) => void
}

export default function AddProducts({
  products = [],
  selectedUserId,
  userProducts,
  onProductAssignmentChange
}: AddProductsProps) {
  const [searchValue, setSearchValue] = useState('')
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const [bulkDone, setBulkDone] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter(
      product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        (!showOnlyAssigned || userProducts.has(product._id))
    )
  }, [products, searchValue, showOnlyAssigned, userProducts])

  const handleSelectAllChange = async (checked: boolean) => {
    setSelectAll(checked)
    setIsBulkLoading(true)
    setBulkDone(false)

    const promises = filteredProducts.map(product => {
      const alreadyAssigned = userProducts.has(product._id)
      if (checked !== alreadyAssigned) {
        return onProductAssignmentChange(product._id, alreadyAssigned)
      }
      return Promise.resolve()
    })

    await Promise.all(promises)

    setIsBulkLoading(false)
    setBulkDone(true)

    setTimeout(() => {
      setBulkDone(false)
    }, 2500)
  }

  useEffect(() => {
    if (!showOnlyAssigned) {
      const allSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every(p => userProducts.has(p._id))
      setSelectAll(allSelected)
    } else {
      setSelectAll(false)
    }
  }, [filteredProducts, userProducts, showOnlyAssigned])

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Input
        placeholder='Buscar productos'
        value={searchValue}
        onValueChange={setSearchValue}
        startContent={<Search />}
        size='sm'
      />
      <div className='flex gap-4'>
        <div>
          <Checkbox
            isSelected={showOnlyAssigned}
            onValueChange={setShowOnlyAssigned}
            isDisabled={!selectedUserId}
          >
            Mostrar solo productos asignados
          </Checkbox>
        </div>
        <div>
          <Checkbox
            isSelected={selectAll}
            onValueChange={handleSelectAllChange}
            isDisabled={!selectedUserId || filteredProducts.length === 0}
          >
            <div className='flex items-center gap-2'>
              Seleccionar todos los productos
              {isBulkLoading && (
                <CircularProgress aria-label='Loading...' size='sm' />
              )}
              {bulkDone && !isBulkLoading && <Check size={16} color='green' />}
            </div>
          </Checkbox>
        </div>
      </div>

      <div className='xs:grid-cols-1 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {filteredProducts.map(product => (
          <ProductAdminItem
            key={product._id}
            id={product._id}
            price={product.price}
            name={product.name}
            measurement={product.measurement}
            code={product.code}
            isAssigned={userProducts.has(product._id)}
            selectedUserId={selectedUserId}
            onAssignmentChange={onProductAssignmentChange}
          />
        ))}
      </div>
    </div>
  )
}
