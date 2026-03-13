import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOpciones,
  fetchMetadataOpciones,
} from "../../store/Opciones/thunks";
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { BotonEditar } from "../../components/Genericos/Crud/listas/botonEditar";
import { BotonEliminar } from "../../components/Genericos/Crud/listas/botonEliminar";
import iconCatalog from "../../components/Iconos/IconCatalog";

export const PageOpciones = () => {
  const bgColor = useColorModeValue("gray.50", "#1e1e2e");
  const dispatch = useDispatch();

  const [datosConIconos, setDatosConIconos] = useState([]);
  const [metadataProcesada, setMetadataProcesada] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const { opciones, loading, error, metadata } = useSelector(
    (state) => state.opciones,
  );

  const getArray = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  useEffect(() => {
    dispatch(fetchOpciones());
    dispatch(fetchMetadataOpciones());
  }, [dispatch]);

  useEffect(() => {
    const opcionesArray = getArray(opciones);
    if (opcionesArray.length > 0) {
      const datosFiltrados = opcionesArray
        .filter((opcion) =>
          opcion.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()),
        )
        .map((opcion) => ({ ...opcion }));
      setDatosConIconos(datosFiltrados);
    } else {
      setDatosConIconos([]);
    }
  }, [opciones, filtroBusqueda]);

  useEffect(() => {
    const metadataArray = getArray(metadata);
    if (metadataArray.length > 0) {
      const metadataTransformada = metadataArray.map((item) => ({
        ...item,
      }));
      setMetadataProcesada(metadataTransformada);
    }
  }, [metadata]);

  const metadataFallbackOpciones = [
    { name: "nombre", type: "text", label: "Nombre" },
    { name: "descripcion", type: "text", label: "Descripción" },
    { name: "icono", type: "text", label: "Ícono" },
    { name: "estado", type: "boolean", label: "Estado" },
  ];

  const metadataParaForm =
    metadataProcesada.length > 0 ? metadataProcesada : metadataFallbackOpciones;

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!getArray(opciones).length) {
    return <p>No hay Opciones disponibles.</p>;
  }

  const columnasOpciones = [
    { nombre: "Nombre", acceso: "nombre" },
    { nombre: "Descripción", acceso: "descripcion" },
    { nombre: "Ícono", acceso: "icono" },
    { nombre: "Estado", acceso: "estado" },
    { nombre: "Acciones", acceso: "acciones" },
  ];

  const renderIcono = (iconName) => {
    const IconComponent = iconCatalog[iconName];
    if (!IconComponent) {
      return <p>Icono no disponible</p>;
    }
    return <IconComponent style={{ width: "24px", height: "24px" }} />;
  };

  return (
    <Box p={8} bg={bgColor} minH="100vh">
      <ListarDatos
        nombre="Lista de Opciones"
        columnas={columnasOpciones}
        datos={datosConIconos}
        nombreBoton="Crear Opción"
        onCrear={() => console.log("Creando nueva opción")}
        metadata={metadataParaForm}
        onSearch={setFiltroBusqueda}
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === "icono") {
            return renderIcono(rowData.icono);
          }
          if (columnKey === "estado") {
            return rowData.estado ? "Activo" : "Inactivo";
          }
          if (columnKey === "acciones") {
            return (
              <>
                <BotonEditar
                  nombreBoton="Editar Opción"
                  metadata={metadataParaForm}
                  formData={rowData}
                />
                <BotonEliminar
                  nombreBoton="Eliminar Opción"
                  formData={rowData}
                />
              </>
            );
          }
          return rowData[columnKey];
        }}
      />
    </Box>
  );
};
