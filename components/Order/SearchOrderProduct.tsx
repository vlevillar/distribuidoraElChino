import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(initialProducts || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('No se encontró el token de acceso');
          return;
        }
        const response = await fetch(`${process.env.API_URL}/products`, {
          headers:{'Authorization': `Bearer ${accessToken}`}
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        setProducts(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length > 0 && initialProducts) {
      setSelectedProducts(initialProducts);
    }
  }, [products, initialProducts]);

  const handleChipClick = useCallback((productId: string) => {
    setSelectedProducts(prevSelectedProducts => {
      const isProductSelected = prevSelectedProducts.some(product => product._id === productId);
      if (isProductSelected) {
        return prevSelectedProducts.filter(product => product._id !== productId);
      } else {
        const selectedProduct = products.find(product => product._id === productId);
        return selectedProduct ? [...prevSelectedProducts, { ...selectedProduct, quantity: 1 }] : prevSelectedProducts;
      }
    });
  }, [products]);

  useEffect(() => {
    onSelectedProductChange(selectedProducts);
  }, [selectedProducts, onSelectedProductChange]);

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  useEffect(() => {
    setDisplayedProducts(filteredProducts.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(filteredProducts.length > PRODUCTS_PER_PAGE);
  }, [searchTerm, filteredProducts]);

  const loadMoreProducts = useCallback(() => {
    if (loading) return;
    setLoading(true);
    const nextProducts = filteredProducts.slice(page * PRODUCTS_PER_PAGE, (page + 1) * PRODUCTS_PER_PAGE);
    setDisplayedProducts(prev => [...prev, ...nextProducts]);
    setPage(prev => prev + 1);
    setHasMore(filteredProducts.length > (page + 1) * PRODUCTS_PER_PAGE);
    setLoading(false);
  }, [filteredProducts, page, loading]);

  const lastProductElementRef = useCallback((node: HTMLElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadMoreProducts, hasMore]);

  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Input
          placeholder="Buscar Producto"
          startContent={<ShoppingBag />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="scroll-container flex h-24 flex-wrap gap-1 overflow-y-auto">
          {displayedProducts.map((product, index) => (
            <Chip
              key={product._id}
              onClick={() => handleChipClick(product._id)}
              color={selectedProducts.some(selectedProduct => selectedProduct._id === product._id) ? 'success' : 'default'}
              ref={index === displayedProducts.length - 1 ? lastProductElementRef : null}
            >
              {product.name}
            </Chip>
          ))}
          {loading && <div>Loading...</div>}
        </div>
      </CardBody>
    </Card>
  );
}