import PercentModal from '@/modals/PercentModal'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Percent } from 'react-feather'

export default function PercentList() {
  const [percent, setPercent] = useState<any[]>([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const response = await fetch(
        `https://distributor-api.onrender.com/pricesList`,
        {
          method: 'GET'
        }
      )
      if (response.ok) {
        console.log('Datos obtenidos exitosamente')
        const data = await response.json()
        setPercent(data)
      } else {
        console.error('Error al obtener datos')
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
    }
  }

  const lastNumberPlusOne = percent.length > 0 ? percent[percent.length - 1].number + 1 : 1;
  

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button>
          <Percent />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions' bottomContent={
      //@ts-ignore
      <PercentModal lastNumber={lastNumberPlusOne} />}>
        {percent.map((e, index) => (
          <DropdownItem key={index}>
            <div className='flex justify-around'>
              <p>Lista {e.number}</p>
              <p>{e.percent}%</p>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
