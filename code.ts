let copiedStyles = null;
let copiedTextStyles = null;

async function loadSize() {
  const size = await figma.clientStorage.getAsync('pluginWindowSize');
  if (size) {
    figma.ui.resize(size.width, size.height);
    figma.ui.postMessage({ type: 'set-size', width: size.width, height: size.height });
  } else {
    figma.ui.resize(220, 180);
  }
}

figma.showUI(__html__, { width: 220, height: 180 });

loadSize();

figma.ui.onmessage = async (msg) => {
  if (msg.type === "copy") {
    const node = figma.currentPage.selection[0];
    if (!node) {
      figma.notify("Selecciona un nodo válido para copiar");
      return;
    }

    if (msg.copyStyle && "fills" in node) {
      copiedStyles = {
        fills: clone(node.fills),
        strokes: clone(node.strokes),
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
      copiedTextStyles = {
        fontName: await node.getRangeFontName(0, 1),
        fontSize: node.getRangeFontSize(0, 1),
        letterSpacing: node.getRangeLetterSpacing(0, 1),
        lineHeight: node.getRangeLineHeight(0, 1),
        textCase: node.textCase,
        textDecoration: node.textDecoration,
        fills: node.getRangeFills(0, 1),
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
      if (msg.copyStyle && copiedStyles && "fills" in node) {
        node.fills = clone(copiedStyles.fills);
        node.strokes = clone(copiedStyles.strokes);
        if ("cornerRadius" in node && copiedStyles.cornerRadius !== null)
          node.cornerRadius = copiedStyles.cornerRadius;
        node.effects = clone(copiedStyles.effects);
        if ("layoutMode" in node && copiedStyles.layoutMode !== null) {
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

  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
    await figma.clientStorage.setAsync('pluginWindowSize', { width: msg.width, height: msg.height });
  }
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
