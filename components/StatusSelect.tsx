'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import React, { useState } from 'react'

type ButtonColor =
  | 'default'
  | 'success'
  | 'danger'
  | 'warning'
  | 'primary'
  | 'secondary'

export default function StatusSelect() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(['No visita'])
  )

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys]
  )

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedKeys(keys)
  }

  let buttonColor: ButtonColor = 'warning'
  if (selectedValue === 'venta') {
    buttonColor = 'success'
  } else if (selectedValue === 'no venta') {
    buttonColor = 'danger'
  } else if (selectedValue === 'no visita') {
    buttonColor = 'warning'
  }
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='bordered' className='capitalize' color={buttonColor}>
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        // @ts-ignore
        onSelectionChange={handleSelectionChange}
      >
        <DropdownItem key='venta'>Venta</DropdownItem>
        <DropdownItem key='no venta'>No venta</DropdownItem>
        <DropdownItem key='no visita'>No visita</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
