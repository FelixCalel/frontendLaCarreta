import { useState, useMemo, useEffect } from "react";

export const useTiendaTable = ({ data }) => {
  const [filtroCiudad, setFiltroCiudad] = useState("");
  const [filtroRuta, setFiltroRuta] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroCiudad, filtroRuta, filtroZona, filtroNombre]);

  const filteredData = useMemo(() => {
    return data
      .filter((tienda) => {
        return (
          (filtroCiudad ? tienda.nombreCiudad === filtroCiudad : true) &&
          (filtroRuta ? tienda.nombreRuta === filtroRuta : true) &&
          (filtroZona ? tienda.zona?.toLowerCase().includes(filtroZona.toLowerCase()) : true) &&
          (filtroNombre ? tienda.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()) : true)
        );
      })
      .sort((a, b) => {
        const rutaA = a.nombreRuta || "";
        const rutaB = b.nombreRuta || "";
        const numA = parseInt(rutaA.replace(/\D/g, "")) || 0;
        const numB = parseInt(rutaB.replace(/\D/g, "")) || 0;
        return numA - numB || rutaA.localeCompare(rutaB);
      });
  }, [data, filtroCiudad, filtroRuta, filtroZona, filtroNombre]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const ciudades = useMemo(() => Array.from(new Set(data.map((t) => t.nombreCiudad))).filter(Boolean), [data]);
  const rutas = useMemo(() => 
    Array.from(new Set(data.map((t) => t.nombreRuta)))
      .filter(Boolean)
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.replace(/\D/g, "")) || 0;
        return numA - numB || a.localeCompare(b);
      }), 
  [data]);

  return {
    filtroCiudad, setFiltroCiudad,
    filtroRuta, setFiltroRuta,
    filtroZona, setFiltroZona,
    filtroNombre, setFiltroNombre,
    currentPage, setCurrentPage,
    itemsPerPage,
    filteredData,
    currentItems,
    handlePageChange,
    ciudades,
    rutas
  };
};
