import DelListModal from '@/modals/DeleteListModal'
import PercentModal from '@/modals/PercentModal'
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Percent } from 'react-feather'

export default function PercentList() {
  const [percent, setPercent] = useState<any[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  
  const checkList = percent.length <= 1;

  return (
    <Dropdown isOpen={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownTrigger>
        <Button>
          <Percent />
        </Button>
      </DropdownTrigger>
      <DropdownMenu closeOnSelect={false} aria-label='Static Actions' bottomContent={
        <PercentModal lastNumber={lastNumberPlusOne} onSuccess={() => { getData(); setDropdownOpen(true); }}/>}>
        {percent.map((e, index) => (
          <DropdownItem key={index}>
              <DelListModal percent={e.percent} number={e.number} index={index} onDeleteSuccess={getData} isLast={checkList}/>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
