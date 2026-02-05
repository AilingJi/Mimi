// Development mode cached data, used for debugging Word export logic, saving API quota
// After debugging, set USE_CACHED_DATA = false in useExportToDoc.ts

export const CACHED_DOCX_CONFIG = {
  "sections": [
    {
      "properties": {},
      "children": [
        {
          "type": "Table",
          "width": {
            "size": 3120,
            "type": "dxa"
          },
          "rows": [
            {
              "children": [
                {
                  "type": "TableCell",
                  "shading": {
                    "fill": "FFFFFF",
                    "type": "clear"
                  },
                  "margins": {
                    "top": 360,
                    "bottom": 360,
                    "left": 360,
                    "right": 360
                  },
                  "children": [
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "spacing": {
                        "before": 398,
                        "after": 398
                      },
                      "children": [
                        {
                          "type": "TextRun",
                          "text": "Vision To Doc",
                          "bold": true,
                          "size": 48,
                          "color": "213547",
                          "font": "system-ui"
                        }
                      ]
                    },
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "children": [
                        {
                          "type": "ImageRun",
                          "data": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                          "transformation": {
                            "width": 200,
                            "height": 133
                          }
                        }
                      ]
                    },
                    {
                      "type": "Paragraph",
                      "alignment": "center",
                      "spacing": {
                        "before": 320,
                        "after": 320
                      },
                      "children": [
                        {
                          "type": "TextRun",
                          "text": "丰富的内容展示，色彩斑斓。",
                          "size": 32,
                          "color": "213547",
                          "font": "system-ui"
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
  ]
};
