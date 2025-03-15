export interface Albaran {
  almacen_id: number;
  centro_origen_id: number;
  centro_id: number;
  fecha: string;
  items_albaranesventas: Array<{
    descripcion: string;
    cantidad: number;
    precio: number;
    descuento: number;
    iva: number;
    ivaventa_id: number;
    recargo_equivalencia: number;
  }>;
}
