export interface Metadata {
    name: string
    type: string
    isNullable: string
    defaultValue: string | null
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
}


export interface DetalleProduccion {
    [key: string]: any
}

export type UpdatePedidoDto = Partial<Omit<PedidoProduccion, 'id'>>