import React, { useState } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from '@nextui-org/react'

interface ListSelectorProps {
  handle: (key: number) => void
  selected: number | null
  list: Array<{ number: number }>
  isAdmin: boolean
}

const ListSelector: React.FC<ListSelectorProps> = ({
  handle,
  selected,
  list,
  isAdmin
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (number: number) => {
    handle(number)
    setIsOpen(false)
  }

  const extendedList = isAdmin
    ? [{ number: 0 }, ...list]
    : list.filter(
        item => item.number === 2 || item.number === 4 || item.number === 8
      )

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={open => setIsOpen(open)}
      placement='bottom'
    >
      <PopoverTrigger>
        <Button color={selected === null ? 'danger' : 'default'}>
          {selected !== null ? `Lista ${selected}` : 'Seleccione lista'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex max-h-32 flex-col overflow-auto px-1 py-2'>
          {extendedList.map(item => (
            <div key={item.number}>
              <Button
                key={item.number}
                size='sm'
                className='mb-2'
                onPress={() => handleSelect(item.number)}
                color={selected === item.number ? 'primary' : 'default'}
              >
                Lista {item.number}
              </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ListSelector
