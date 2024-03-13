import RouteTable from '@/components/RouteTable'
import RouteTabs from '@/components/RouteTabs'
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css'
import 'react-calendar/dist/Calendar.css'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { useState } from 'react'
import { ArrowLeftCircle, ArrowRightCircle, Calendar } from 'react-feather'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const Rutas = () => {
  const [value, onChange] = useState<Value>([new Date(), new Date()])
  return (
    <>
      <div className='flex flex-col justify-between p-4 md:flex-row'>
        <RouteTabs />
        <div className='flex items-center'>
          <ArrowLeftCircle className='mr-2'/>
          <DateRangePicker
            onChange={onChange}
            value={value}
            format='dd-MM-yy'
            calendarIcon={<Calendar />}
          />
          <ArrowRightCircle className='ml-2'/>
        </div>
      </div>
      <RouteTable />
    </>
  )
}

export default Rutas
