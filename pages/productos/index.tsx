import ProductItem from '@/components/Products/ProductItem'
import { Input } from '@nextui-org/react'
import ProductModal from '@/modals/Products/ProductModal'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Search } from 'react-feather'
import ListSelector from '@/components/Percent/ListSelector'

const Productos = () => {
  const [selected, setSelected] = useState<number | null>(null)
  const [percent, setPercent] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdmin, setIsAdmin] = React.useState(false)
  const router = useRouter()

  useEffect(() => {
    const admin = localStorage.getItem('role')
    getPricesList()
    getProducts()
    setIsAdmin(admin === 'admin')
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.error('No se encontró el token de acceso')
      router.push('/')
      return
    }
  }, [])

  const getPricesList = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/pricesList`, {
        method: 'GET'
      })
      if (response.ok) {
        console.log('Datos de precios obtenidos exitosamente')
        const data = await response.json()
        setPercent(data)
      } else {
        console.error('Error al obtener datos de precios')
      }
    } catch (error) {
      console.error('Error al obtener datos de precios:', error)
    }
  }

  const getProducts = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('No se encontró el token de acceso')
        return
      }
      const response = await fetch(`${process.env.API_URL}/products`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      if (response.ok) {
        console.log('Datos de productos obtenidos exitosamente')
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Error al obtener datos de productos')
      }
    } catch (error) {
      console.error('Error al obtener datos de productos:', error)
    }
  }

  const handleSelectionChange = (key: number) => {
    setSelected(key)
  }

  const handleProductCreated = () => {
    getProducts()
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPrice = (product: any, selectedList: string | number) => {
    const listIndex =
      typeof selectedList === 'string' ? parseInt(selectedList) : selectedList
    return product.prices[listIndex] || product.prices[0]
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex flex-col pb-4'>
        {isAdmin ? (
          <ProductModal onProductCreated={handleProductCreated} />
        ) : null}
        <div className='flex justify-center pt-2'>
          <ListSelector
            handle={handleSelectionChange}
            selected={selected}
            list={percent}
            isAdmin={isAdmin}
          />
        </div>
      </div>
      <div className='pb-4'>
        <Input
          startContent={<Search />}
          type='text'
          placeholder='Buscar productos...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-3'>
        {filteredProducts.map((product, index) => (
          <ProductItem
            key={index}
            price={getPrice(product, selected ?? 0)}
            name={product.name}
            id={product._id}
            fetchData={getProducts}
            isAdmin={isAdmin}
            measurement={product.measurement}
            code={product.code}
          />
        ))}
      </div>
    </div>
  )
}

export default Productos
