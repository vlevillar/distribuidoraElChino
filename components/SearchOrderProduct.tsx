import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Divider, Input, Chip } from '@nextui-org/react';
import { ShoppingBag } from 'react-feather';

interface Product {
  _id: string;
  code?: string;
  name: string;
  prices: number[];
  quantity: number;
  selectedMeasurement?: string; 
  selectedPrice?: number; 
}

interface SearchProductProps {
  onSelectedProductChange: (products: Product[]) => void;
  initialProducts?: Product[];
}

export default function SearchOrderProduct({ onSelectedProductChange, initialProducts }: SearchProductProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedChips, setSelectedChips] = useState<boolean[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data);
        const initialSelectedChips = data.map(product =>
          initialProducts?.some(initialProduct => initialProduct._id === product._id) ?? false
        );
        setSelectedChips(initialSelectedChips);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [initialProducts]);

  const handleChipClick = (index: number) => {
    setSelectedChips((prevSelectedChips: boolean[]) => {
      const updatedChips = [...prevSelectedChips];
      updatedChips[index] = !updatedChips[index];
      return updatedChips;
    });

    const selectedProduct = products[index];
    if (selectedChips[index]) {
      setSelectedProducts(prevSelectedProducts =>
        prevSelectedProducts.filter(product => product._id !== selectedProduct._id)
      );
    } else {
      setSelectedProducts(prevSelectedProducts => [...prevSelectedProducts, selectedProduct]);
    }
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
