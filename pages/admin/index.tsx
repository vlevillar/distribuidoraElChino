import React, { useState } from 'react'
import AdminTabs from '@/components/Admin/AdminTabs'
import SelectUser from '@/components/Admin/SelectUser'
import AddProducts from '@/views/Admin/AddProducts'
import AddOrder from '@/views/Admin/AddOrder'
import AddRoute from '@/views/Admin/AddRoute'
import AddClients from '@/views/Admin/AddClients'
import useAdminData from '@/hooks/UseAdminData'

export default function Admin() {
  const { users, clients, products, orders, selected, selectedUserId, setSelected, setSelectedUserId, setUserClients, userClients, setUserOrders, userOrders, setUserProducts, userProducts } = useAdminData()

  const handleOrderAssignmentChange = (orderId: string, isAssigned: boolean) => {
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

  const handleProductAssignmentChange = (productId: string, isAssigned: boolean) => {
    setUserProducts(prev => {
      const newSet = new Set(prev)
      if (isAssigned) {
        newSet.add(productId)
      } else {
        newSet.delete(productId)
      }
      return newSet
    })
  }

  const handleUserClientsChange = (newUserClients: Set<string>) => {
    setUserClients(newUserClients)
  }

  const tabComponents: { [key: string]: JSX.Element } = {
    clients: <AddClients clients={clients} selectedUserId={selectedUserId} userClients={userClients}  onUserClientsChange={handleUserClientsChange}/>,
    routes: <AddRoute selectedUserId={selectedUserId}/>,
    orders: <AddOrder orders={orders} selectedUserId={selectedUserId} userOrders={userOrders} onOrderAssignmentChange={handleOrderAssignmentChange}/>,
    products: <AddProducts products={products} selectedUserId={selectedUserId} userProducts={userProducts} onProductAssignmentChange={handleProductAssignmentChange}/>
  }

  console.log(selectedUserId);
  

  return (
    <div className='flex-col items-center justify-center gap-2'>
      <AdminTabs selected={selected} setSelected={setSelected} />
      <SelectUser users={users} onUserSelect={setSelectedUserId}/>
      <div className='mt-2 flex items-center justify-center'>
        {tabComponents[selected]}
      </div>
    </div>
  )
}
