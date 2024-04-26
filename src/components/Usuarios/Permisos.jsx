import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Box } from "@chakra-ui/react";
import { useState } from "react";


export const Permisos = () => {
    // Define las opciones y los roles
  const options = [
    "Ver estado de facturas",
    "Facturas pagadas",
    "Órdenes de compra",
    "Historiales",
    "Entregas",
    "Pagos pendientes",
  ];

  const roles = [
    "Administrador",
    "Finanzas",
    "Tesorería",
    "Ventas",
    "Logística",
  ];

  // Estado para controlar el acceso de cada rol a cada opción
  const [accessMatrix, setAccessMatrix] = useState(
    roles.map(() => options.map(() => false))
  );

  // Función para manejar el cambio de acceso para un rol y una opción específica
  const handleAccessChange = (rowIndex, colIndex) => {
    const updatedMatrix = [...accessMatrix];
    updatedMatrix[rowIndex][colIndex] = !updatedMatrix[rowIndex][colIndex];
    setAccessMatrix(updatedMatrix);
  };

  return (
    <><Box>
          <Table variant="striped" colorScheme="gray">
              <Thead>
                  <Tr>
                      <Th>Opciones</Th>
                      {roles.map((role, index) => (
                          <Th key={index}>{role}</Th>
                      ))}
                  </Tr>
              </Thead>
              <Tbody>
                  {options.map((option, rowIndex) => (
                      <Tr key={rowIndex}>
                          <Td>{option}</Td>
                          {roles.map((role, colIndex) => (
                              <Td key={colIndex}>
                                  <Checkbox
                                      // isChecked={accessMatrix[rowIndex][colIndex]}
                                      onChange={() => handleAccessChange(rowIndex, colIndex)} />
                              </Td>
                          ))}
                      </Tr>
                  ))}
              </Tbody>
          </Table>
          </Box>
      </>
  )
}
