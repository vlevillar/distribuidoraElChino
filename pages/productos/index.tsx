import ProductItem from "@/components/ProductItem";
import { Tab, Tabs } from "@nextui-org/react";
import ProductModal from "@/modals/ProductModal";
import React, { useEffect, useState } from "react";

const Productos = () => {
  const [selected, setSelected] = React.useState("precio1");
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

  const handleSelectionChange = (key: any) => {
    setSelected(key);
  };

  console.log(percent);
  

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ProductModal />
        <div>
          <Tabs
            variant='underlined'
            onSelectionChange={handleSelectionChange}
            aria-label="Options"
            selectedKey={selected}
          >
            <Tab key="precio1" title="Lista 1" />
            <Tab key="precio2" title="Lista 2" />
            <Tab key="precio3" title="Lista 3" />
            <Tab key="precio4" title="Lista 4" />
          </Tabs>
        </div>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3">
        <ProductItem price={selected} />
        <ProductItem price={selected} />
        <ProductItem price={selected} />
        <ProductItem price={selected} />
      </div>
    </div>
  );
};

export default Productos;
