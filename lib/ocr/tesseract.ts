// OCR functionality using Tesseract.js
import { createWorker } from 'tesseract.js'

export interface OCRProgress {
  status: string
  progress: number
}

export async function extractTextFromImage(
  imageUrl: string,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> {
  const isServer = typeof window === 'undefined'

  // TEMPORARY: For server-side testing, return mock OCR text
  // In production, you would need to use a proper server-side OCR solution
  // like Tesseract CLI, Google Vision API, or AWS Textract
  if (isServer) {
    console.log('Using mock OCR for server-side processing')
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Return mock text that looks like a pay stub or bank statement
    return `
ACME CORPORATION
Pay Stub for Period Ending: 12/31/2024

Employee: John Doe
Employee ID: 12345
Social Security: XXX-XX-1234

Earnings:
Regular Pay: $5,000.00
Overtime Pay: $500.00
Gross Pay: $5,500.00

Deductions:
Federal Tax: $825.00
State Tax: $275.00
Social Security: $341.00
Medicare: $79.75

Net Pay: $3,979.25
YTD Gross: $66,000.00
    `.trim()
  }

  // Browser-side OCR (original implementation)
  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (onProgress && m.status && m.progress !== undefined) {
        onProgress({
          status: m.status,
          progress: m.progress,
        })
      }
    },
  })

  const result = await worker.recognize(imageUrl)
  await worker.terminate()

  return result.data.text
}

export async function extractTextFromPDF(
  pdfFile: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<string> {
  // For PDFs, we'll use pdfjs-dist to render pages to images, then OCR each
  const pdfjsLib = await import('pdfjs-dist')

  // Set worker path
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

  const arrayBuffer = await pdfFile.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const texts: string[] = []
  const totalPages = pdf.numPages

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) {
      onProgress({
        status: `Processing page ${pageNum}/${totalPages}`,
        progress: (pageNum - 1) / totalPages,
      })
    }

    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2.0 })

    // Create canvas
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height

    // Render page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise

    // OCR the canvas
    const imageData = canvas.toDataURL('image/png')
    const text = await extractTextFromImage(imageData)
    texts.push(text)
  }

  if (onProgress) {
    onProgress({ status: 'Complete', progress: 1 })
  }

  return texts.join('\n\n--- PAGE BREAK ---\n\n')
}
