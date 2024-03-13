'use client'

import { Card, CardBody, CardHeader, Chip, Divider, Input } from '@nextui-org/react'
import { Search } from 'react-feather'

export default function SearchClientCard() {

    return (
        <Card>
            <CardHeader className="flex gap-3 items-center justify-center">
                <div className="flex flex-col items-center">
                    <Input placeholder='Buscar cliente' startContent={<Search/>}/>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className='flex items-center'>
                <Chip className='cursor-pointer'>test</Chip>
            </CardBody>
            <Divider />
        </Card>
    )
}
