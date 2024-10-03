import { Table, Thead, Tbody, Tr, Th, Td, Checkbox, Box, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermisos } from "../../store/Permisos/thunks";

export const Permisos = () => {
  const dispatch = useDispatch();
  
  // Obtener permisos y estado desde Redux
  const { data: permisos, status } = useSelector((state) => state.permisos);
  
  // Opciones de ejemplo de roles (puedes actualizarlas con los datos de tu API)
  const roles = ["Administrador", "Finanzas", "Tesorería", "Ventas", "Logística"];
  
  const [accessMatrix, setAccessMatrix] = useState(
    roles.map(() => permisos.map(() => false))
  );
  
  // Hacer la solicitud para obtener los permisos cuando el componente se monta
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPermisos());
    }
  }, [status, dispatch]);

  // Función para manejar cambios en la matriz de acceso
  const handleAccessChange = (rowIndex, colIndex) => {
    const updatedMatrix = [...accessMatrix];
    updatedMatrix[rowIndex][colIndex] = !updatedMatrix[rowIndex][colIndex];
    setAccessMatrix(updatedMatrix);
  };

  // Mostrar un spinner mientras los datos están cargando
  if (status === 'loading') {
    return <Spinner />;
  }

  // Mostrar un mensaje si no se cargan los datos correctamente
  if (status === 'failed') {
    return <Text>Hubo un error cargando los permisos.</Text>;
  }

  return (
    <Box>
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
          {permisos.map((permiso, rowIndex) => (
            <Tr key={rowIndex}>
              <Td>{permiso.nombre}</Td>
              {roles.map((role, colIndex) => (
                <Td key={colIndex}>
                  <Checkbox
                    isChecked={accessMatrix[rowIndex][colIndex]}
                    onChange={() => handleAccessChange(rowIndex, colIndex)}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
