import ProductItem from "@/components/ProductItem";
import { Tab, Tabs } from "@nextui-org/react";
import ProductModal from "@/modals/ProductModal";
import React from "react";

const Productos = () => {
  const [selected, setSelected] = React.useState("precio1");

  const handleSelectionChange = (key: any) => {
    setSelected(key);
  };

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
