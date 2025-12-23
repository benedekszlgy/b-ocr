// TypeScript types for B-OCR

export type DocumentType =
  | 'ID_CARD'
  | 'BANK_STATEMENT'
  | 'PAY_STUB'
  | 'TAX_RETURN'
  | 'UTILITY_BILL'
  | 'EMPLOYMENT_LETTER'
  | 'UNKNOWN'

export interface Application {
  id: string
  user_id: string
  external_ref: string | null
  status: 'pending' | 'processing' | 'completed' | 'error'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  application_id: string
  filename: string
  file_path: string
  file_size: number | null
  mime_type: string | null
  doc_type: DocumentType | null
  doc_type_confidence: number | null
  status: 'pending' | 'processing' | 'completed' | 'error'
  error_message: string | null
  ocr_text: string | null
  created_at: string
}

export interface ExtractedField {
  id: string
  document_id: string
  field_key: string
  field_value: string | null
  confidence: number | null
  validation_status: string
  validation_message: string | null
  manually_corrected: boolean
  created_at: string
}

export interface ExtractionResult {
  key: string
  value: string | null
  confidence: number
}
