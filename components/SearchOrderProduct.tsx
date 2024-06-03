import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Input,
  Chip,
} from '@nextui-org/react';
import { ShoppingBag } from 'react-feather';

interface Product {
  _id: string;
  name: string;
  prices: number[];
  measurement: string;
  quantity: number;
}

interface SearchProductProps {
  onSelectedProductChange: (products: Product[]) => void;
}

export default function SearchOrderProduct({ onSelectedProductChange }: SearchProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedChips, setSelectedChips] = useState<boolean[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://distributor-api.onrender.com/products'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setSelectedChips(new Array(data.length).fill(false));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleChipClick = (index: number) => {
    setSelectedChips((prevSelectedChips: boolean[]) => {
      const updatedChips = [...prevSelectedChips];
      updatedChips[index] = !updatedChips[index];
      return updatedChips;
    });
  
    const selectedProduct = filteredProducts[index];
    setSelectedProducts((prevSelectedProducts) => {
      if (selectedChips[index]) {
        return prevSelectedProducts.filter(product => product._id !== selectedProduct._id);
      } else {
        return [...prevSelectedProducts, selectedProduct];
      }
    });
  };

  useEffect(() => {
    onSelectedProductChange(selectedProducts);
  }, [selectedProducts, onSelectedProductChange]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = filteredProducts.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className='max-w-[400px]'>
      <CardHeader className='flex gap-3'>
        <Input
          placeholder='Buscar Producto'
          startContent={<ShoppingBag />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className='scroll-container flex h-24 flex-wrap gap-1 overflow-y-auto'>
          {sortedProducts.map((product, index) => (
            <Chip
              key={product._id}
              onClick={() => handleChipClick(index)}
              color={selectedChips[index] ? 'success' : 'default'}
            >
              {product.name}
            </Chip>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
