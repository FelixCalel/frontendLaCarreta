export interface Metadata {
    name: string
    type: string
    isNullable: string
    defaultValue: string | null
}
export interface AvanzarEtapaPayload {
    pedidoId: number;
    usuarioId: number;
    comentario?: string | null;
}

export interface PedidoProduccion {
    id: number
    id_asigArea: number
    cantidadUnidad: number | null
    id_unidadMedida: number
    NoBatch: number | null
    completo: boolean
    despacho: number | null
    faltante: number | null
    cantidad: number | null
    trazabilidad_Prod: string | null
    trazabilidad_Dig: string | null
    mpUtilizada: number | null
    mpSobrante: number | null
    rechazo: number | null
    basura: number | null
    detergente: number | null
    Desinfectante: number | null
    conservante: number | null
    Antioxidante: number | null
    create_at: string
    update_at: string
    create_by: number
    update_by: number | null
    state: boolean
    id_detallePedido: number
    itemCode: string
    productoNombre: string
    tienda: string
    pais: string
    unidadMedida: string
}


export interface DetalleProduccion {
    [key: string]: any
}


export interface PedidoAgrupado {
    pedidoId: number
    tienda: string
    pais: string
    items: PedidoProduccion[]
}
export type UpdatePedidoDto = Partial<Omit<PedidoProduccion, 'id'>>

export interface AvanzarEtapaPayload {
    pedidoId: number;
    usuarioId: number;
    comentario?: string | null;
}

export interface AvanzarEtapaDetallePayload {
    detalleOrdenId: number;
    usuarioId: number;
}

export interface AvanzarMultiEtapaDetallePayload {
    detalleOrdenIds: number[];
    usuarioId: number;
}

export interface AvanceOK {               // respuesta simple de tus controladores
    ok: boolean;
    mensaje: string;
}

export interface AvanceMultiplesOK {
    ok: boolean;
    resultado: {
        procesados: number;
        errores: string[];
    };
}
