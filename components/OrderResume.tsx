import React, { useEffect } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Selection,
} from '@nextui-org/react';

interface Product {
  _id: string;
  code?: string;
  name: string;
  prices: number[];
  quantity: number;
  selectedMeasurement?: string;
  selectedPrice?: number;
}

interface OrderResumeProps {
  selectedProducts: Product[];
  selectedList: number;
  onTotalChange: (total: number) => void;
  onProductsChange: (updatedProducts: Product[]) => void;
}

const OrderResume: React.FC<OrderResumeProps> = ({
  selectedProducts,
  selectedList,
  onTotalChange,
  onProductsChange
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState<{ [key: string]: Selection }>({});

  useEffect(() => {
    calculateTotal();
  }, [selectedProducts, selectedList]);

  const handleQuantityChange = (id: string, value: string) => {
    console.log('Changing quantity:', id, value);
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const updatedProducts = selectedProducts.map(product =>
        product._id === id ? { ...product, quantity: numValue } : product
      );
      onProductsChange(updatedProducts);
    }
  };

  const handleSelectionChange = (id: string, keys: Selection) => {
    setSelectedKeys(prev => ({ ...prev, [id]: keys }));
    const selectedKey = Array.from(keys)[0] as string;
    const updatedProducts = selectedProducts.map(product =>
      product._id === id ? { ...product, selectedMeasurement: selectedKey === 'Kg.' ? 'kilogram' : 'unit' } : product
    );
    onProductsChange(updatedProducts);
  };

  const calculateTotal = () => {
    const total = selectedProducts.reduce((sum, product) => {
      const price = product.prices[selectedList];
      return sum + price * product.quantity;
    }, 0);
    onTotalChange(total);
  };

  const getSelectedValue = (id: string) => {
    return Array.from(selectedKeys[id] || new Set(['Kg.'])).join(', ').replaceAll('_', ' ');
  };

  return (
    <Table removeWrapper aria-label='Products table'>
      <TableHeader>
        <TableColumn>Nombre</TableColumn>
        <TableColumn>Cantidad</TableColumn>
        <TableColumn>KG/U</TableColumn>
        <TableColumn>PxKG/U</TableColumn>
        <TableColumn>Total</TableColumn>
      </TableHeader>
      <TableBody>
        {selectedProducts?.map((product) => (
          <TableRow key={product._id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>
              <Input
                type="number"
                placeholder="0.00"
                variant="underlined"
                value={product.quantity.toString()}
                onValueChange={(value) => handleQuantityChange(product._id, value)}
              />
            </TableCell>
            <TableCell>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant='bordered' className='capitalize'>
                    {getSelectedValue(product._id)}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='Measurement selection'
                  variant='flat'
                  disallowEmptySelection
                  selectionMode='single'
                  selectedKeys={selectedKeys[product._id] || new Set(['Kg.'])}
                  onSelectionChange={(keys) => handleSelectionChange(product._id, keys)}
                >
                  <DropdownItem key='Kg.'>KG</DropdownItem>
                  <DropdownItem key='U.'>U.</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </TableCell>
            <TableCell>{product.prices[selectedList].toFixed(2)}</TableCell>
            <TableCell>{(product.prices[selectedList] * product.quantity).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderResume;