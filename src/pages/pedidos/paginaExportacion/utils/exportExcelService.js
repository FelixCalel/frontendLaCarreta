import * as ExcelJS from "exceljs";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const agruparPedidosPorDeudor = (pedidosConDetalles) => {
  return pedidosConDetalles.reduce((acc, pedido) => {
    const deudor = pedido.nombreDeu || "Sin deudor";
    if (!acc[deudor]) {
      acc[deudor] = { pedidos: [] };
    }
    acc[deudor].pedidos.push(pedido);
    return acc;
  }, {});
};

const descargarWorkbook = async (workbook, fileName) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

const isoToDMY = (iso) => {
  if (!iso) return "Sin fecha";
  const [yyyy, mm, dd] = iso.slice(0, 10).split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const isoToLocalDate = (iso) => {
  if (!iso) return null;
  const [yyyy, mm, dd] = iso.slice(0, 10).split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

async function addPedidosToWorksheetFormato2(worksheet, pedidosPorDeudor) {
  worksheet.columns = [
    { header: "Pedido ID", key: "pedidoId", width: 15 },
    { header: "Tienda", key: "tienda", width: 25 },
    { header: "Código", key: "codigo", width: 15 },
    { header: "Producto", key: "producto", width: 30 },
    { header: "Cantidad", key: "cantidad", width: 15 },
  ];

  let firstDeudor = true;

  for (const deudor of Object.keys(pedidosPorDeudor)) {
    const { pedidos } = pedidosPorDeudor[deudor];

    if (!firstDeudor) {
      worksheet.addRow([]);
    }
    firstDeudor = false;

    const deudorRow = worksheet.addRow([
      `${pedidos[0]?.nombreCorrelativo || ""}${
        pedidos[0]?.nombreCorrelativo ? " - " : ""
      }${pedidos[0]?.nombreDeu || ""}`,
    ]);
    deudorRow.font = { bold: true };

    const fechaOrdenObj = isoToLocalDate(pedidos[0]?.fechaOrden);
    const fechaOrden = fechaOrdenObj
      ? format(fechaOrdenObj, "dd 'de' MMMM 'de' yyyy", { locale: es })
      : "Sin fecha";

    worksheet.addRow([`Fecha de entrega: ${fechaOrden}`]);

    const headerRow = worksheet.addRow([
      "Pedido ID",
      "Tienda",
      "Código",
      "Producto",
      "Cantidad",
    ]);
    headerRow.font = { bold: true };

    for (const pedido of pedidos) {
      const detalles = Array.isArray(pedido.detalles) ? pedido.detalles : [];
      for (const detalle of detalles) {
        worksheet.addRow({
          pedidoId: `P-${pedido.id}`,
          tienda: pedido.nombreTienda || "Sin tienda",
          codigo: detalle.codigo || "Sin código",
          producto: detalle.nombreProducto,
          cantidad: detalle.cantidad,
        });
      }
    }

    const nombreTienda = pedidos[0]?.nombreTienda || "Sin tienda";
    const commentRow = worksheet.addRow([
      "Comentario:",
      `Tienda: ${nombreTienda}`,
      `Fecha Orden: ${isoToDMY(pedidos[0]?.fechaOrden)}`,
    ]);
    commentRow.font = { bold: true };
    commentRow.alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: true,
    };

    worksheet.addRow([]);
  }

  worksheet.columns.forEach((column) => {
    column.width = Math.max(
      column.header?.length || 10,
      ...worksheet
        .getColumn(column.key)
        .values.filter((value) => value)
        .map((value) => String(value).length),
    );
  });
}

export const generarYDescargarExcelFormato2 = async (pedidosConDetalles) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Pedidos Consolidados F2");
  const pedidosPorDeudor = agruparPedidosPorDeudor(pedidosConDetalles);
  await addPedidosToWorksheetFormato2(worksheet, pedidosPorDeudor);

  await descargarWorkbook(
    workbook,
    `pedidos_exportados_${new Date().getTime()}.xlsx`,
  );
};
