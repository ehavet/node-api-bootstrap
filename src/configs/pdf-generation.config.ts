const config = require('../config')

export interface PDFGenerationConfig {
    productionMode: boolean
}

export const pdfGenerationConfig: PDFGenerationConfig = {
  productionMode: config.get('FALCO_API_PDF_GENERATION_PRODUCTION_MODE')
}
