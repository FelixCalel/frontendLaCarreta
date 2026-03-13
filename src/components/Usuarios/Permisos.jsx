import { VStack, Heading, Button } from "@chakra-ui/react";
import { PermisosHeader } from "./PermisosComps/PermisosHeader";
import { PermisosMatrix } from "./PermisosComps/PermisosMatrix";
import { PermisosSuccessDialog } from "./PermisosComps/PermisosSuccessDialog";
import { usePermisosState } from "./hooks/usePermisosState";

export const Permisos = () => {
  const {
    modulosTabla,
    permisosList,
    roles,
    opciones,
    asignacionMO,
    selectedModulo,
    selectedOpcion,
    accessMatrix,
    hasChanges,
    isSaving,
    isDialogOpen,
    setState,
    handleAccessChange,
    handleSaveChanges,
    dialogRef,
    bgColor,
    optionBgColor,
    optionTextColor,
    tableHeaderBg,
    tableRowBg,
    tableRowBgAlt,
    tableBgColor,
    textColor,
    selectBg,
    selectBorderBg,
    optBg,
    optColor,
  } = usePermisosState();

  return (
    <VStack
      spacing={2}
      align="stretch"
      p={0}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading
        size="lg"
        color={textColor}
        textAlign="center"
        mb={6}
        fontWeight="bold"
        letterSpacing="wide"
      >
        Gestión de Permisos
      </Heading>

      <PermisosHeader
        modulosTabla={modulosTabla}
        selectedModulo={selectedModulo}
        onModuloChange={(val) =>
          setState({
            selectedModulo: val,
            selectedOpcion: null,
            accessMatrix: {},
          })
        }
        selectedOpcion={selectedOpcion}
        onOpcionChange={(val) => setState({ selectedOpcion: val })}
        opciones={opciones}
        asignacionMO={asignacionMO}
        textColor={textColor}
        selectBg={selectBg}
        selectBorderBg={selectBorderBg}
        optBg={optBg}
        optColor={optColor}
        optionBgColor={optionBgColor}
        optionTextColor={optionTextColor}
      />

      {selectedOpcion && (
        <PermisosMatrix
          Permisos={permisosList}
          roles={roles}
          accessMatrix={accessMatrix}
          onAccessChange={handleAccessChange}
          textColor={textColor}
          tableBgColor={tableBgColor}
          tableHeaderBg={tableHeaderBg}
          tableRowBg={tableRowBg}
          tableRowBgAlt={tableRowBgAlt}
          selectBorderBg={selectBorderBg}
        />
      )}

      {hasChanges && (
        <Button
          colorScheme="green"
          onClick={handleSaveChanges}
          isLoading={isSaving}
          loadingText="Guardando"
          size="lg"
          borderRadius="12px"
          mt={4}
          boxShadow="lg"
          bgGradient="linear(to-r, green.400, green.500)"
          color="white"
          fontWeight="bold"
        >
          Guardar Cambios
        </Button>
      )}

      <PermisosSuccessDialog
        isOpen={isDialogOpen}
        onClose={() => setState({ isDialogOpen: false })}
        dialogRef={dialogRef}
      />
    </VStack>
  );
};
