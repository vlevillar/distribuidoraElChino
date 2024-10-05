import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';

interface ListSelectorProps {
  handle: (key: number) => void;
  selected: number | null;
  list: Array<{ number: number }>;
  isAdmin: boolean;
}

const ListSelector: React.FC<ListSelectorProps> = ({ handle, selected, list, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (number: number) => {
    handle(number); 
    setIsOpen(false);
  };

  const extendedList = isAdmin
    ? [{ number: 0 }, ...list]
    : list.filter(item => item.number === 1 || item.number === 2);

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
            <div key={item.number}>
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