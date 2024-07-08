import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react';
import { DollarSign, Check } from 'react-feather';

interface Client {
  _id: string;
  name: string;
  address: string;
  phone: string;
  type: string;
  currentAccount: number;
}

interface AccountModalProps {
  client: Client;
  fetchData: () => void; // Add fetchData prop
}

const AccountModal: React.FC<AccountModalProps> = ({ client, fetchData }) => {
  const { _id, name, currentAccount } = client;
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [addDebtAmount, setAddDebtAmount] = useState('');

  const handleUpdateAccount = async (newAccountValue: number) => {
    try {
      const updatedClient = { ...client, currentAccount: newAccountValue, id: client._id };
      const response = await fetch(`${process.env.API_URL}/clients`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });

      if (response.ok) {
        console.log('Cuenta actualizada exitosamente');
        onClose()
        setIsFocused1(false);
        setIsFocused2(false);
        setPayAmount("")
        setAddDebtAmount("")
        fetchData();
      } else {
        console.error('Error al actualizar la cuenta');
      }
    } catch (error) {
      console.error('Error al actualizar la cuenta:', error);
    }
  };

  const handlePayDebt = () => {
    const amount = parseFloat(payAmount);
    if (!isNaN(amount)) {
      const newAccountValue = currentAccount - amount;
      handleUpdateAccount(newAccountValue);
    }
  };

  const handleAddDebt = () => {
    const amount = parseFloat(addDebtAmount);
    if (!isNaN(amount)) {
      const newAccountValue = currentAccount + amount;
      handleUpdateAccount(newAccountValue);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color='secondary' size='sm'>
        Cuenta corriente
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='center'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Cuenta corriente: {name}
              </ModalHeader>
              <ModalBody className='mb-2 items-center'>
              <p className='text-xl font-bold'>$ {currentAccount}</p>
                <Input
                  placeholder='Pagar deuda'
                  type='number'
                  color='success'
                  startContent={<DollarSign />}
                  endContent={
                    isFocused1 ? (
                      <Check className='cursor-pointer' onClick={handlePayDebt} />
                    ) : (
                      <div className='w-6'></div>
                    )
                  }
                  className={isFocused1 ? 'w-16' : 'w-24'}
                  onFocus={() => setIsFocused1(true)}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                />
                <Input
                  placeholder='Agregar deuda'
                  color='danger'
                  type='number'
                  startContent={<DollarSign />}
                  endContent={
                    isFocused2 ? (
                      <Check className='cursor-pointer' onClick={handleAddDebt} />
                    ) : (
                      <div className='w-6'></div>
                    )
                  }
                  className={isFocused2 ? 'w-16' : 'w-24'}
                  onFocus={() => setIsFocused2(true)}
                  value={addDebtAmount}
                  onChange={(e) => setAddDebtAmount(e.target.value)}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountModal;
