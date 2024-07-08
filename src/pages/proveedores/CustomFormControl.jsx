import React from 'react'; // Importa la biblioteca React.
import { FormControl, FormLabel } from '@chakra-ui/react'; // Importa componentes de Chakra UI.

const CustomFormControl = ({ id, label, children }) => (
  // Componente funcional que recibe las props id, label y children.
  <FormControl id={id} mb={4}>
    {/* Componente FormControl de Chakra UI que agrupa el control del formulario */}
    <FormLabel fontWeight="bold">{label}</FormLabel>
    {/* Componente FormLabel de Chakra UI que muestra la etiqueta del control del formulario */}
    {children}
    {/* Renderiza los elementos hijos pasados al componente */}
  </FormControl>
);

export default CustomFormControl; // Exporta el componente por defecto.
