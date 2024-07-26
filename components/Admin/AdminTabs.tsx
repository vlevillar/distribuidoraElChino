import React, { useState } from 'react'
import { Tabs, Tab } from '@nextui-org/react'
import { Compass, List, ShoppingBag, User } from 'react-feather'
import AddClients from '@/views/Admin/AddClients'
import AddRoute from '@/views/Admin/AddRoute'
import AddOrder from '@/views/Admin/AddOrder'
import AddProducts from '@/views/Admin/AddProducts'

interface AdminTabsProps {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminTabs({ selected, setSelected }: AdminTabsProps) {

  const handleSelectionChange = (key: React.Key) => {
    setSelected(String(key))
  }

  return (
    <div className='flex items-center justify-center mb-2'>
      <Tabs
        aria-label='Options'
        color='primary'
        variant='bordered'
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
      >
        <Tab
          key='clients'
          title={
            <div className='flex items-center space-x-2'>
              <User />
              <span className='hidden sm:block'>Clientes</span>
            </div>
          }
        />
        <Tab
          key='routes'
          title={
            <div className='flex items-center space-x-2'>
              <Compass />
              <span className='hidden sm:block'>Rutas</span>
            </div>
          }
        />
        <Tab
          key='orders'
          title={
            <div className='flex items-center space-x-2'>
              <List />
              <span className='hidden sm:block'>Pedidos</span>
            </div>
          }
        />
        <Tab
          key='products'
          title={
            <div className='flex items-center space-x-2'>
              <ShoppingBag />
              <span className='hidden sm:block'>Productos</span>
            </div>
          }
        />
      </Tabs>
    </div>
  )
}
