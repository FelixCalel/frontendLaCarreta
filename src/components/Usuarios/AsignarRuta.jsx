import { useState } from "react";
import RutaSelector from "./RutaSelector"; // Importa tu componente RutaSelector

const AsignarRutas = () => {
  const [rutaSeleccionada, setRutaSeleccionada] = useState(""); // Estado para la ruta seleccionada

  // Maneja el cambio de la ruta seleccionada
  const handleRutaChange = (event) => {
    setRutaSeleccionada(event.target.value);
  };

  // Lógica para asignar la ruta (podrías hacer una petición al backend aquí)
  const asignarRuta = () => {
    console.log("Ruta seleccionada:", rutaSeleccionada);
    // Aquí puedes enviar la ruta seleccionada al backend o realizar alguna acción
  };

  return (
    <div>
      <h2>Asignar Rutas</h2>
      {/* Uso del componente RutaSelector */}
      <RutaSelector value={rutaSeleccionada} onChange={handleRutaChange} />
      <button onClick={asignarRuta}>Asignar Ruta</button>
    </div>
  );
};

export default AsignarRutas;
