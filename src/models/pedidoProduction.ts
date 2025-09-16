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
    mp1ra: number | null
    mp2da: number | null
    mp3ra: number | null
    mpSobrante: number | null
    rechazoId: number | null
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

export interface AvanceOK {
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

export interface RecetaLinea {
    id: number;
    item: string;
    id_almacen: number;
    descripcion?: string | null;
    cantidad_base: number;
    cantidad_requerida: number;
    nombre_unidad: string;
    create_at: string;
    update_at: string;
    create_by: number | null;
    update_by: number | null;
    state: boolean;
    pedido_produccionid: number;
}
export type UpdateRecetaLineaDto = Partial<Pick<
    RecetaLinea,
    'descripcion' | 'cantidad_base' | 'cantidad_requerida' | 'nombre_unidad' | 'id_almacen' | 'state'
>>;

export interface Rechazo {
    id: number;
    fechaRechazo: string; // Dates are strings in JSON
    cantidadRechazada: number;
    comentario: string | null;
    usuarioId: number;
    trazabilidad: string | null;
    usuario?: {
        nombre: string;
        apellido: string;
    };
}

export type CreateRechazoDto = Omit<Rechazo, 'id' | 'usuario'> & { id_pedidoProd: number };
export type UpdateRechazoDto = Partial<CreateRechazoDto>;


