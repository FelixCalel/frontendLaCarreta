// import {
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Box,
//   Button,
//   Icon,
// } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";
// import PropTypes from "prop-types";

// const PedidosTable = ({
//   itemsAgrupadosPorDeudor,
//   filtros,
//   onVerConsolidado,
// }) => {
//   // 1.  Aplica filtro local de palabras
//   const itemsFiltrados = {};
//   Object.entries(itemsAgrupadosPorDeudor).forEach(([deu, items]) => {
//     const buenos = items.filter(
//       (i) =>
//         !filtros.palabrasClave ||
//         i.nombre.toLowerCase().includes(filtros.palabrasClave.toLowerCase())
//     );
//     if (buenos.length) itemsFiltrados[deu] = buenos;
//   });

//   // 2.  Render
//   return (
//     <Box overflowX="auto">
//       <Table variant="striped" colorScheme="gray" size="sm">
//         <Thead>
//           <Tr>
//             <Th>Código</Th>
//             <Th>Nombre Item</Th>
//             <Th>DEU</Th>
//             <Th isNumeric>Cantidad</Th>
//             <Th isNumeric>Compras OC</Th>
//             <Th isNumeric>Recibido</Th>
//             <Th textAlign="center" w="140px">
//               Consolidado
//             </Th>
//           </Tr>
//         </Thead>

//         <Tbody>
//           {Object.keys(itemsFiltrados).length ? (
//             Object.entries(itemsFiltrados).map(([deu, items]) =>
//               items.map((item) => (
//                 <Tr key={`${deu}-${item.id}`}>
//                   <Td>{item.codigo}</Td>
//                   <Td maxW="300px" whiteSpace="normal">
//                     {item.nombre}
//                   </Td>
//                   <Td>{deu}</Td>
//                   <Td isNumeric>{item.cantidad}</Td>
//                   <Td isNumeric>{item.cantidadAsignada}</Td>
//                   <Td isNumeric>{item.pedido_compra}</Td>

//                   {/*  Botón de acción  */}
//                   <Td textAlign="center">
//                     <Button
//                       size="xs"
//                       colorScheme="green"
//                       leftIcon={<Icon as={SearchIcon} />}
//                       onClick={() => onVerConsolidado(item)}
//                     >
//                       Ver
//                     </Button>
//                   </Td>
//                 </Tr>
//               ))
//             )
//           ) : (
//             <Tr>
//               <Td colSpan={7} textAlign="center">
//                 No hay items para mostrar.
//               </Td>
//             </Tr>
//           )}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// };

// PedidosTable.propTypes = {
//   itemsAgrupadosPorDeudor: PropTypes.object.isRequired,
//   filtros: PropTypes.shape({
//     palabrasClave: PropTypes.string,
//   }).isRequired,
//   // 👉 función que recibirá el item de la fila
//   onVerConsolidado: PropTypes.func.isRequired,
// };

// export default PedidosTable;
