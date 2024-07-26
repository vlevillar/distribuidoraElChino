import React, { useMemo, useState } from 'react'
import { Input, Checkbox } from '@nextui-org/react'
import { Search } from 'react-feather'
import ProductAdminItem from '@/components/Admin/ProductAdminItem'

interface Product {
  _id: string
  price: string
  name: string
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
  const [searchValue, setSearchValue] = useState("")
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter(product => 
      product.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      (!showOnlyAssigned || userProducts.has(product._id))
    )
  }, [products, searchValue, showOnlyAssigned, userProducts])

  console.log(filteredProducts);
  

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <Input
        placeholder="Buscar productos"
        value={searchValue}
        onValueChange={setSearchValue}
        startContent={<Search/>}
        size='sm'
      />
      <Checkbox 
        isSelected={showOnlyAssigned}
        onValueChange={setShowOnlyAssigned}
        disabled={!selectedUserId}
      >
        Mostrar solo productos asignados
      </Checkbox>
      <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-1 mt-2">
        {filteredProducts.map((product) => (
          <ProductAdminItem
            key={product._id}
            id={product._id}
            price={product.price}
            name={product.name}
            isAssigned={userProducts.has(product._id)}
            selectedUserId={selectedUserId}
            onAssignmentChange={onProductAssignmentChange}
          />
        ))}
      </div>
    </div>
  )
}