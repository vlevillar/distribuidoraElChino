import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';

interface ListTabsProps {
  handle: (key: string | number) => void;
  selected: string | number;
  list: Array<{ number: number }>;
}

const ListTabs: React.FC<ListTabsProps> = ({ handle, selected, list }) => {
  const extendedList = [{ number: 0, percent: 0 }, ...list]; // Agregar lista base manualmente

  return (
    <Tabs
      variant='bordered'
      onSelectionChange={handle}
      aria-label="Price Lists"
      selectedKey={selected}
    >
      {extendedList.map((e, index) => (
        <Tab key={index} title={`Lista ${e.number}`} />
      ))}
    </Tabs>
  );
};


export default ListTabs;