import { saveAs } from 'file-saver';
import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, ImageRun, ShadingType, AlignmentType, WidthType
} from 'docx';
import type { IParagraphOptions, ITableCellOptions } from 'docx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = any;

// Utility function: Convert image URL to Uint8Array
async function fetchImageAsBuffer(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

// Convert alignment string
function parseAlignment(alignment?: string): (typeof AlignmentType)[keyof typeof AlignmentType] | undefined {
  if (!alignment) return undefined;
  const map: Record<string, (typeof AlignmentType)[keyof typeof AlignmentType]> = {
    'center': AlignmentType.CENTER,
    'left': AlignmentType.LEFT,
    'right': AlignmentType.RIGHT,
    'justify': AlignmentType.JUSTIFIED,
  };
  return map[alignment.toLowerCase()];
}

// Parse TextRun
function parseTextRun(config: AnyConfig): TextRun {
  return new TextRun({
    text: config.text || '',
    bold: config.bold,
    italics: config.italics,
    size: config.size,
    color: config.color,
    font: config.font !== 'system-ui' ? config.font : undefined,
  });
}

// Parse ImageRun
async function parseImageRun(config: AnyConfig): Promise<ImageRun> {
  // Compatible with multiple image URL field names
  const imageUrl = config.source || config.src || config.data || config.url;
  const imageBuffer = await fetchImageAsBuffer(imageUrl);
  return new ImageRun({
    data: imageBuffer,
    transformation: config.transformation || { width: 200, height: 133 },
    type: 'jpg',
  });
}

// Parse Paragraph children
async function parseParagraphChildren(children: AnyConfig[]): Promise<(TextRun | ImageRun)[]> {
  const result: (TextRun | ImageRun)[] = [];
  for (const child of children) {
    const type = child.type?.toLowerCase();
    if (type === 'text' || type === 'textrun') {
      result.push(parseTextRun(child));
    } else if (type === 'image' || type === 'image-run' || type === 'imagerun') {
      result.push(await parseImageRun(child));
    }
  }
  return result;
}

// Parse Paragraph
async function parseParagraph(config: AnyConfig): Promise<Paragraph> {
  const options: IParagraphOptions = {
    alignment: parseAlignment(config.alignment),
    spacing: config.spacing,
    children: await parseParagraphChildren(config.children || []),
  };
  return new Paragraph(options);
}

// Parse TableCell
async function parseTableCell(config: AnyConfig): Promise<TableCell> {
  const props = config.properties || config.props || {};
  const shading = props.shading || config.shading || {};
  const margins = props.margins || config.margins;

  // Parse all paragraphs inside the cell
  const cellChildren: Paragraph[] = [];
  for (const child of config.children || []) {
    const type = child.type?.toLowerCase();
    
    if (type === 'paragraph') {
      // Standard paragraph
      cellChildren.push(await parseParagraph(child));
    } else if (type === 'text' || type === 'textrun') {
      // Direct text, wrap in paragraph
      cellChildren.push(new Paragraph({
        children: [parseTextRun(child)],
        alignment: AlignmentType.CENTER,
      }));
    } else if (type === 'image' || type === 'imagerun' || type === 'image-run') {
      // Direct image, wrap in paragraph
      cellChildren.push(new Paragraph({
        children: [await parseImageRun(child)],
        alignment: AlignmentType.CENTER,
      }));    } else if (child.children && !child.type) {
      // No type but has children, treat as paragraph
      cellChildren.push(await parseParagraph(child));
    }
  }

  // Handle background color: default to white
  const fill = shading.fill && /^[0-9A-Fa-f]{6}$/.test(shading.fill) 
    ? shading.fill 
    : 'FFFFFF';

  const cellOptions: ITableCellOptions = {
    children: cellChildren,
    shading: {
      fill,
      type: ShadingType.CLEAR,  // CLEAR means no pattern, only fill as background color
      color: 'auto',
    },
    margins,
  };
  return new TableCell(cellOptions);
}

// Parse TableRow
async function parseTableRow(config: AnyConfig): Promise<TableRow> {
  const cells: TableCell[] = [];
  for (const cellConfig of config.children || []) {
    cells.push(await parseTableCell(cellConfig));
  }
  return new TableRow({ children: cells });
}

// Parse Table - Compatible with two structures: rows array or children array (with table-row)
async function parseTable(config: AnyConfig): Promise<Table> {
  const rows: TableRow[] = [];
  
  // Structure 1: { rows: [...] }
  // Structure 2: { children: [{ type: 'table-row', ... }] }
  const rowConfigs = config.rows || config.children || [];
  
  for (const rowConfig of rowConfigs) {
    const type = rowConfig.type?.toLowerCase();
    if (type === 'table-row' || rowConfig.children) {
      rows.push(await parseTableRow(rowConfig));
    }
  }
  
  return new Table({
    rows,
    width: config.width ? {
      size: config.width.size || 5000,
      type: config.width.type === 'dxa' ? WidthType.DXA : WidthType.PERCENTAGE,
    } : { size: 100, type: WidthType.PERCENTAGE },
  });
}

// Parse Section children
async function parseSectionChildren(children: AnyConfig[]): Promise<(Paragraph | Table)[]> {
  const result: (Paragraph | Table)[] = [];
  for (const child of children) {
    const type = child.type?.toLowerCase();
    if (type === 'paragraph') {
      result.push(await parseParagraph(child));
    } else if (type === 'table') {
      result.push(await parseTable(child));
    } else if (child.children && !child.type) {
      // Compatible with paragraphs without type field
      result.push(await parseParagraph(child));
    }
  }
  return result;
}

// Main export function: Recursively parse AI-generated docx configuration
export async function exportDocxFromConfig(config: AnyConfig) {
  const sections = [];

  const sectionConfigs = config.sections || [];
  if (sectionConfigs.length === 0) {
    alert('Error: config.sections is empty');
    return;
  }

  for (const sectionConfig of sectionConfigs) {
    // Compatible with two structures:
    // Structure 1: section.children contains table/paragraph
    // Structure 2: section itself is a table (type: 'table')
    const type = sectionConfig.type?.toLowerCase();
    
    if (type === 'table') {
      // New structure: section itself is a table
      const table = await parseTable(sectionConfig);
      sections.push({ children: [table] });
    } else {
      // Old structure: section.children contains elements
      const sectionChildren = sectionConfig.children || [];
      if (sectionChildren.length === 0) {
        continue; // Skip empty section
      }
      const children = await parseSectionChildren(sectionChildren);
      sections.push({ children });
    }
  }
  
  if (sections.length === 0) {
    alert('Error: No valid sections');
    return;
  }
  
  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'VisionToDoc.docx');
}
