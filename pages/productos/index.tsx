import ProductItem from "@/components/ProductItem"
import { Button } from "@nextui-org/react"
import { PlusCircle } from 'react-feather'

const Productos = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col">
        <div className="pb-4">
        <Button startContent={<PlusCircle/>} color="success">
          Agregar Producto
        </Button>
        </div>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3">
        <ProductItem/>
        <ProductItem/>
        <ProductItem/>
        <ProductItem/>
        </div>
      </div>
    </>
  )
}

export default Productos