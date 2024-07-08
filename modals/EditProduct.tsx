import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
} from '@nextui-org/react';
import { Edit, DollarSign } from 'react-feather';

interface Product {
  _id: string;
  name: string;
  price: string;
}

interface EditProductProps {
  product: Product;
  fetchData: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, fetchData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);

  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
  }, [product]);

  const updateProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/products/${product._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            price: parseFloat(price),
          }),
        }
      );
      if (response.ok) {
        console.log('Producto actualizado exitosamente');
        onClose();
        fetchData();
      } else {
        console.error('Error al actualizar Producto');
      }
    } catch (error) {
      console.error('Error al actualizar Producto:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} color='default' size='sm'>
        Editar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement='center'>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>
            Editar producto
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label='Nombre'
              placeholder='Nombre del producto'
              variant='bordered'
              endContent={<Edit />}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Input
              label='Precio'
              placeholder='0.00'
              type='number'
              variant='bordered'
              endContent={<DollarSign />}
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='flat' onClick={onClose}>
              Cerrar
            </Button>
            <Button color='success' onClick={updateProduct}>
              Actualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProduct;
