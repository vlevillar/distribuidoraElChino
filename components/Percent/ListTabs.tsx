import { Tab, Tabs } from '@nextui-org/react';
import React from 'react';

interface ListTabsProps {
  handle: (key: any) => void;
  selected: any;
  list: Array<{ number: number }>;
}

const ListTabs: React.FC<ListTabsProps> = ({ handle, selected, list }) => {
  return (
    <Tabs
      variant='bordered'
      onSelectionChange={handle}
      aria-label="Options"
      selectedKey={selected}
    >
      {list.map((e, index) => (
        <Tab key={index + 1} title={"Lista " + e.number} />
      ))}
    </Tabs>
  );
}

export default ListTabs;
