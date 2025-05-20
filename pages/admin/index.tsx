import React, { useState } from 'react'
import AdminTabs from '@/components/Admin/AdminTabs'
import SelectUser from '@/components/Admin/SelectUser'
import AddProducts from '@/views/Admin/AddProducts'
import AddOrder from '@/views/Admin/AddOrder'
import AddRoute from '@/views/Admin/AddRoute'
import AddClients from '@/views/Admin/AddClients'
import useAdminData from '@/hooks/UseAdminData'
import DelUserModal from '@/modals/Admin/DeleteUserModal'

export default function Admin() {
  const {
    users,
    clients,
    products,
    orders,
    selected,
    selectedUserId,
    setSelected,
    setSelectedUserId,
    setUserClients,
    userClients,
    setUserOrders,
    userOrders,
    setUserProducts,
    userProducts,
    setUsers,
    page,
    setPage,
    totalPages,
    searchTerm,
    setSearchTerm
  } = useAdminData()

  const handleOrderAssignmentChange = (
    orderId: string,
    isAssigned: boolean
  ) => {
    setUserOrders(prev => {
      const newSet = new Set(prev)
      if (isAssigned) {
        newSet.add(orderId)
      } else {
        newSet.delete(orderId)
      }
      return newSet
    })
  }

  const handleProductAssignmentChange = async (
    productId: string,
    isCurrentlyAssigned: boolean
  ) => {
    setUserProducts(prev => {
      const newSet = new Set(prev)
      if (!isCurrentlyAssigned) {
        newSet.add(productId)
      } else {
        newSet.delete(productId)
      }
      return newSet
    })

    if (!selectedUserId) return

    const accessToken = localStorage.getItem('accessToken')
    const endpoint = isCurrentlyAssigned
      ? `${process.env.API_URL}/products/unassign/${productId}/${selectedUserId}`
      : `${process.env.API_URL}/products/assign/${productId}/${selectedUserId}`

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al asignar/desasignar producto')
      }
    } catch (error) {
      console.error('Error en el fetch de asignación:', error)
    }
  }

  const handleUserClientsChange = (newUserClients: Set<string>) => {
    setUserClients(newUserClients)
  }

  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      const response = await fetch(`${process.env.API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const selectedUser = users.find(user => user._id === selectedUserId)

  const tabComponents: { [key: string]: JSX.Element } = {
    clients: (
      <AddClients
        clients={clients}
        selectedUserId={selectedUserId}
        userClients={userClients}
        onUserClientsChange={handleUserClientsChange}
      />
    ),
    routes: <AddRoute selectedUserId={selectedUserId} />,
    orders: (
      <AddOrder
        orders={orders}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectedUserId={selectedUserId}
        userOrders={userOrders}
        onOrderAssignmentChange={handleOrderAssignmentChange}
      />
    ),
    products: (
      <AddProducts
        products={products}
        selectedUserId={selectedUserId}
        userProducts={userProducts}
        onProductAssignmentChange={handleProductAssignmentChange}
      />
    )
  }

  return (
    <div className='flex-col items-center justify-center gap-2 text-center'>
      <AdminTabs selected={selected} setSelected={setSelected} />
      <SelectUser users={users} onUserSelect={setSelectedUserId} />
      <div className='mt-2 flex items-center justify-center gap-2 text-center'>
        <p className='mt-1 text-sm text-gray-500'>
          {selectedUser
            ? `Nombre de usuario: ${selectedUser.username}`
            : 'No se ha seleccionado un usuario'}
        </p>
        <DelUserModal
          name={selectedUser?.name}
          id={selectedUser?._id}
          fetchData={fetchData}
        />
      </div>
      <div className='mt-2 flex items-center justify-center'>
        {tabComponents[selected]}
      </div>
    </div>
  )
}
