import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []); // Este efecto ahora solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (products.length > 0 && initialProducts) {
      const initialSelectedChips = products.map(product =>
        initialProducts.some(initialProduct => initialProduct._id === product._id)
      );
      setSelectedChips(initialSelectedChips);
      setSelectedProducts(initialProducts);
    }
  }, [products, initialProducts]);

  const handleChipClick = useCallback((index: number) => {
    const selectedProduct = products[index];
    setSelectedProducts(prevSelectedProducts => {
      const isProductSelected = prevSelectedProducts.some(product => product._id === selectedProduct._id);
      if (isProductSelected) {
        return prevSelectedProducts.filter(product => product._id !== selectedProduct._id);
      } else {
        return [...prevSelectedProducts, { ...selectedProduct, quantity: 1 }];
      }
    });
  }, [products, selectedProducts]);

  useEffect(() => {
    const updatedSelectedChips = products.map(product =>
      selectedProducts.some(selectedProduct => selectedProduct._id === product._id)
    );
    setSelectedChips(updatedSelectedChips);
  }, [products, selectedProducts]);

  useEffect(() => {
    onSelectedProductChange(selectedProducts);
  }, [selectedProducts, onSelectedProductChange]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return filteredProducts.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredProducts]);

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