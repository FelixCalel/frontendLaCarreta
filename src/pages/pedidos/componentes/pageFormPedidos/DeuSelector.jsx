import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormControl, Input, useColorModeValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const DeuSelector = ({ deudorId }) => {
  const [label, setLabel] = useState("");
  const tiendas = useSelector((state) => state.tiendas?.data || []);

  useEffect(() => {
    if (!deudorId) {
      setLabel("");
      return;
    }

    const tiendaConDeudor = tiendas.find((t) => t.deudorId === deudorId);
    if (tiendaConDeudor) {
      setLabel(
        `${tiendaConDeudor.nombreCorrelativo} - ${tiendaConDeudor.nombreDeu}`
      );
    }
  }, [deudorId, tiendas]);

  const bgReadOnly = useColorModeValue("gray.100", "gray.700");

  return (
    <FormControl>
      <Input
        value={label}
        isDisabled
        variant="filled"
        size="lg"
        bg={bgReadOnly}
        pointerEvents="none"
        userSelect="none"
        _disabled={{
          opacity: 1,
          color: useColorModeValue("gray.800", "gray.100"),
          cursor: "default",
        }}
      />
    </FormControl>
  );
};

DeuSelector.propTypes = {
  deudorId: PropTypes.number,
};

export default DeuSelector;
