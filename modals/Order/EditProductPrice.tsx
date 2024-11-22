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
  import { DollarSign, Minus, Percent } from "react-feather";
  
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
  
    const finalPrice =
      initialPrice - (initialPrice * percentage) / 100;
  
      const handleUpdate = () => {
        const finalPrice = initialPrice - ((initialPrice) * percentage) / 100;
        onUpdatePrice(finalPrice);
        onOpenChange();
      };
      
  
    return (
      <>
        <Button onPress={onOpen} variant="light">${initialPrice} {percentage ? `- ${percentage}%` : null}</Button>
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
                      value={initialPrice.toString()}
                      startContent={<DollarSign />}
                      readOnly
                    />
                  </div>
                  <div>
                    <label>Descuento:</label>
                    <Input
                      type="number"
                      value={percentage.toString()}
                      onChange={(e) =>
                        setPercentage(parseFloat(e.target.value) || 0)
                      }
                      startContent={<Minus />}
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
  