export interface File {
  id: string;
  nombre_original: string;
  nombre_archivo: string;
  path_archivo: string;
  mimetype: string;
  tamanio_bytes: number;
  created_at: Date;
  document_set_id: string;
}

export interface DocumentSet {
  id: string;
  titulo: string;
  descripcion: string;
  created_at: Date;
  expediente_id: string;
  files: File[];
}

export interface Expediente {
  id: string;
  numero_expediente: string;
  cliente_nombre: string;
  abogado_asignado: string;
  estado: 'Activo' | 'Cerrado' | 'En Revisión' | 'Suspendido';
  descripcion: string;
  fecha_apertura: Date;
  fecha_cierre: Date;
  created_at: Date;
  updated_at: Date;
  document_sets: DocumentSet[];
}
