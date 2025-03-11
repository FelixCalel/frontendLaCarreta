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
    (state) => state.opciones
  );

  useEffect(() => {
    dispatch(fetchOpciones());
    dispatch(fetchMetadataOpciones());
  }, [dispatch]);

  useEffect(() => {
    if (opciones && opciones.length > 0) {
      const datosFiltrados = opciones
        .filter((opcion) =>
          opcion.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
        )
        .map((opcion) => ({
          ...opcion,
          estado: opcion.estado ? "Activo" : "Inactivo",
        }));
      setDatosConIconos(datosFiltrados); // Actualizamos los datos una vez filtrados
    }
  }, [opciones, filtroBusqueda]);

  // Procesar la metadata cuando cambie
  useEffect(() => {
    if (metadata && metadata.length > 0) {
      const metadataTransformada = metadata.map((item) => ({
        ...item,
      }));
      setMetadataProcesada(metadataTransformada); // Guardamos el valor transformado en el estado
    }
  }, [metadata]);

  // Mostrar un spinner mientras se cargan los datos
  if (loading) {
    return <Spinner />;
  }

  // Mostrar un mensaje de error si hay algún problema
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Mostrar un mensaje si no hay Opciones disponibles
  if (!opciones || opciones.length === 0) {
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
        metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
        onSearch={setFiltroBusqueda} // Pasa la función de búsqueda
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === "icono") {
            return renderIcono(rowData.icono);
          }
          if (columnKey === "acciones") {
            return (
              <>
                <BotonEditar
                  nombreBoton="Editar Opción"
                  metadata={metadataProcesada}
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

export default PageOpciones;
