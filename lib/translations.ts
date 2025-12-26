// Translation system for B-OCR

export type Language = 'hu' | 'en'

export const fieldNameTranslations: Record<string, { hu: string; en: string }> = {
  // Invoice fields
  'invoice_number': { hu: 'Számlaszám', en: 'Invoice Number' },
  'invoice_date': { hu: 'Számla kelte', en: 'Invoice Date' },
  'due_date': { hu: 'Fizetési határidő', en: 'Due Date' },
  'vendor_name': { hu: 'Eladó neve', en: 'Vendor Name' },
  'customer_name': { hu: 'Vevő neve', en: 'Customer Name' },
  'subtotal': { hu: 'Nettó összeg', en: 'Subtotal' },
  'tax_amount': { hu: 'ÁFA összeg', en: 'Tax Amount' },
  'total_amount': { hu: 'Végösszeg', en: 'Total Amount' },
  'currency': { hu: 'Pénznem', en: 'Currency' },
  'payment_terms': { hu: 'Fizetési mód', en: 'Payment Terms' },

  // Receipt fields
  'receipt_number': { hu: 'Bizonylat száma', en: 'Receipt Number' },
  'receipt_date': { hu: 'Bizonylat kelte', en: 'Receipt Date' },
  'merchant_name': { hu: 'Kereskedő neve', en: 'Merchant Name' },
  'items': { hu: 'Tételek', en: 'Items' },

  // Contract fields
  'contract_number': { hu: 'Szerződésszám', en: 'Contract Number' },
  'contract_date': { hu: 'Szerződés kelte', en: 'Contract Date' },
  'party_a': { hu: 'Fél A', en: 'Party A' },
  'party_b': { hu: 'Fél B', en: 'Party B' },
  'effective_date': { hu: 'Hatályba lépés', en: 'Effective Date' },
  'expiry_date': { hu: 'Lejárat', en: 'Expiry Date' },

  // Common fields
  'date': { hu: 'Dátum', en: 'Date' },
  'amount': { hu: 'Összeg', en: 'Amount' },
  'description': { hu: 'Leírás', en: 'Description' },
  'notes': { hu: 'Megjegyzések', en: 'Notes' },
  'reference': { hu: 'Hivatkozás', en: 'Reference' },
  'status': { hu: 'Státusz', en: 'Status' },
}

export const documentTypeTranslations: Record<string, { hu: string; en: string }> = {
  'INVOICE': { hu: 'Számla', en: 'Invoice' },
  'RECEIPT': { hu: 'Bizonylat', en: 'Receipt' },
  'CONTRACT': { hu: 'Szerződés', en: 'Contract' },
  'PURCHASE_ORDER': { hu: 'Megrendelés', en: 'Purchase Order' },
  'DELIVERY_NOTE': { hu: 'Szállítólevél', en: 'Delivery Note' },
  'QUOTE': { hu: 'Árajánlat', en: 'Quote' },
  'OTHER': { hu: 'Egyéb', en: 'Other' },
  'UNKNOWN': { hu: 'Ismeretlen', en: 'Unknown' },
}

export function translateFieldName(fieldKey: string, language: Language = 'hu'): string {
  const translation = fieldNameTranslations[fieldKey]
  if (translation) {
    return translation[language]
  }
  // Fallback: capitalize and replace underscores
  return fieldKey.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export function translateDocumentType(docType: string, language: Language = 'hu'): string {
  const translation = documentTypeTranslations[docType]
  if (translation) {
    return translation[language]
  }
  return docType
}
