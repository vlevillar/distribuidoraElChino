import {
    Autocomplete,
    AutocompleteItem,
  } from '@nextui-org/react'
  import React from 'react'
  
  interface User {
    _id: string;
    name: string;
    username: string;
    role: string;
  }
  
  interface SelectUserProps {
    users: User[];
    onUserSelect: (userId: string) => void;
  }
  
  export default function SelectUser({ users, onUserSelect }: SelectUserProps) {
    return (
      <div className='flex items-center justify-center'>
        <Autocomplete label='Seleccione un usuario' className='max-w-xs' onSelectionChange={(userId) => onUserSelect(userId as string)}>
        {users.map(user => (
            <AutocompleteItem key={user._id} value={user.name}>
              {user.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
    )
  }