import React, { useState, useEffect } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

interface Props {
  routeId?: string;
  clientId?: string;
  status?: string;
}

type Status = 'warning' | 'success' | 'danger';

const StatusSelect: React.FC<Props> = ({ routeId, clientId, status }) => {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['no_visita']));

  useEffect(() => {
    if (status) {
      setSelectedKeys(new Set([mapStatusToKey(status)]));
    }
  }, [status]);

  const mapStatusToKey = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'VISITED': 'venta',
      'UNSOLD': 'no_venta',
      'NOT_VISITED': 'no_visita'
    };
    return statusMap[status] || 'no_visita'; // Default to 'no_visita'
  };

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedKeys(keys);
    const statusMap: { [key: string]: string } = {
      'venta': 'VISITED',
      'no_venta': 'UNSOLD',
      'no_visita': 'NOT_VISITED'
    };
    const status: string = statusMap[Array.from(keys)[0]] || 'NOT_VISITED'; // Default to 'NOT_VISITED'
    if (routeId && clientId && status) {
      // Perform PUT request here
      fetch(`${process.env.API_URL}/routes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: routeId,
          clientId: clientId,
          status: status // Use the mapped status value
        })
      })
        .then(response => {
          if (response.ok) {
            console.log('Status updated successfully');
          } else {
            console.error('Failed to update status');
          }
        })
        .catch(error => {
          console.error('Error updating status:', error);
        });
    }
  };

  const selectedValue = React.useMemo(
    () => {
      const statusMap: { [key: string]: string } = {
        'venta': 'Venta',
        'no_venta': 'No venta',
        'no_visita': 'No visita'
      };
      return statusMap[Array.from(selectedKeys)[0]] || 'No visita';
    },
    [selectedKeys]
  );

  let buttonColor: Status = 'warning';
  if (selectedValue === 'Venta') {
    buttonColor = 'success';
  } else if (selectedValue === 'No venta') {
    buttonColor = 'danger';
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='bordered' className='capitalize' color={buttonColor}>
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange as (keys: any) => void} 
      >
        <DropdownItem key='venta'>Venta</DropdownItem>
        <DropdownItem key='no_venta'>No venta</DropdownItem>
        <DropdownItem key='no_visita'>No visita</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default StatusSelect;
