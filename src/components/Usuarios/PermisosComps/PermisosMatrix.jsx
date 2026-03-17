import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
} from "@chakra-ui/react";

export const PermisosMatrix = ({
  Permisos,
  roles,
  accessMatrix,
  onAccessChange,
  textColor,
  tableBgColor,
  tableHeaderBg,
  tableRowBg,
  tableRowBgAlt,
  selectBorderBg,
}) => {
  return (
    <Box
      overflowX="auto"
      borderRadius="lg"
      boxShadow="lg"
      border="0.5px solid"
      borderColor={selectBorderBg}
    >
      <Table variant="simple" borderRadius="md" bg={tableBgColor}>
        <Thead bg={tableHeaderBg}>
          <Tr>
            <Th color={textColor}>Roles</Th>
            {Permisos.slice()
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((permiso) => (
                <Th key={permiso.id} color={textColor}>
                  {permiso.nombre}
                </Th>
              ))}
          </Tr>
        </Thead>
        <Tbody>
          {roles
            .slice()
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .map((role, index) => (
              <Tr
                key={role.id}
                bg={index % 2 === 0 ? tableRowBg : tableRowBgAlt}
              >
                <Td color={textColor}>{role.nombre}</Td>
                {Permisos.map((permiso) => (
                  <Td key={permiso.id}>
                    <Switch
                      isChecked={
                        accessMatrix[role.id]?.permisos?.[permiso.nombre]
                          ?.isAssigned || false
                      }
                      onChange={() => onAccessChange(permiso.nombre, role.id)}
                      colorScheme="green"
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
