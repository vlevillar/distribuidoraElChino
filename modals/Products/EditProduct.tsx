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
import { Edit, DollarSign, Info } from 'react-feather';

interface Product {
  _id: string;
  name: string;
  price: string;
  measurement: string;
  code: string;
  estimate?: number; // o number, depende de tu backend
}

interface EditProductProps {
  product: Product;
  fetchData: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, fetchData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [measurement, setMeasurement] = useState(product.measurement);
  const [isKilogramChecked, setIsKilogramChecked] = useState(false);
  const [isUnitChecked, setIsUnitChecked] = useState(false);
  const [code, setCode] = useState(product.code);
  // Nueva propiedad "estimate"
  const [estimate, setEstimate] = useState(product.estimate ?? '');
  console.log(product);
  
  useEffect(() => {
    setName(product.name);
    setPrice(parseFloat(product.price).toFixed(2));
    setMeasurement(product.measurement);
    setCode(product.code);
    setEstimate(product.estimate ?? '');

    // Actualiza checkboxes segun measurement
    if (product.measurement === 'kilogram') {
      setIsKilogramChecked(true);
      setIsUnitChecked(false);
    } else if (product.measurement === 'unit') {
      setIsKilogramChecked(false);
      setIsUnitChecked(true);
    } else {
      setIsKilogramChecked(false);
      setIsUnitChecked(false);
    }
  }, [product]);

  const updateProduct = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No se encontró el token de acceso');
        return;
      }
      const response = await fetch(`${process.env.API_URL}/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          measurement: isKilogramChecked ? 'kilogram' : 'unit',
          code,
          estimate: isKilogramChecked ? estimate : 0,
        }),
      });
      if (response.ok) {
        console.log('Producto actualizado exitosamente');
        fetchData();
        onClose();
      } else {
        console.error('Error al actualizar Producto');
      }
    } catch (error) {
      console.error('Error al actualizar Producto:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen} color="default" size="sm">
        Editar
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Editar producto
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Nombre"
              placeholder="Nombre del producto"
              variant="bordered"
              endContent={<Edit />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Precio"
              placeholder="0.00"
              type="number"
              variant="bordered"
              endContent={<DollarSign />}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="flex gap-4">
              <Checkbox
                isSelected={isKilogramChecked}
                onChange={() => {
                  setIsKilogramChecked(!isKilogramChecked);
                  setIsUnitChecked(false);
                }}
              >
                Kg
              </Checkbox>
              <Checkbox
                isSelected={isUnitChecked}
                onChange={() => {
                  setIsUnitChecked(!isUnitChecked);
                  setIsKilogramChecked(false);
                }}
              >
                Unidad
              </Checkbox>
            </div>
            {/* Mostramos "estimado" si es kilogram */}
            {isKilogramChecked && (
              <Input
                label="Estimado por unidad (kg)"
                placeholder="0.00"
                type="number"
                variant="bordered"
                endContent={<Info />}
                value={estimate.toString()}
                onChange={(e) => setEstimate(e.target.value)}
              />
            )}
            <Input
              label="Código"
              placeholder="Código del producto"
              type="number"
              variant="bordered"
              endContent={<Edit />}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={onClose}>
              Cerrar
            </Button>
            <Button color="success" onClick={updateProduct}>
              Actualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditProduct;
