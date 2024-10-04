import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';

interface ListSelectorProps {
  handle: (key: number) => void;
  selected: number | null;
  list: Array<{ number: number }>;
}

const ListSelector: React.FC<ListSelectorProps> = ({ handle, selected, list }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (number: number) => {
    handle(number); 
    setIsOpen(false);
  };

  const extendedList = [{ number: 0 }, ...list];

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)} placement='bottom'>
      <PopoverTrigger>
        <Button>
          {selected !== null ? `Lista ${selected}` : "Seleccione lista"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2 flex flex-col max-h-32 overflow-auto">
          {extendedList.map((item) => (
            <div>
            <Button
              key={item.number}
              size='sm'
              className="mb-2"
              onPress={() => handleSelect(item.number)}
              color={selected === item.number ? "primary" : "default"}
            >
              Lista {item.number}
            </Button>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListSelector;