import ProductItem from "@/components/ProductItem";
import { Tab, Tabs } from "@nextui-org/react";
import ProductModal from "@/modals/ProductModal";
import React, { useEffect, useState } from "react";
import DelList from "@/modals/DeleteListModal";

const Productos = () => {
  const [selected, setSelected] = React.useState("precio1");
  const [percent, setPercent] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getPricesList();
    getProducts();
  }, []);

  const getPricesList = async () => {
    try {
      const response = await fetch(
        `https://distributor-api.onrender.com/pricesList`,
        {
          method: 'GET'
        }
      );
      if (response.ok) {
        console.log('Datos de precios obtenidos exitosamente');
        const data = await response.json();
        setPercent(data);
      } else {
        console.error('Error al obtener datos de precios');
      }
    } catch (error) {
      console.error('Error al obtener datos de precios:', error);
    }
  };

  const getProducts = async () => {
    try {
      const response = await fetch(
        `https://distributor-api.onrender.com/products`,
        {
          method: 'GET'
        }
      );
      if (response.ok) {
        console.log('Datos de productos obtenidos exitosamente');
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error al obtener datos de productos');
      }
    } catch (error) {
      console.error('Error al obtener datos de productos:', error);
    }
  };

  const handleSelectionChange = (key: any) => {
    setSelected(key);
  };

  const handleProductCreated = () => {
    getProducts();
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ProductModal onProductCreated={handleProductCreated}/>
        <div>
          <Tabs
            variant='underlined'
            onSelectionChange={handleSelectionChange}
            aria-label="Options"
            selectedKey={selected}
          >
            {percent.map((e, index) => (
              <Tab key={index} title={"Lista " + e.number}/>
            ))}
          </Tabs>
        </div>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3">
        {products.map((product, index) => (        
          <ProductItem key={index} price={product.prices[selected]} name={product.name} />
        ))}
      </div>
    </div>
  );
};

export default Productos;
