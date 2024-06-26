import ProductItem from "@/components/ProductItem";
import { Tab, Tabs } from "@nextui-org/react";
import ProductModal from "@/modals/ProductModal";
import React, { useEffect, useState } from "react";
import ListTabs from "@/components/ListTabs";

const Productos = () => {
  const [selected, setSelected] = useState(1);
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

  console.log(products);
  

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="pb-4 flex flex-col">
        <ProductModal onProductCreated={handleProductCreated} />
        <div className="flex justify-center pt-2">
          <ListTabs handle={handleSelectionChange} selected={selected} list={percent} />
        </div>
      </div>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3">
        {products.map((product, index) => (
          <ProductItem key={index} price={product.prices[selected]} name={product.name} id={product._id} fetchData={getProducts}/>
        ))}
      </div>
    </div>
  );
};

export default Productos;
