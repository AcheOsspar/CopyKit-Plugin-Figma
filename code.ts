let copiedStyles = null;
let copiedTextStyles = null;

figma.showUI(__html__, { width: 350, height: 350 }); // Ventana por defecto 350x350

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "copy") {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Selecciona un nodo válido para copiar");
        return;
      }

      // Detectar autolayout con texto
      if (
        msg.copyLayout &&
        node.type === "FRAME" &&
        node.layoutMode &&
        node.children.length === 1 &&
        node.children[0].type === "TEXT"
      ) {
        const textNode = node.children[0];
        let fontName, fontSize, letterSpacing, lineHeight, fills;
        if (textNode.characters.length > 0) {
          try {
            fontName = await textNode.getRangeFontName(0, 1);
          } catch {
            fontName = textNode.fontName;
          }
          try {
            fontSize = textNode.getRangeFontSize(0, 1);
          } catch {
            fontSize = textNode.fontSize;
          }
          try {
            letterSpacing = textNode.getRangeLetterSpacing(0, 1);
          } catch {
            letterSpacing = textNode.letterSpacing;
          }
          try {
            lineHeight = textNode.getRangeLineHeight(0, 1);
          } catch {
            lineHeight = textNode.lineHeight;
          }
          try {
            fills = textNode.getRangeFills(0, 1);
          } catch {
            fills = textNode.fills;
          }
        } else {
          fontName = textNode.fontName;
          fontSize = textNode.fontSize;
          letterSpacing = textNode.letterSpacing;
          lineHeight = textNode.lineHeight;
          fills = textNode.fills;
        }
        if (fontName === figma.mixed || fontSize === figma.mixed) {
          figma.notify("El texto tiene fuentes mixtas, se copiará solo el primer estilo.");
        }
        copiedTextStyles = {
          fontName,
          fontSize,
          letterSpacing,
          lineHeight,
          textCase: textNode.textCase,
          textDecoration: textNode.textDecoration,
          fills,
        };
        copiedStyles = {
          layoutMode: node.layoutMode,
          paddingLeft: node.paddingLeft,
          paddingRight: node.paddingRight,
          paddingTop: node.paddingTop,
          paddingBottom: node.paddingBottom,
          itemSpacing: node.itemSpacing,
          cornerRadius: "cornerRadius" in node ? node.cornerRadius : null,
          effects: node.effects || [],
          fills: node.fills || [],
          strokes: node.strokes || [],
        };
        figma.notify("Estilos de autolayout + texto copiados");
        return;
      }

      // Caso general
      if (msg.copyStyle && "fills" in node) {
        copiedStyles = {
          fills: clone(node.fills),
          strokes: clone(node.strokes),
          strokeWeight: "strokeWeight" in node ? node.strokeWeight : undefined,
          cornerRadius: "cornerRadius" in node ? node.cornerRadius : null,
          effects: "effects" in node ? node.effects : [],
          layoutMode: node.layoutMode || null,
          paddingLeft: node.paddingLeft || 0,
          paddingRight: node.paddingRight || 0,
          paddingTop: node.paddingTop || 0,
          paddingBottom: node.paddingBottom || 0,
          itemSpacing: node.itemSpacing || 0,
        };
      }

      if (msg.copyText && node.type === "TEXT") {
        let fontName, fontSize, letterSpacing, lineHeight, fills;
        // Si el texto tiene caracteres, intenta obtener el primer estilo
        if (node.characters.length > 0) {
          try {
            fontName = await node.getRangeFontName(0, 1);
          } catch {
            fontName = node.fontName; // fallback si getRangeFontName falla
          }
          try {
            fontSize = node.getRangeFontSize(0, 1);
          } catch {
            fontSize = node.fontSize;
          }
          try {
            letterSpacing = node.getRangeLetterSpacing(0, 1);
          } catch {
            letterSpacing = node.letterSpacing;
          }
          try {
            lineHeight = node.getRangeLineHeight(0, 1);
          } catch {
            lineHeight = node.lineHeight;
          }
          try {
            fills = node.getRangeFills(0, 1);
          } catch {
            fills = node.fills;
          }
        } else {
          // Si el texto está vacío, usa los estilos del nodo
          fontName = node.fontName;
          fontSize = node.fontSize;
          letterSpacing = node.letterSpacing;
          lineHeight = node.lineHeight;
          fills = node.fills;
        }

        // Si fontName sigue siendo "MIXED", notifica y no copies
        if (fontName === figma.mixed || fontSize === figma.mixed) {
          figma.notify("El texto tiene fuentes mixtas, se copiará solo el primer estilo.");
        }

        copiedTextStyles = {
          fontName,
          fontSize,
          letterSpacing,
          lineHeight,
          textCase: node.textCase,
          textDecoration: node.textDecoration,
          fills,
        };
      }

      figma.notify("Estilos copiados");
    }

    if (msg.type === "paste") {
      if (!copiedStyles && !copiedTextStyles) {
        figma.notify("No hay estilos copiados aún");
        return;
      }

      for (const node of figma.currentPage.selection) {
        // Si solo hay texto seleccionado y queremos aplicar layout + texto
        if (
          msg.copyLayout &&
          copiedStyles?.layoutMode &&
          node.type === "TEXT" &&
          msg.autoWrap
        ) {
          const parent = node.parent;
          const frame = figma.createFrame();
          frame.layoutMode = copiedStyles.layoutMode;
          frame.fills = copiedStyles.fills || [];
          frame.strokes = copiedStyles.strokes || [];
          frame.effects = copiedStyles.effects || [];
          frame.itemSpacing = copiedStyles.itemSpacing || 0;
          frame.paddingLeft = copiedStyles.paddingLeft || 0;
          frame.paddingRight = copiedStyles.paddingRight || 0;
          frame.paddingTop = copiedStyles.paddingTop || 0;
          frame.paddingBottom = copiedStyles.paddingBottom || 0;
          if (copiedStyles.cornerRadius !== null)
            frame.cornerRadius = copiedStyles.cornerRadius;

          await figma.loadFontAsync(copiedTextStyles.fontName);

          // Remover el nodo de su padre antes de añadirlo al frame
          if (parent) parent.removeChild(node);
          frame.appendChild(node);
          // Añadir el frame al padre original
          if (parent) parent.appendChild(frame);

          if (msg.copyText && copiedTextStyles) {
            node.fontName = copiedTextStyles.fontName;
            node.fontSize = copiedTextStyles.fontSize;
            node.letterSpacing = copiedTextStyles.letterSpacing;
            node.lineHeight = copiedTextStyles.lineHeight;
            node.textCase = copiedTextStyles.textCase;
            node.textDecoration = copiedTextStyles.textDecoration;
            node.fills = copiedTextStyles.fills;
          }

          figma.notify("Auto Layout aplicado sobre texto");
          continue;
        }

        // Aplicar estilos visuales normales
        if (msg.copyStyle && copiedStyles && "fills" in node) {
          // Reemplazar fills
          node.fills = clone(copiedStyles.fills);

          // Reemplazar strokes y strokeWeight
          node.strokes = clone(copiedStyles.strokes);

          // Si el nodo copiado tiene strokeWeight, reemplazarlo (para RECTANGLE, FRAME, etc.)
          if ("strokeWeight" in copiedStyles && "strokeWeight" in node) {
            node.strokeWeight = copiedStyles.strokeWeight;
          } else if ("strokes" in copiedStyles && copiedStyles.strokes.length > 0 && "strokeWeight" in node) {
            // Si el nodo copiado tiene strokes, pero no strokeWeight explícito, intenta copiar el del nodo copiado
            if ("strokeWeight" in node && "strokeWeight" in copiedStyles) {
              node.strokeWeight = copiedStyles.strokeWeight;
            } else if ("strokeWeight" in node && "strokeWeight" in copiedStyles.strokes[0]) {
              node.strokeWeight = copiedStyles.strokes[0].strokeWeight || node.strokeWeight;
            }
          }

          // Reemplazar cornerRadius si aplica
          if ("cornerRadius" in node && copiedStyles.cornerRadius !== null)
            node.cornerRadius = copiedStyles.cornerRadius;

          // Reemplazar efectos
          node.effects = clone(copiedStyles.effects);

          // Reemplazar layout si corresponde
          if ("layoutMode" in node && copiedStyles.layoutMode !== null && msg.copyLayout) {
            node.layoutMode = copiedStyles.layoutMode;
            node.paddingLeft = copiedStyles.paddingLeft;
            node.paddingRight = copiedStyles.paddingRight;
            node.paddingTop = copiedStyles.paddingTop;
            node.paddingBottom = copiedStyles.paddingBottom;
            node.itemSpacing = copiedStyles.itemSpacing;
          }
        }

        if (msg.copyText && copiedTextStyles && node.type === "TEXT") {
          await figma.loadFontAsync(copiedTextStyles.fontName);
          node.fontName = copiedTextStyles.fontName;
          node.fontSize = copiedTextStyles.fontSize;
          node.letterSpacing = copiedTextStyles.letterSpacing;
          node.lineHeight = copiedTextStyles.lineHeight;
          node.textCase = copiedTextStyles.textCase;
          node.textDecoration = copiedTextStyles.textDecoration;
          node.fills = copiedTextStyles.fills;
        }
      }

      figma.notify("Estilos aplicados");
    }
  } catch (e) {
    figma.notify("Error en el plugin: " + (e.message || e));
    // Opcional: console.log(e);
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
