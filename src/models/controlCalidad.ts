export interface QaPedido {
    id: number;
    pedidoProduccionId: number;
    loteId: number;

    caracteristicas: string;
    cantidad: number;
    id_unidadMedida: number;
    observaciones?: string | null;
    estado: boolean;

    muestreoId?: number | null;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;

    unidadMedida?: { unidad: string };
    lote?: { tarima: number };
}

export interface CreateQaDto {
    pedidoProduccionId: number;
    loteId: number;
    caracteristicas: string;
    cantidad: number;
    id_unidadMedida: number;
    observaciones?: string | null;
    createdBy: number;
    updatedBy: number;
}

export interface UpdateQaDto {
    caracteristicas?: string;
    cantidad?: number;
    id_unidadMedida?: number;
    observaciones?: string | null;
    estado?: boolean;
    muestreoId?: number;
    updatedBy: number;
}

export interface AutoSeedResult {
    ok: boolean;
    procesados: number;
    creadosQA: number;
    creadosLotes: number;
    creadosMuestreo: number;
    errores: string[];
}

export interface Muestreo {
    id: number;
    transporte_inocuidad: boolean;
    personal_inocuidad: boolean;
    producto_inocuidad: boolean;
    temperatura_transporte: boolean;
    etiquetado: boolean;
    porcentaje: number;
    resultado: string;
    brix_promedio: number;
    temperatura: string;
    desicion: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    qaId?: number | null;
}

export interface UpdateMuestreoDto {
    transporte_inocuidad?: boolean;
    personal_inocuidad?: boolean;
    producto_inocuidad?: boolean;
    temperatura_transporte?: boolean;
    etiquetado?: boolean;
    porcentaje?: number;
    resultado?: string;
    brix_promedio?: number;
    temperatura?: string;
    desicion?: string;
    updatedBy: number;
    qaId?: number;
}


export interface QaItemEnPedido {
    qaId: number;
    loteId: number;
    tarima: number | null;
    cantidad: number;
    unidadMedida?: string;
    caracteristicas: string;
    observaciones: string | null;
    estado: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    productoId: number;
    productoCodigo: string;
    productoNombre: string;
}

export interface QaLoteLite { id: number; tarima: number | null; }
export interface QaProveedorLite { id: number; nombre: string; }

export interface QaAgrupadoPorPedido {
    pedidoId: number;
    tienda: string;
    pais: string;
    trazabilidad?: string | null;
    lotes?: QaLoteLite[];
    proveedores?: QaProveedorLite[];
    items: QaItemEnPedido[];
}


export type GetQaGroupedParams = {
    includeLote?: boolean;
    includeProveedor?: boolean;
    proveedorId?: number;
    loteId?: number;
};