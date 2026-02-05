import { useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { exportDocxFromConfig } from './docxExport';
import { CACHED_DOCX_CONFIG } from './mockData';

// Development mode toggle: true uses cached data, false calls AI
// ⚠️ Free API only has 20 requests per day, recommended to use cache mode during development
const USE_CACHED_DATA = false;

// Vite frontend project: API Key read from .env file
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

interface ElementNode {
  tag: string;
  text?: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  children: ElementNode[];
}

// Key style properties to extract
const STYLE_PROPERTIES = [
  'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'backgroundColor', 'color', 'fontSize', 'fontWeight', 'fontFamily',
  'textAlign', 'lineHeight', 'letterSpacing',
  'border', 'borderRadius', 'borderColor', 'borderWidth', 'borderStyle',
  'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap',
  'boxShadow', 'opacity'
];

function extractElementStyles(element: Element): Record<string, string> {
  const computed = window.getComputedStyle(element);
  const styles: Record<string, string> = {};
    for (const prop of STYLE_PROPERTIES) {
    const value = computed.getPropertyValue(
      // Convert camelCase to kebab-case
      prop.replace(/([A-Z])/g, '-$1').toLowerCase()
    );
    // Only keep meaningful values (exclude defaults)
    if (value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px') {
      styles[prop] = value;
    }
  }
  return styles;
}

function extractAttributes(element: Element): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const attr of element.attributes) {
    // Exclude style attribute (already obtained via getComputedStyle)
    if (attr.name !== 'style' && attr.name !== 'class') {
      attrs[attr.name] = attr.value;
    }
  }
  return attrs;
}

function traverseDOM(element: Element): ElementNode {
  const node: ElementNode = {
    tag: element.tagName.toLowerCase(),
    styles: extractElementStyles(element),
    attributes: extractAttributes(element),
    children: []
  };
  // Traverse child nodes
  for (const child of element.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      // Element node: process recursively
      node.children.push(traverseDOM(child as Element));
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Text node: extract text content
      const text = child.textContent?.trim();
      if (text) {
        node.children.push({
          tag: '#text',
          text,
          styles: {},
          attributes: {},
          children: []
        });
      }
    }
  }
  return node;
}

function extractLayoutJson(container: HTMLDivElement): Record<string, unknown> {
  // Recursively traverse DOM, extract complete structure and computed styles
  return {
    layout: traverseDOM(container)
  };
}

async function getWordLayoutFromAI(layoutJson: Record<string, unknown>) {
  const prompt = `You are a professional Word layout expert.

Input: A JSON containing the layout data of a web component:
${JSON.stringify(layoutJson)}

Task: Convert this data into a configuration object for the 'docx' npm library.

Requirements:
1. Use Table to simulate background color blocks, ignore rounded corners and gradients (use solid colors instead), ensure text is editable
2. Must strictly return JSON in the following structure

Size conversion rules (very important):
- Table/Cell width uses dxa unit: 1px ≈ 15dxa, e.g., 200px = 3000dxa
- TextRun size uses half-point: CSS fontSize px value × 2, e.g., 24px = 48
- margins/spacing uses twips: 1px ≈ 15twips, e.g., 24px = 360
- Image transformation width/height uses px value directly

JSON structure template:
{
  "sections": [
    {
      "children": [
        {
          "type": "Table",
          "width": { "size": 3000, "type": "dxa" },
          "rows": [
            {
              "children": [
                {
                  "type": "TableCell",
                  "shading": { "fill": "FFFFFF" },
                  "margins": { "top": 360, "bottom": 360, "left": 360, "right": 360 },
                  "children": [
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "spacing": { "before": 200, "after": 200 },
                      "children": [
                        { "type": "TextRun", "text": "Title", "bold": true, "size": 48, "color": "000000" }
                      ]
                    },
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "children": [
                        { "type": "ImageRun", "src": "image URL", "transformation": { "width": 200, "height": 133 } }
                      ]
                    },
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "children": [
                        { "type": "TextRun", "text": "Body text", "size": 32, "color": "000000" }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Key rules:
- type uses PascalCase: Table, TableCell, Paragraph, TextRun, ImageRun
- Image URL uses src field
- Colors use 6-digit hexadecimal (without #), convert from rgb() format
- All values must be pure numbers, no expressions allowed
- Background color shading.fill: if gradient or transparent, use FFFFFF (white)

Return only JSON, no explanations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt
    });
    return response.text;  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('429')) {
      throw new Error('API quota exhausted, please wait 1 minute and try again, or check your Gemini API plan.');
    }
    throw error;
  }
}

export function useExportToDoc() {
  return useCallback(async (container?: HTMLDivElement | null) => {
    if (!container) {
      alert('Content container not found');
      return;
    }
    
    let docxConfig: unknown;
    
    if (USE_CACHED_DATA) {
      // Development mode: Use cached data directly
      console.log('🔧 Development mode: Using cached docx configuration');
      docxConfig = CACHED_DOCX_CONFIG;    } else {
      // Production mode: Call AI
      const layoutJson = extractLayoutJson(container);
      console.log('Extracted layout JSON:', layoutJson);
      
      let docxConfigStr: string | undefined;
      try {
        docxConfigStr = await getWordLayoutFromAI(layoutJson);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'AI call failed');
        return;
      }
        try {
        // Handle markdown code block wrapped JSON returned by AI
        let jsonStr = docxConfigStr?.trim() ?? '';
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
        }
        
        // Fix JavaScript expressions that AI might return (e.g., 24 * 14 -> 336)
        jsonStr = jsonStr.replace(/:\s*(\d+)\s*\*\s*(\d+)/g, (_, a, b) => `: ${parseInt(a) * parseInt(b)}`);
        
        console.log('AI returned docx config string:', jsonStr);
        docxConfig = JSON.parse(jsonStr);
      } catch {
        alert('AI returned content is not valid JSON');
        return;
      }
    }
    
    await exportDocxFromConfig(docxConfig);
  }, []);
}
