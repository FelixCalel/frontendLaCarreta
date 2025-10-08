import { PedidoProduccion } from '../models/pedidoProduction';

export const parseNumericFields = (item: PedidoProduccion): PedidoProduccion => ({
    ...item,
    cantidadUnidad: item.cantidadUnidad ? Number(item.cantidadUnidad) : null,
    cantidad: item.cantidad ? Number(item.cantidad) : null,
    faltante: item.faltante ? Number(item.faltante) : null,
    mpUtilizada: item.mpUtilizada ? Number(item.mpUtilizada) : null,
    mp1ra: item.mp1ra ? Number(item.mp1ra) : null,
    mp2da: item.mp2da ? Number(item.mp2da) : null,
    mp3ra: item.mp3ra ? Number(item.mp3ra) : null,
    mpSobrante: item.mpSobrante ? Number(item.mpSobrante) : null,
    basura: item.basura ? Number(item.basura) : null,
});
