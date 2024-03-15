import Calendario from '@/components/Calendario'
import RouteTable from '@/components/RouteTable'
import RouteTabs from '@/components/RouteTabs'

const Rutas = () => {

  return (
    <>
      <div className='flex flex-col justify-between p-4 md:flex-row'>
        <RouteTabs />
        <Calendario/>
      </div>
      <RouteTable />
    </>
  )
}

export default Rutas
