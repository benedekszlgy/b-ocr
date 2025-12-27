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
    documentsProcessed: { hu: 'dokumentum feldolgozva', en: 'documents processed' },
    noDocuments: { hu: 'Még nincsenek dokumentumok', en: 'No documents yet' },
    noDocumentsDesc: { hu: 'Kezdje új dokumentum feltöltésével', en: 'Start by uploading a new document' },
    uploadButton: { hu: 'Új dokumentum feltöltése', en: 'Upload New Document' },
    newDocument: { hu: 'Új dokumentum', en: 'New Document' },
    uploadedOn: { hu: 'Feltöltve:', en: 'Uploaded:' },
    processing: { hu: 'Feldolgozás alatt', en: 'Processing' },
    viewDocument: { hu: 'Dokumentum megtekintése', en: 'View Document' },
  },

  // Upload
  upload: {
    title: { hu: 'Dokumentumok feltöltése', en: 'Upload Documents' },
    subtitle: { hu: 'Töltsön fel dokumentumokat feldolgozásra', en: 'Upload documents for processing' },
    infoText: { hu: 'A feltöltött dokumentumok automatikusan feldolgozásra kerülnek. Támogatott formátumok: PDF, PNG, JPG.', en: 'Uploaded documents will be processed automatically. Supported formats: PDF, PNG, JPG.' },
    dropzone: { hu: 'Húzza ide a fájlokat vagy kattintson a tallózáshoz', en: 'Drag files here or click to browse' },
    dropzoneActive: { hu: 'Engedje el a fájlokat itt', en: 'Drop files here' },
    maxFileSize: { hu: 'Maximum 10MB fájlonként', en: 'Maximum 10MB per file' },
    supportedFormats: { hu: 'Támogatott formátumok: PDF, PNG, JPG, JPEG', en: 'Supported formats: PDF, PNG, JPG, JPEG' },
    unsupportedFormat: { hu: 'Nem támogatott fájlformátum. Csak PDF, PNG, JPG és JPEG fájlokat fogadunk el.', en: 'Unsupported file format. Only PDF, PNG, JPG and JPEG files are accepted.' },
    selectedFiles: { hu: 'Kiválasztott fájlok', en: 'Selected Files' },
    extractData: { hu: 'Adatok kinyerése', en: 'Extract Data' },
    processAll: { hu: 'Összes feldolgozása', en: 'Process All' },
    processing: { hu: 'Feldolgozás...', en: 'Processing...' },
    processingDocs: { hu: 'Dokumentumok elemzése folyamatban...', en: 'Analyzing documents...' },
    uploading: { hu: 'Feltöltés...', en: 'Uploading...' },
    complete: { hu: 'Kész', en: 'Complete' },
    error: { hu: 'Hiba', en: 'Error' },
    errorOccurred: { hu: 'Hiba történt:', en: 'Error occurred:' },
    viewResults: { hu: 'Eredmények megtekintése', en: 'View Results' },
    uploadMore: { hu: 'Új feltöltés', en: 'New Upload' },
    backToDashboard: { hu: 'Vissza a dashboardra', en: 'Back to Dashboard' },
    extractedData: { hu: 'Kinyert adatok', en: 'Extracted Data' },
    processingComplete: { hu: 'Feldolgozás kész', en: 'Processing Complete' },
    documentType: { hu: 'Dokumentum típusa:', en: 'Document Type:' },
    confidence: { hu: 'Megbízhatóság:', en: 'Confidence:' },
    showFields: { hu: 'Mezők mutatása', en: 'Show Fields' },
    showJson: { hu: 'Részletek (JSON)', en: 'Details (JSON)' },
    deleteDocument: { hu: 'Ügylet törlése', en: 'Delete Document' },
    confirmDelete: { hu: 'Biztosan törölni szeretné ezt a dokumentumot?', en: 'Are you sure you want to delete this document?' },
    deleteError: { hu: 'Hiba történt a törlés során', en: 'Error occurred while deleting' },
    jsonDetails: { hu: 'JSON Részletek', en: 'JSON Details' },
    noProcessedDocs: { hu: 'Nincs feldolgozott dokumentum', en: 'No processed documents' },
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
    signUpTitle: { hu: 'Fiók létrehozása', en: 'Create Account' },
    subtitle: { hu: 'Jelentkezzen be a folytatáshoz', en: 'Sign in to continue' },
    signUpSubtitle: { hu: 'Regisztráljon a dokumentumok feldolgozásához', en: 'Sign up to process documents' },
    email: { hu: 'Email cím', en: 'Email Address' },
    emailPlaceholder: { hu: 'pelda@email.com', en: 'example@email.com' },
    password: { hu: 'Jelszó', en: 'Password' },
    passwordPlaceholder: { hu: '••••••••', en: '••••••••' },
    signIn: { hu: 'Bejelentkezés', en: 'Sign In' },
    signUp: { hu: 'Regisztráció', en: 'Sign Up' },
    loading: { hu: 'Betöltés...', en: 'Loading...' },
    signUpSuccess: { hu: 'Regisztráció sikeres! Ellenőrizze email fiókját a megerősítéshez.', en: 'Registration successful! Check your email for confirmation.' },
    errorOccurred: { hu: 'Hiba történt', en: 'An error occurred' },
    haveAccount: { hu: 'Van már fiókja? Jelentkezzen be', en: 'Already have an account? Sign in' },
    noAccount: { hu: 'Nincs még fiókja? Regisztráljon', en: 'No account yet? Sign up' },
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

  // ID Card fields
  'full_name': { hu: 'Teljes név', en: 'Full Name' },
  'date_of_birth': { hu: 'Születési dátum', en: 'Date of Birth' },
  'address': { hu: 'Lakcím', en: 'Address' },
  'document_number': { hu: 'Okmányazonosító', en: 'Document Number' },
  'expiry_date': { hu: 'Lejárat', en: 'Expiry Date' },
  'issuing_state': { hu: 'Kiállító állam', en: 'Issuing State' },

  // Bank Statement fields
  'account_holder_name': { hu: 'Számlatulajdonos neve', en: 'Account Holder Name' },
  'account_number': { hu: 'Számlaszám', en: 'Account Number' },
  'bank_name': { hu: 'Bank neve', en: 'Bank Name' },
  'statement_period_start': { hu: 'Kivonat kezdete', en: 'Statement Period Start' },
  'statement_period_end': { hu: 'Kivonat vége', en: 'Statement Period End' },
  'opening_balance': { hu: 'Nyitó egyenleg', en: 'Opening Balance' },
  'closing_balance': { hu: 'Záró egyenleg', en: 'Closing Balance' },
  'total_deposits': { hu: 'Összes befizetés', en: 'Total Deposits' },
  'total_withdrawals': { hu: 'Összes kifizetés', en: 'Total Withdrawals' },

  // Pay Stub fields
  'employee_name': { hu: 'Munkavállaló neve', en: 'Employee Name' },
  'employer_name': { hu: 'Munkáltató neve', en: 'Employer Name' },
  'pay_period_start': { hu: 'Fizetési időszak kezdete', en: 'Pay Period Start' },
  'pay_period_end': { hu: 'Fizetési időszak vége', en: 'Pay Period End' },
  'gross_pay': { hu: 'Bruttó bér', en: 'Gross Pay' },
  'net_pay': { hu: 'Nettó bér', en: 'Net Pay' },
  'ytd_gross': { hu: 'Éves bruttó', en: 'YTD Gross' },
  'pay_frequency': { hu: 'Fizetési gyakoriság', en: 'Pay Frequency' },

  // Tax Return fields
  'taxpayer_name': { hu: 'Adózó neve', en: 'Taxpayer Name' },
  'tax_year': { hu: 'Adóév', en: 'Tax Year' },
  'filing_status': { hu: 'Bejelentési státusz', en: 'Filing Status' },
  'total_income': { hu: 'Összes jövedelem', en: 'Total Income' },
  'adjusted_gross_income': { hu: 'Korrigált bruttó jövedelem', en: 'Adjusted Gross Income' },
  'taxable_income': { hu: 'Adóköteles jövedelem', en: 'Taxable Income' },
  'total_tax': { hu: 'Összes adó', en: 'Total Tax' },
  'wages': { hu: 'Bérek', en: 'Wages' },

  // Utility Bill fields
  'service_address': { hu: 'Szolgáltatási cím', en: 'Service Address' },
  'bill_date': { hu: 'Számla kelte', en: 'Bill Date' },
  'amount_due': { hu: 'Fizetendő összeg', en: 'Amount Due' },
  'utility_provider': { hu: 'Szolgáltató', en: 'Utility Provider' },

  // Employment Letter fields
  'job_title': { hu: 'Beosztás', en: 'Job Title' },
  'employment_start_date': { hu: 'Munkaviszony kezdete', en: 'Employment Start Date' },
  'salary': { hu: 'Fizetés', en: 'Salary' },
  'salary_frequency': { hu: 'Fizetési gyakoriság', en: 'Salary Frequency' },
  'employment_status': { hu: 'Munkaviszony típusa', en: 'Employment Status' },

  // Contract fields
  'contract_number': { hu: 'Szerződésszám', en: 'Contract Number' },
  'contract_date': { hu: 'Szerződés kelte', en: 'Contract Date' },
  'party_a': { hu: 'Fél A', en: 'Party A' },
  'party_b': { hu: 'Fél B', en: 'Party B' },
  'effective_date': { hu: 'Hatályba lépés', en: 'Effective Date' },

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
  'ID_CARD': { hu: 'Személyi igazolvány', en: 'ID Card' },
  'BANK_STATEMENT': { hu: 'Bankszámlakivonat', en: 'Bank Statement' },
  'PAY_STUB': { hu: 'Fizetési jegyzék', en: 'Pay Stub' },
  'TAX_RETURN': { hu: 'Adóbevallás', en: 'Tax Return' },
  'UTILITY_BILL': { hu: 'Közműszámla', en: 'Utility Bill' },
  'EMPLOYMENT_LETTER': { hu: 'Munkáltatói igazolás', en: 'Employment Letter' },
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
