import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsuarios } from "../../store/usuarios/usuariosSlice";
import { fetchUsuariosMetadata } from "../../store/usuarios/thunks";
import { ListarDatos } from "../../components/Genericos/Crud/listas/listarDatos";
import { Box, useColorModeValue, Spinner } from "@chakra-ui/react";
import { BotonEditar } from "../../components/Genericos/Crud/listas/botonEditar";
import { BotonEliminar } from "../../components/Genericos/Crud/listas/botonEliminar";
import iconCatalog from "../../components/Iconos/IconCatalog";

export const PageListarUsuarios = () => {
  const bgColor = useColorModeValue("gray.50", "#1e1e2e");
  const dispatch = useDispatch();
  const [datosConIconos, setDatosConIconos] = useState([]);
  const [metadataProcesada, setMetadataProcesada] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const {
    items: usuarios,
    loading,
    error,
    metadata,
  } = useSelector((state) => state.usuarios);

  useEffect(() => {
    dispatch(fetchUsuarios());
    dispatch(fetchUsuariosMetadata());
  }, [dispatch]);

  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      const datosFiltrados = usuarios
        .filter((usuario) =>
          usuario.nombres.toLowerCase().includes(filtroBusqueda.toLowerCase())
        )
        .map((usuario) => ({
          ...usuario,
          estado: usuario.estado ? "Activo" : "Inactivo",
        }));
      setDatosConIconos(datosFiltrados);
    }
  }, [usuarios, filtroBusqueda]);

  useEffect(() => {
    if (metadata && metadata.length > 0) {
      const metadataTransformada = metadata.map((item) => ({
        ...item,
      }));
      setMetadataProcesada(metadataTransformada);
    }
  }, [metadata]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!usuarios || usuarios.length === 0) {
    return <p>No hay usuarios disponibles.</p>;
  }

  const columnasUsuarios = [
    { nombre: "Nombre", acceso: "nombres" },
    { nombre: "Apellido", acceso: "apellidos" },
    { nombre: "Correo Electrónico", acceso: "correo_electronico" },
    { nombre: "Rol", acceso: "role.nombre" },
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
        nombre="Lista de Usuarios"
        columnas={columnasUsuarios}
        datos={datosConIconos}
        nombreBoton="Crear Usuario"
        onCrear={() => console.log("Creando nuevo usuario")}
        metadata={metadataProcesada.length > 0 ? metadataProcesada : []}
        onSearch={setFiltroBusqueda}
        renderCustomCell={(columnKey, rowData) => {
          if (columnKey === "role.nombre") {
            return rowData.role ? rowData.role.nombre : "Sin Rol";
          }
          if (columnKey === "acciones") {
            return (
              <>
                <BotonEditar
                  nombreBoton="Editar Usuario"
                  metadata={metadataProcesada}
                  formData={rowData}
                />
                <BotonEliminar
                  nombreBoton="Eliminar Usuario"
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

export default PageListarUsuarios;
