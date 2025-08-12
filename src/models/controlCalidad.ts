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
