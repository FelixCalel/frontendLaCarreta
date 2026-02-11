import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  useCreateRecetaLineaMutation,
  useLazyGetItemsQuery,
  useGetAlmacenesQuery,
} from "../../../services/pedidoProductionApi";

const AddMaterialModal = ({ isOpen, onClose, pedidoId }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidadBase, setCantidadBase] = useState("");
  const [cantidadRequerida, setCantidadRequerida] = useState("");
  const [almacenId, setAlmacenId] = useState("");
  const [unidad, setUnidad] = useState("");

  const toast = useToast();

  const [createRecetaLinea, { isLoading }] = useCreateRecetaLineaMutation();
  const [triggerGetItems] = useLazyGetItemsQuery();
  const { data: almacenes } = useGetAlmacenesQuery();

  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const response = await triggerGetItems({
        page: page,
        pageSize: 10,
        nombre: search,
        codigo: search,
      }).unwrap();

      const options = response.items.map((item) => ({
        label: `${item.codigo} - ${item.nombre}`,
        value: item.id,
        item: item,
      }));

      return {
        options: options,
        hasMore: response.items.length === 10,
        additional: {
          page: page + 1,
        },
      };
    } catch (err) {
      console.error(err);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleItemChange = (option) => {
    setSelectedItem(option);
    if (option && option.item) {
      setUnidad(option.item.unidadMedida || "UNIDAD");
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem || !cantidadRequerida || !almacenId) {
      toast({
        title: "Error",
        description:
          "Por favor complete los campos obligatorios (Item, Cantidad Requerida, Almacén).",
        status: "error",
      });
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

      toast({
        title: "Éxito",
        description: "Material agregado correctamente.",
        status: "success",
      });
      onClose();
      setSelectedItem(null);
      setCantidadBase("");
      setCantidadRequerida("");
      setAlmacenId("");
      setUnidad("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo agregar el material.",
        status: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agregar Material a Receta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Buscar Item</FormLabel>
              <AsyncPaginate
                debounceTimeout={300}
                value={selectedItem}
                loadOptions={loadOptions}
                onChange={handleItemChange}
                placeholder="Escriba nombre o código..."
                additional={{
                  page: 1,
                }}
                noOptionsMessage={() => "No se encontraron items"}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Almacén</FormLabel>
              <Select
                placeholder="Seleccione Almacén"
                value={almacenId}
                onChange={(e) => setAlmacenId(e.target.value)}
              >
                {almacenes?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Cantidad Requerida</FormLabel>
              <Input
                type="number"
                value={cantidadRequerida}
                onChange={(e) => setCantidadRequerida(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Cantidad Base (Opcional)</FormLabel>
              <Input
                type="number"
                value={cantidadBase}
                onChange={(e) => setCantidadBase(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Unidad de Medida</FormLabel>
              <Input
                value={unidad}
                onChange={(e) => setUnidad(e.target.value)}
                placeholder="Ej. KG, UNIDAD"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Agregar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AddMaterialModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedidoId: PropTypes.number.isRequired,
};

export default AddMaterialModal;
