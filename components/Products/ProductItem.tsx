import DelProductModal from '@/modals/Products/DeleteProductModal'
import EditProduct from '@/modals/Products/EditProduct'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider
} from '@nextui-org/react'

interface ProductItemProps {
  id: string
  price: string
  estimate?: number
  name: string
  fetchData?: () => void
  isAdmin?: boolean
  code: string
  measurement: string
}

export default function ProductItem({
  price,
  name,
  estimate,
  id,
  code,
  measurement,
  fetchData,
  isAdmin
}: ProductItemProps) {
  const product = { _id: id, name, price, code, measurement, estimate }

  return (
    <Card className='max-w-[300px]'>
      <CardHeader className='flex items-center justify-center gap-3'>
        <div className='flex flex-col'>
          <p className='text-md'>{name}</p>
        </div>
      </CardHeader>
      {fetchData ? (
        <>
          <Divider />
          <CardBody className='flex items-center'>
            <p>${parseFloat(price).toFixed(2)}</p>
          </CardBody>
          {isAdmin ? (
            <>
              <Divider />
              <CardFooter className='flex items-center justify-center gap-3'>
                <EditProduct product={product} fetchData={fetchData} />
                <DelProductModal name={name} id={id} fetchData={fetchData} />
              </CardFooter>
            </>
          ) : null}
        </>
      ) : null}
    </Card>
  )
}
