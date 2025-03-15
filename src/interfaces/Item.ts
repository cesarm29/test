

export interface Item {
    id: number;
    descripcion: string;
    cantidad: number;
    precio: number;
    descuento: number;
    iva: number;
    ivaventa_id: number;
    recargo_equivalencia: number;
    subtotal: number;
    base_imponible: number;
    importe_iva: number;
    importe_recargo: number;
    total: number;
  }
  