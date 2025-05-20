import React, { useState } from 'react'
import {
  Button,
  DateValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeCalendar,
  RangeValue
} from '@nextui-org/react'
import { Calendar, Check, X } from 'react-feather'
import { getLocalTimeZone, today } from '@internationalized/date'

type FilterType = 'creation' | 'delivery'

interface CalendarFilterProps {
  selectedFilter: FilterType
  setSelectedFilter: (filter: FilterType) => void
  setDateRange: (range: RangeValue<DateValue> | undefined) => void
}

const CalendarFilter: React.FC<CalendarFilterProps> = ({
  selectedFilter,
  setSelectedFilter,
  setDateRange
}) => {
  const [localValue, setLocalValue] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 })
  })

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter)
  }

  const handleApplyFilters = () => {
    setDateRange(localValue)
  }

  const handleClearFilters = () => {
    const defaultValue = {
      start: today(getLocalTimeZone()),
      end: today(getLocalTimeZone()).add({ weeks: 1 })
    }
    setLocalValue(defaultValue)  
    setDateRange(undefined) 
  }

  return (
    <Popover placement='bottom'>
      <PopoverTrigger>
        <Button>Filtrar por fecha</Button>
      </PopoverTrigger>
      <PopoverContent>
        <RangeCalendar
          value={localValue}
          onChange={setLocalValue} // Actualiza el valor local del calendario
          topContent={
            <div className='flex items-center gap-2'>
              <Button
                className={`max-w-full bg-content1 ${
                  selectedFilter === 'creation'
                    ? '[&>button]:border-primary [&>button]:text-primary'
                    : '[&>button]:border-default-200/60 [&>button]:text-default-500'
                }`}
                variant={selectedFilter === 'creation' ? 'bordered' : 'flat'}
                radius='full'
                size='sm'
                color={selectedFilter === 'creation' ? 'primary' : 'default'}
                onClick={() => handleFilterChange('creation')}
              >
                Fecha de creación
              </Button>
              <Button
                className={`max-w-full bg-content1 ${
                  selectedFilter === 'delivery'
                    ? '[&>button]:border-primary [&>button]:text-primary'
                    : '[&>button]:border-default-200/60 [&>button]:text-default-500'
                }`}
                variant={selectedFilter === 'delivery' ? 'bordered' : 'flat'}
                radius='full'
                size='sm'
                color={selectedFilter === 'delivery' ? 'primary' : 'default'}
                onClick={() => handleFilterChange('delivery')}
              >
                Fecha de entrega
              </Button>
            </div>
          }
          bottomContent={
            <div className='flex items-center justify-between gap-2'>
              <Button
                className='w-full'
                startContent={<Check size={'15px'} />}
                onClick={handleApplyFilters}
                color='primary'
                variant='ghost'
              >
                Aplicar
              </Button>
              <Button
                className='w-full'
                startContent={<X size={'15px'} />}
                onClick={handleClearFilters}
                color='danger'
                variant='ghost'
              >
                Limpiar
              </Button>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarFilter
