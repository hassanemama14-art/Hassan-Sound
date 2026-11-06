import { Book, BookPage, Language } from '../types';

export interface ParseResult {
  title: string;
  author: string;
  pages: BookPage[];
  language: Language;
  isScanned: boolean;
  message?: string;
}

export async function parseDocumentFile(file: File): Promise<ParseResult> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  if (extension === 'txt' || extension === 'text' || extension === 'md') {
    return parseTextFile(file);
  } else if (extension === 'pdf') {
    return parsePdfFile(file);
  } else {
    // Treat as plain text fallback
    return parseTextFile(file);
  }
}

async function parseTextFile(file: File): Promise<ParseResult> {
  const rawText = await file.text();
  const cleanedText = rawText.trim();

  if (!cleanedText) {
    throw new Error('The selected text document is empty.');
  }

  // Detect language based on Arabic unicode range (0x0600 - 0x06FF)
  const isArabic = /[\u0600-\u06FF]/.test(cleanedText);
  const detectedLang: Language = isArabic ? 'ar' : 'en';

  // Chunk text into pages (~1200 characters per page or double newlines)
  const rawParagraphs = cleanedText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const pages: BookPage[] = [];
  let currentPageParas: string[] = [];
  let currentLength = 0;
  let pageNum = 1;

  for (const para of rawParagraphs) {
    currentPageParas.push(para);
    currentLength += para.length;

    if (currentLength >= 1000) {
      pages.push({
        pageNumber: pageNum++,
        text: currentPageParas.join('\n\n'),
        paragraphs: [...currentPageParas]
      });
      currentPageParas = [];
      currentLength = 0;
    }
  }

  if (currentPageParas.length > 0) {
    pages.push({
      pageNumber: pageNum,
      text: currentPageParas.join('\n\n'),
      paragraphs: currentPageParas
    });
  }

  const title = file.name.replace(/\.[^/.]+$/, '');

  return {
    title,
    author: 'Imported Document',
    pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: cleanedText, paragraphs: [cleanedText] }],
    language: detectedLang,
    isScanned: false
  };
}

async function parsePdfFile(file: File): Promise<ParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Read text stream chunks from PDF binary
  const textDecoder = new TextDecoder('latin1');
  const pdfString = textDecoder.decode(bytes);

  // Look for text streams between BT (Begin Text) and ET (End Text)
  const textBlocks: string[] = [];
  const regex = /BT[\s\S]*?ET/g;
  let match;

  while ((match = regex.exec(pdfString)) !== null) {
    const block = match[0];
    // Match strings in parentheses (Text) Tj or [(T)(e)(x)(t)] TJ
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      textBlocks.push(tjMatch[1]);
    }

    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    let tjArrMatch;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      const inner = tjArrMatch[1];
      const stringMatches = inner.match(/\(([^)]+)\)/g);
      if (stringMatches) {
        const joined = stringMatches.map((s) => s.slice(1, -1)).join('');
        textBlocks.push(joined);
      }
    }
  }

  const rawExtracted = textBlocks.join(' ').replace(/\\r|\\n/g, ' ').trim();

  // If no text streams found, check if it's scanned or compressed streams
  if (rawExtracted.length < 50) {
    // Attempt standard PDF page count extraction
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g);
    const estimatedPages = Math.max(1, pageMatches ? pageMatches.length : 1);

    return {
      title: file.name.replace(/\.pdf$/i, ''),
      author: 'PDF Document',
      pages: [
        {
          pageNumber: 1,
          text: 'This PDF document appears to be scanned or contains non-extractable raster imagery without an embedded text layer.\n\nTo listen to this document, OCR (Optical Character Recognition) is required to transcribe the scanned pages into selectable text.\n\nYou can still browse document metadata in Hassan Sound or import a text-layer PDF or plain text version.',
          paragraphs: [
            'This PDF document appears to be scanned or contains non-extractable raster imagery without an embedded text layer.',
            'To listen to this document, OCR (Optical Character Recognition) is required to transcribe the scanned pages into selectable text.',
            'You can still browse document metadata in Hassan Sound or import a text-layer PDF or plain text version.'
          ]
        }
      ],
      language: 'en',
      isScanned: true,
      message: 'Scanned document detected. OCR text conversion recommended.'
    };
  }

  // Detect Arabic characters
  const isArabic = /[\u0600-\u06FF]/.test(rawExtracted);
  const detectedLang: Language = isArabic ? 'ar' : 'en';

  // Chunk extracted text into realistic pages
  const paragraphs = rawExtracted
    .split(/(?<=[.!?؟])\s+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10);

  const pages: BookPage[] = [];
  const chunkSize = 4;
  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    const pageParas = paragraphs.slice(i, i + chunkSize);
    pages.push({
      pageNumber: Math.floor(i / chunkSize) + 1,
      text: pageParas.join('\n\n'),
      paragraphs: pageParas
    });
  }

  return {
    title: file.name.replace(/\.pdf$/i, ''),
    author: 'PDF Author',
    pages: pages.length > 0 ? pages : [
      {
        pageNumber: 1,
        text: rawExtracted,
        paragraphs: [rawExtracted]
      }
    ],
    language: detectedLang,
    isScanned: false
  };
}
