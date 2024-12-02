import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';

interface Product {
  _id: string;
  name: string;
  prices: number[];
  quantity: number;
  units?: number
  measurement: string;
}

interface ViewOrderResumeProps {
  orderData: Product[];
  selectedList: number; 
}

const ViewOrderResume: React.FC<ViewOrderResumeProps> = ({ orderData, selectedList }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return (
    <>
      <Button onPress={onOpen} size='sm' variant='light'>
        {orderData.length} artículos
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex justify-center items-center'>
                {orderData.length} artículos:
              </ModalHeader>
              <ModalBody>
                <Table aria-label='Order summary'>
                  <TableHeader>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Cantidad</TableColumn>
                    <TableColumn>KG/U</TableColumn>
                    <TableColumn>PxKG/U</TableColumn>
                    <TableColumn>Total</TableColumn>
                  </TableHeader>
                  <TableBody>
                  {orderData.map((product) => {
                      const measurement = product.measurement === 'unit' ? 'U.' : 'Kg.';
                      return (
                        <TableRow key={product._id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{measurement}</TableCell>
                          <TableCell>{product.prices[selectedList]?.toFixed(2)}</TableCell>
                          <TableCell>{(product.prices[selectedList] * product.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='flat' onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewOrderResume;
