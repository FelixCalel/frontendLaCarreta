import { Badge, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'

export const TableData = () => {
  return (
    <TableContainer>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Razón Social</Th>
            <Th >Estado</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>Empresa 01</Td>
            <Td ><Badge>Completado</Badge> </Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>Empresa 02</Td>
            <Td ><Badge>Pendiente</Badge> </Td>
          </Tr>
          <Tr>
            <Td>3</Td>
            <Td>Empresa 03</Td>
            <Td ><Badge>Revisión</Badge> </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th isNumeric></Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  )
}
