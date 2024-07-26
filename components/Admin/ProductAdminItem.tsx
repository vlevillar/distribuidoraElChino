import React from 'react'
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import DelProductModal from '@/modals/Products/DeleteProductModal'
import EditProduct from '@/modals/Products/EditProduct'

interface ProductItemProps {
  id: string
  price: string
  name: string
  fetchData?: () => void
  isAdmin?: boolean
  isAssigned: boolean
  selectedUserId: string | null
  onAssignmentChange: (productId: string, isAssigned: boolean) => void
}

export default function ProductAdminItem({
  id,
  price,
  name,
  fetchData,
  isAdmin,
  isAssigned,
  selectedUserId,
  onAssignmentChange
}: ProductItemProps) {
  const product = { _id: id, name, price }

  const handleAssignmentChange = async () => {
    if (selectedUserId) {
      const accessToken = localStorage.getItem('accessToken')
      try {
        const endpoint = isAssigned
          ? `${process.env.API_URL}/products/unassign/${id}/${selectedUserId}`
          : `${process.env.API_URL}/products/assign/${id}/${selectedUserId}`

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        onAssignmentChange(id, !isAssigned)
      } catch (error) {
        console.error("Error assigning/unassigning product:", error)
      }
    }
  }

  return (
    <Card 
      className={`max-w-[300px] ${isAssigned ? 'bg-green-800' : ''}`} 
      isPressable={!!selectedUserId}
      onPress={handleAssignmentChange}
    >
      <CardHeader className="flex gap-3 items-center justify-center">
        <div className="flex flex-col">
          <p className="text-md">{name}</p>
        </div>
      </CardHeader>
      {fetchData ? (
        <>
          <Divider />
          {isAdmin && (
            <CardBody className='flex items-center'>
              <p>${price}</p>
            </CardBody>
          )}
          <Divider />
          <CardFooter className='flex gap-3 justify-center items-center'>
            {isAdmin && (
              <EditProduct product={product} fetchData={fetchData} />
            )}
            <DelProductModal name={name} id={id} fetchData={fetchData} />
          </CardFooter>
        </>
      ) : null}
    </Card>
  )
}