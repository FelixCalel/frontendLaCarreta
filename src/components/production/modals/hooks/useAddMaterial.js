import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  useCreateRecetaLineaMutation,
  useLazyGetItemsQuery,
  useGetAlmacenesQuery,
  useLazyGetStockSAPQuery,
} from "../../../../services/pedidoProductionApi";

export const useAddMaterial = (pedidoId, onClose) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidadBase, setCantidadBase] = useState("");
  const [cantidadRequerida, setCantidadRequerida] = useState("");
  const [almacenId, setAlmacenId] = useState("");
  const [unidad, setUnidad] = useState("");

  const toast = useToast();
  const [createRecetaLinea, { isLoading }] = useCreateRecetaLineaMutation();
  const [triggerGetItems] = useLazyGetItemsQuery();
  const { data: almacenes } = useGetAlmacenesQuery();
  const [triggerGetStockSAP, { data: stockData, isFetching: isFetchingStock }] = useLazyGetStockSAPQuery();

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const response = await triggerGetItems({
        page: page,
        pageSize: 10,
        nombre: search,
        codigo: search,
      }).unwrap();

      return {
        options: response.items.map((item) => ({
          label: `${item.codigo} - ${item.nombre}`,
          value: item.id,
          item: item,
        })),
        hasMore: response.items.length === 10,
        additional: { page: page + 1 },
      };
    } catch (err) {
      console.error(err);
      return { options: [], hasMore: false };
    }
  };

  const handleItemChange = (option) => {
    setSelectedItem(option);
    setAlmacenId("");
    if (option?.item) {
      setUnidad(option.item.unidadMedida || "UNIDAD");
      setCantidadBase("1");
      setCantidadRequerida("1");
      triggerGetStockSAP({
        itemcode: option.item.codigo,
        pedidoId: Number(pedidoId),
      }).unwrap().catch(console.error);
    }
  };

  useEffect(() => {
    if (stockData && Array.isArray(stockData) && almacenes && !isFetchingStock && !almacenId) {
      const availableStocks = stockData.filter((s) => Number(s.stock) > 0);
      if (availableStocks.length > 0) {
        const matchedWarehouse = almacenes.find((a) => a.name === availableStocks[0].almacen);
        if (matchedWarehouse) setAlmacenId(matchedWarehouse.id.toString());
      }
    }
  }, [stockData, almacenes, isFetchingStock, almacenId]);

  const handleSubmit = async () => {
    if (!selectedItem || !cantidadRequerida || !almacenId) {
      toast({ title: "Error", description: "Complete los campos obligatorios.", status: "error" });
      return;
    }

    try {
      await createRecetaLinea({
        data: {
          pedido_produccionid: Number(pedidoId),
          item: selectedItem.item.codigo,
          descripcion: selectedItem.item.nombre,
          cantidad_base: Number(cantidadBase) || 0,
          cantidad_requerida: Number(cantidadRequerida),
          nombre_unidad: unidad || "UNIDAD",
          id_almacen: Number(almacenId),
          mpUtilizada: null,
        },
      }).unwrap();

      toast({ title: "Éxito", description: "Material agregado.", status: "success" });
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo agregar material.", status: "error" });
    }
  };

  const resetForm = () => {
    setSelectedItem(null);
    setCantidadBase("");
    setCantidadRequerida("");
    setAlmacenId("");
    setUnidad("");
  };

  return {
    selectedItem,
    cantidadBase, setCantidadBase,
    cantidadRequerida, setCantidadRequerida,
    almacenId, setAlmacenId,
    unidad, setUnidad,
    isLoading,
    loadOptions,
    handleItemChange,
    handleSubmit,
    stockData,
    isFetchingStock,
    almacenes
  };
};
