import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface User {
  _id: string
  name: string
  username: string
  role: string
}

interface Product {
  _id: string
  name: string
  prices: number[]
  quantity: number
  measurement: string
}

interface Order {
  _id: string
  clientName: string
  clientId: string
  clientNumber: number
  products: Product[]
  discount: string
  selectedList: number
  date: string
  userId?: string
  deliveryDate: string
  description: string
}

const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState([])
  const [userOrders, setUserOrders] = useState<Set<string>>(new Set())
  const [userClients, setUserClients] = useState<Set<string>>(new Set())
  const [userProductsMap, setUserProductsMap] = useState<
    Map<string, Set<string>>
  >(new Map())
  const [userProducts, setUserProducts] = useState<Set<string>>(new Set())

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState('clients')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(9)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  const API = process.env.API_URL

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole !== 'admin') {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')

    const fetchData = async (url: string, setData: (data: any) => void) => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error(`Error fetching ${url}:`, error)
      }
    }

    fetchData(`${process.env.API_URL}/user`, setUsers)
    fetchData(`${process.env.API_URL}/clients`, setClients)
    fetchData(`${process.env.API_URL}/products`, setProducts)
  }, [])

  useEffect(() => {
    if (selectedUserId) {
      fetchClientsByUserId(selectedUserId)
      fetchOrdersByUserId(selectedUserId)

      if (!userProductsMap.has(selectedUserId)) {
        fetchProductsByUserId(selectedUserId)
      } else {
        const cached = userProductsMap.get(selectedUserId) || new Set()
        setUserProducts(cached)
        console.log('✅ Recuperado de cache:', selectedUserId, cached)
      }
    } else if (selectedUserId === null) {
      fetchClientsByUserId('null')
      fetchOrdersByUserId('null')
      fetchProductsByUserId('null')
    }
  }, [selectedUserId])

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(searchTerm ? { search: searchTerm } : {})
    })
    try {
      const res = await fetch(`${API}/orders/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error fetching orders')

      const json = (await res.json()) as {
        data: Order[]
        totalPages: number
      }
      setOrders(json.data)
      setTotalPages(json.totalPages)
    } catch (e) {
      console.error('Error fetching paginated orders:', e)
      setOrders([])
      setTotalPages(1)
    }
  }, [API, page, limit, searchTerm])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const fetchClientsByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(
        `${process.env.API_URL}/clients/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      if (!response.ok) {
        if (response.status === 500) {
          setUserClients(new Set())
        }
        throw new Error('Failed to fetch clients')
      }
      const data = await response.json()
      setUserClients(new Set(data.map((client: { _id: string }) => client._id)))
    } catch (error) {
      setUserClients(new Set())
      console.error('Error fetching clients by user ID:', error)
    }
  }

  const fetchOrdersByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(
        `${process.env.API_URL}/orders/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setUserOrders(new Set(data.map((order: { _id: string }) => order._id)))
    } catch (error) {
      console.error('Error fetching orders by user ID:', error)
      setUserOrders(new Set())
    }
  }

  const fetchProductsByUserId = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(
        `${process.env.API_URL}/products/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      const newSet: Set<string> = new Set<string>(
        (data as { _id: string }[]).map(product => product._id)
      )

      setUserProductsMap(prev => {
        const updated = new Map(prev)
        updated.set(userId, newSet)
        return updated
      })
      setUserProducts(newSet)
    } catch (error) {
      console.error('Error fetching products by user ID:', error)
      setUserProducts(new Set())
    }
  }

  return {
    users,
    clients,
    userClients,
    userOrders,
    userProducts,
    userProductsMap,
    products,
    orders,
    page,
    totalPages,
    searchTerm,
    selected,
    selectedUserId,
    setSelected,
    setUsers,
    setPage,
    setSearchTerm,
    setTotalPages,
    setUserClients,
    setUserOrders,
    setUserProducts,
    setUserProductsMap,
    setSelectedUserId
  }
}

export default useAdminData
