import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { PlusCircle } from "react-feather";

interface RouteTableProps {
  date: string | null;
}

const RouteTable: React.FC<RouteTableProps> = ({ date }) => {
  return (
    <Table
      aria-label="Example static collection table"
      topContent={
        <div className="flex justify-center">
          <p>{date}</p>
        </div>
      }
      bottomContent={
        <Button color="primary" startContent={<PlusCircle />}>Agregar cliente</Button>
      }>
      <TableHeader>
        <TableColumn>NOMBRE</TableColumn>
        <TableColumn>DIRECCIÓN</TableColumn>
        <TableColumn>ESTADO</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Zoey Lang</TableCell>
          <TableCell>Technical Lead</TableCell>
          <TableCell>Paused</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Jane Fisher</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
        </TableRow>
        <TableRow key="5">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default RouteTable;
