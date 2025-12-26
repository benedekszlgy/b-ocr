// OpenAI-powered document classification and field extraction
import OpenAI from 'openai'
import { EXTRACTION_PROMPTS, DOCUMENT_TYPES } from './prompts'
import type { DocumentType, ExtractionResult } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function classifyDocument(ocrText: string): Promise<{
  type: DocumentType
  confidence: number
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cheaper for classification
      messages: [
        {
          role: 'system',
          content: `Classify this document into one of these types:
- INVOICE (commercial invoice, receipt, bill for goods/services)
- ID_CARD (driver's license, passport, state ID)
- BANK_STATEMENT
- PAY_STUB
- TAX_RETURN (W2, 1099, 1040)
- UTILITY_BILL
- EMPLOYMENT_LETTER
- UNKNOWN

Return JSON only: {"type": "TYPE", "confidence": 0.95}`,
        },
        {
          role: 'user',
          content: ocrText.slice(0, 3000), // Limit tokens
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')

    // Validate the type
    if (!DOCUMENT_TYPES.includes(result.type)) {
      return { type: 'UNKNOWN', confidence: 0.5 }
    }

    return {
      type: result.type as DocumentType,
      confidence: result.confidence || 0.5,
    }
  } catch (error) {
    console.error('Document classification error:', error)
    return { type: 'UNKNOWN', confidence: 0 }
  }
}

export async function extractFields(
  ocrText: string,
  docType: DocumentType
): Promise<ExtractionResult[]> {
  try {
    const prompt = EXTRACTION_PROMPTS[docType]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Better accuracy for extraction
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: ocrText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const data = JSON.parse(response.choices[0].message.content || '{"fields":[]}')
    return (data.fields || []) as ExtractionResult[]
  } catch (error) {
    console.error('Field extraction error:', error)
    return []
  }
}
