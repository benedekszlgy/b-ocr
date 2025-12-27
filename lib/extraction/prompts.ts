// Extraction prompts for different document types
import type { DocumentType } from '@/types'

export const DOCUMENT_TYPES: DocumentType[] = [
  'INVOICE',
  'ID_CARD',
  'BANK_STATEMENT',
  'PAY_STUB',
  'TAX_RETURN',
  'UTILITY_BILL',
  'EMPLOYMENT_LETTER',
  'UNKNOWN',
]

export const EXTRACTION_PROMPTS: Record<DocumentType, string> = {
  INVOICE: `Extract these fields from the invoice/receipt OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- invoice_number
- invoice_date (YYYY-MM-DD)
- due_date (YYYY-MM-DD)
- vendor_name (seller/business name)
- customer_name (buyer name)
- subtotal (number only)
- tax_amount (number only)
- total_amount (number only)
- currency
- payment_terms

IMPORTANT: Set confidence as a decimal 0.0-1.0 based on:
- 0.95-1.0: Field clearly visible, unambiguous value
- 0.75-0.95: Field found but slightly unclear or requires minor interpretation
- 0.50-0.75: Field found but ambiguous, multiple possible values
- 0.25-0.50: Field partially visible or requires significant interpretation
- 0.0-0.25: Field barely visible or highly uncertain
Use null for value if field not found. Do not use 0.95 as default - evaluate each field independently.`,

  ID_CARD: `Extract these fields from the ID document OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- full_name
- date_of_birth (YYYY-MM-DD format)
- address
- document_number
- expiry_date (YYYY-MM-DD format)
- issuing_state

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  BANK_STATEMENT: `Extract these fields from the bank statement OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- account_holder_name
- account_number (last 4 digits only for security)
- bank_name
- statement_period_start (YYYY-MM-DD)
- statement_period_end (YYYY-MM-DD)
- opening_balance (number only)
- closing_balance (number only)
- total_deposits (number only)
- total_withdrawals (number only)

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  PAY_STUB: `Extract these fields from the pay stub OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- employee_name
- employer_name
- pay_period_start (YYYY-MM-DD)
- pay_period_end (YYYY-MM-DD)
- gross_pay (number only)
- net_pay (number only)
- ytd_gross (number only)
- pay_frequency (weekly/biweekly/monthly)

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  TAX_RETURN: `Extract these fields from the tax document OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- taxpayer_name
- tax_year
- filing_status
- total_income (number only)
- adjusted_gross_income (number only)
- taxable_income (number only)
- total_tax (number only)
- employer_name (if W2)
- wages (if W2, number only)

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  UTILITY_BILL: `Extract these fields from the utility bill OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- account_holder_name
- service_address
- bill_date (YYYY-MM-DD)
- amount_due (number only)
- utility_provider

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  EMPLOYMENT_LETTER: `Extract these fields from the employment letter OCR text.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Fields to extract:
- employee_name
- employer_name
- job_title
- employment_start_date (YYYY-MM-DD)
- salary (number only)
- salary_frequency (annual/monthly/hourly)
- employment_status (full-time/part-time/contract)

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently. Use null if not found.`,

  UNKNOWN: `Extract any relevant personal or financial information from this document.
Return JSON: {"fields": [{"key": "field_name", "value": "extracted_value", "confidence": <number>}]}

Look for:
- Names
- Dates
- Addresses
- Account numbers
- Monetary amounts
- Any identifying information

IMPORTANT: Set confidence 0.0-1.0 based on text clarity (0.95-1.0 clear, 0.5-0.75 ambiguous, etc). Evaluate each field independently.`,
}
