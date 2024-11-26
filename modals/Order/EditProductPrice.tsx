import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { DollarSign, Minus, Percent, Plus } from "react-feather";

interface EditProductPriceProps {
  initialPrice: number;
  onUpdatePrice: (newPrice: number) => void;
}

export default function EditProductPrice({
  initialPrice,
  onUpdatePrice,
}: EditProductPriceProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [percentage, setPercentage] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const roundedInitialPrice = parseFloat(initialPrice.toFixed(2));

  const finalPrice = isAdding
    ? roundedInitialPrice + (roundedInitialPrice * percentage) / 100
    : roundedInitialPrice - (roundedInitialPrice * percentage) / 100;

  const handleUpdate = () => {
    onUpdatePrice(finalPrice);
    onOpenChange();
  };

  const toggleOperation = () => {
    setIsAdding((prev) => !prev);
  };

  return (
    <>
      <Button onPress={onOpen} variant="light">
        ${roundedInitialPrice} {percentage ? (isAdding ? `+ ${percentage}%` : `- ${percentage}%`) : null}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Precio del Producto
              </ModalHeader>
              <ModalBody>
                <div>
                  <label>Precio Base:</label>
                  <Input
                    type="number"
                    value={roundedInitialPrice.toString()}
                    startContent={<DollarSign />}
                    readOnly
                  />
                </div>
                <div>
                  <label>Descuento o Incremento:</label>
                  <Input
                    type="number"
                    value={percentage.toString()}
                    onChange={(e) =>
                      setPercentage(parseFloat(e.target.value) || 0)
                    }
                    startContent={
                      isAdding ? (
                        <Plus onClick={toggleOperation} className="cursor-pointer"/>
                      ) : (
                        <Minus onClick={toggleOperation} className="cursor-pointer"/>
                      )
                    }
                    endContent={<Percent />}
                  />
                </div>
                <div>
                  <strong>Precio Final:</strong> ${finalPrice.toFixed(2)}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleUpdate}>
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
