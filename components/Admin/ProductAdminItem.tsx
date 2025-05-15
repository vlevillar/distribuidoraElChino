import React from 'react'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'
import DelProductModal from '@/modals/Products/DeleteProductModal'
import EditProduct from '@/modals/Products/EditProduct'

interface ProductItemProps {
  id: string
  price: string
  name: string
  measurement: string
  code: string
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
  measurement,
  code,
  fetchData,
  isAdmin,
  isAssigned,
  selectedUserId,
  onAssignmentChange
}: ProductItemProps) {
  const product = { _id: id, name, price, measurement, code }

  const handleAssignmentChange = () => {
    onAssignmentChange(id, isAssigned)
  }

  return (
    <Card
      className={`max-w-[300px] ${isAssigned ? 'bg-green-800' : ''}`}
      isPressable={!!selectedUserId}
      onPress={handleAssignmentChange}
    >
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{name}</p>
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
          <CardFooter className='flex items-center justify-center gap-3'>
            {isAdmin && <EditProduct product={product} fetchData={fetchData} />}
            <DelProductModal name={name} id={id} fetchData={fetchData} />
          </CardFooter>
        </>
      ) : null}
    </Card>
  )
}
