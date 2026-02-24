export interface File {
  id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  mimetype: string;
  size_bytes: number;
  created_at: Date;
  document_set_id: string;
}

export interface DocumentSet {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  expedient_id: string;
  files: File[];
}

export interface Expedient {
  id: string;
  case_number: string;
  client_name: string;
  assigned_lawyer: string;
  status: 'Active' | 'Closed' | 'In Review' | 'Suspended';
  description: string;
  opening_date: Date;
  closing_date: Date;
  created_at: Date;
  updated_at: Date;
  document_sets: DocumentSet[];
}
