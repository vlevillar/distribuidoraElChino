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
  selectedMeasurement?: string;
  selectedPrice?: number;
}

interface ViewOrderResumeProps {
  orderData: Product[];
}

const ViewOrderResume: React.FC<ViewOrderResumeProps> = ({ orderData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
console.log(orderData);

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
                    {orderData.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.selectedMeasurement}</TableCell>
                        <TableCell>{product.selectedPrice?.toFixed(2)}</TableCell>
                        <TableCell>{(product.selectedPrice! * product.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
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
