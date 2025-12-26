// Translation system for B-OCR

export type Language = 'hu' | 'en'

// UI translations for all pages
export const uiTranslations = {
  // Common
  common: {
    loading: { hu: 'Betöltés...', en: 'Loading...' },
    error: { hu: 'Hiba', en: 'Error' },
    success: { hu: 'Sikeres', en: 'Success' },
    cancel: { hu: 'Mégse', en: 'Cancel' },
    save: { hu: 'Mentés', en: 'Save' },
    delete: { hu: 'Törlés', en: 'Delete' },
    edit: { hu: 'Szerkesztés', en: 'Edit' },
    close: { hu: 'Bezárás', en: 'Close' },
  },

  // Header
  header: {
    dashboard: { hu: 'Dashboard', en: 'Dashboard' },
    newDocument: { hu: 'Új dokumentum', en: 'New Document' },
    search: { hu: 'Keresés', en: 'Search' },
    loggedInAs: { hu: 'Bejelentkezve:', en: 'Logged in as:' },
    logout: { hu: 'Kijelentkezés', en: 'Logout' },
    language: { hu: 'Nyelv / Language', en: 'Language / Nyelv' },
  },

  // Dashboard
  dashboard: {
    title: { hu: 'Dokumentumok', en: 'Documents' },
    subtitle: { hu: 'Feltöltött és feldolgozott dokumentumok', en: 'Uploaded and processed documents' },
    noDocuments: { hu: 'Még nincsenek dokumentumok', en: 'No documents yet' },
    noDocumentsDesc: { hu: 'Kezdje új dokumentum feltöltésével', en: 'Start by uploading a new document' },
    uploadButton: { hu: 'Új dokumentum feltöltése', en: 'Upload New Document' },
    uploadedOn: { hu: 'Feltöltve:', en: 'Uploaded:' },
  },

  // Upload
  upload: {
    title: { hu: 'Dokumentum feltöltés', en: 'Document Upload' },
    subtitle: { hu: 'Töltsön fel dokumentumokat feldolgozásra', en: 'Upload documents for processing' },
    dropzone: { hu: 'Húzza ide a fájlokat vagy kattintson a tallózáshoz', en: 'Drag files here or click to browse' },
    dropzoneActive: { hu: 'Engedje el a fájlokat itt', en: 'Drop files here' },
    supportedFormats: { hu: 'Támogatott formátumok: PDF, PNG, JPG, JPEG', en: 'Supported formats: PDF, PNG, JPG, JPEG' },
    selectedFiles: { hu: 'Kiválasztott fájlok', en: 'Selected Files' },
    processAll: { hu: 'Összes feldolgozása', en: 'Process All' },
    processing: { hu: 'Feldolgozás folyamatban...', en: 'Processing...' },
    uploading: { hu: 'Feltöltés...', en: 'Uploading...' },
    complete: { hu: 'Kész', en: 'Complete' },
    viewResults: { hu: 'Eredmények megtekintése', en: 'View Results' },
    uploadMore: { hu: 'További feltöltés', en: 'Upload More' },
    backToDashboard: { hu: 'Vissza a dashboardra', en: 'Back to Dashboard' },
  },

  // Search
  search: {
    title: { hu: 'Dokumentum keresés', en: 'Document Search' },
    subtitle: { hu: 'Keressen a feldolgozott dokumentumok tartalmában', en: 'Search in processed document content' },
    placeholder: { hu: 'Keressen számla számra, ügyfél névre, összegre...', en: 'Search for invoice number, customer name, amount...' },
    searchButton: { hu: 'Keresés', en: 'Search' },
    searching: { hu: 'Keresés...', en: 'Searching...' },
    noResults: { hu: 'Nincs találat', en: 'No Results' },
    noResultsDesc: { hu: 'Próbáljon más kulcsszavakkal keresni', en: 'Try searching with different keywords' },
    resultsCount: { hu: 'találat', en: 'results' },
    relevance: { hu: 'relevancia', en: 'relevance' },
    startTyping: { hu: 'Kezdjen el gépelni a kereséshez', en: 'Start typing to search' },
    startTypingDesc: { hu: 'Használja a keresőmezőt dokumentumok tartalmának keresésére', en: 'Use the search box to find document content' },
  },

  // Document Details
  documentDetails: {
    title: { hu: 'Dokumentum részletei', en: 'Document Details' },
    uploadedOn: { hu: 'Feltöltve:', en: 'Uploaded:' },
    processingComplete: { hu: 'Feldolgozás kész', en: 'Processing Complete' },
    documentType: { hu: 'Dokumentum típusa:', en: 'Document Type:' },
    confidence: { hu: 'Megbízhatóság:', en: 'Confidence:' },
    extractedData: { hu: 'Kinyert adatok', en: 'Extracted Data' },
    backToDashboard: { hu: 'Vissza a dashboardra', en: 'Back to Dashboard' },
    notFound: { hu: 'Dokumentum nem található', en: 'Document Not Found' },
    notFoundDesc: { hu: 'A keresett dokumentum nem létezik vagy nem érhető el', en: 'The requested document does not exist or is not accessible' },
    showFields: { hu: 'Mezők mutatása', en: 'Show Fields' },
    showJson: { hu: 'Részletek (JSON)', en: 'Details (JSON)' },
    deleteDocument: { hu: 'Ügylet törlése', en: 'Delete Document' },
    jsonDetails: { hu: 'JSON Részletek', en: 'JSON Details' },
    noDocumentSelected: { hu: 'Nincs kiválasztott dokumentum', en: 'No Document Selected' },
    selectDocument: { hu: 'Válasszon egy dokumentumot a dashboardról', en: 'Select a document from the dashboard' },
  },

  // Login
  login: {
    title: { hu: 'Bejelentkezés', en: 'Sign In' },
    subtitle: { hu: 'Intelligens dokumentum feldolgozás', en: 'Intelligent Document Processing' },
    email: { hu: 'Email cím', en: 'Email Address' },
    password: { hu: 'Jelszó', en: 'Password' },
    signIn: { hu: 'Bejelentkezés', en: 'Sign In' },
    signingIn: { hu: 'Bejelentkezés...', en: 'Signing in...' },
  },
}

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

// Helper function to get UI translations
export function t(key: string, language: Language = 'hu'): string {
  const keys = key.split('.')
  let value: any = uiTranslations

  for (const k of keys) {
    value = value?.[k]
    if (!value) return key
  }

  return value[language] || key
}
