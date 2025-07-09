// CÓDIGO PRINCIPAL DEL PLUGIN (code.js)

// Polyfills de TypeScript para funciones asíncronas
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var _this = this;
var copiedProperties = null;
var isQuickPasteActive = false;
var selectionChangeHandler = null;


figma.showUI(__html__, { width: 380, height: 460 });

function clone(val) {
    if (val === undefined || val === figma.mixed) { return val; }
    if (typeof val === 'object' && val !== null) {
        try { return JSON.parse(JSON.stringify(val)); }
        catch (e) { return val; }
    }
    return val;
}

function getStylesForNode(node, options) {
    const styles = { nodeType: node.type };
    if (options.copyStyle) {
        if ('fills' in node) styles.fills = clone(node.fills);
        if ('strokes' in node) styles.strokes = clone(node.strokes);
        if ('effects' in node) styles.effects = clone(node.effects);
        if ('fillStyleId' in node && node.fillStyleId) styles.fillStyleId = node.fillStyleId;
        if ('strokeStyleId' in node && node.strokeStyleId) styles.strokeStyleId = node.strokeStyleId;
        if ('effectStyleId' in node && node.effectStyleId) styles.effectStyleId = node.effectStyleId;
        if ('strokeWeight' in node) styles.strokeWeight = node.strokeWeight;
        if ('strokeAlign' in node) styles.strokeAlign = node.strokeAlign;
        if ('opacity' in node) styles.opacity = node.opacity;
    }
    if (options.copyLayout) {
        if ("layoutMode" in node && node.layoutMode !== "NONE") {
            styles.paddingLeft = node.paddingLeft; styles.paddingRight = node.paddingRight;
            styles.paddingTop = node.paddingTop; styles.paddingBottom = node.paddingBottom;
            styles.itemSpacing = node.itemSpacing; styles.layoutMode = node.layoutMode;
            styles.primaryAxisAlignItems = node.primaryAxisAlignItems;
            styles.counterAxisAlignItems = node.counterAxisAlignItems;
        }
        if ('topLeftRadius' in node) styles.topLeftRadius = node.topLeftRadius;
        if ('topRightRadius' in node) styles.topRightRadius = node.topRightRadius;
        if ('bottomLeftRadius' in node) styles.bottomLeftRadius = node.bottomLeftRadius;
        if ('bottomRightRadius' in node) styles.bottomRightRadius = node.bottomRightRadius;
        if ('layoutAlign' in node) styles.layoutAlign = node.layoutAlign;
        if ('layoutGrow' in node) styles.layoutGrow = node.layoutGrow;
        if ('layoutSizingHorizontal' in node) styles.layoutSizingHorizontal = node.layoutSizingHorizontal;
        if ('layoutSizingVertical' in node) styles.layoutSizingVertical = node.layoutSizingVertical;
    }
    if (options.copySize && "resize" in node) {
        styles.width = node.width; styles.height = node.height;
    }
    if (options.copyText && node.type === 'TEXT') {
        if ('textStyleId' in node && node.textStyleId) styles.textStyleId = node.textStyleId;
        styles.fontName = clone(node.fontName); styles.fontSize = clone(node.fontSize);
        styles.letterSpacing = clone(node.letterSpacing); styles.lineHeight = clone(node.lineHeight);
        styles.textAlignHorizontal = node.textAlignHorizontal; styles.textAlignVertical = node.textAlignVertical;
        styles.textCase = clone(node.textCase); styles.textDecoration = clone(node.textDecoration);
    }
    return styles;
}

function deepCopyStyles(node, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node.type === 'TEXT' && options.copyText && node.fontName !== figma.mixed) {
            yield figma.loadFontAsync(node.fontName);
        }
        const styles = getStylesForNode(node, options);
        if (node.children && typeof node.findOne === 'function') {
            styles.children = {};
            for (const child of node.children) {
                styles.children[child.name] = yield deepCopyStyles(child, options);
            }
        }
        return styles;
    });
}

function applyProperty(targetNode, prop, value) {
    if (prop in targetNode) {
        try {
            targetNode[prop] = value;
        } catch (e) {}
    }
}

function deepApplyStyles(targetNode, styles) {
    return __awaiter(this, void 0, void 0, function* () {
        const styleProps = Object.assign({}, styles);
        const children = styles.children;
        const width = styles.width;
        const height = styles.height;
        delete styleProps.children;
        delete styleProps.nodeType;
        delete styleProps.width;
        delete styleProps.height;

        if (styleProps.fillStyleId) applyProperty(targetNode, 'fillStyleId', styleProps.fillStyleId);
        if (styleProps.strokeStyleId) applyProperty(targetNode, 'strokeStyleId', styleProps.strokeStyleId);
        if (styleProps.effectStyleId) applyProperty(targetNode, 'effectStyleId', styleProps.effectStyleId);
        if (targetNode.type === 'TEXT' && styleProps.textStyleId) {
            applyProperty(targetNode, 'textStyleId', styleProps.textStyleId);
        }

        if (!styleProps.fillStyleId && 'fills' in styleProps) applyProperty(targetNode, 'fills', styleProps.fills);
        if (!styleProps.strokeStyleId && 'strokes' in styleProps) applyProperty(targetNode, 'strokes', styleProps.strokes);
        if (!styleProps.effectStyleId && 'effects' in styleProps) applyProperty(targetNode, 'effects', styleProps.effects);

        const containerLayoutProps = ['layoutMode', 'itemSpacing', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'primaryAxisAlignItems', 'counterAxisAlignItems'];
        for (const prop of containerLayoutProps) {
            if (prop in styleProps) applyProperty(targetNode, prop, styleProps[prop]);
        }
        
        const childLayoutProps = ['layoutAlign', 'layoutGrow', 'layoutSizingHorizontal', 'layoutSizingVertical'];
        for (const prop of childLayoutProps) {
            if (prop in styleProps) applyProperty(targetNode, prop, styleProps[prop]);
        }
        
        const visualProps = ['strokeWeight', 'strokeAlign', 'opacity', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'];
        for (const prop of visualProps) {
             if (prop in styleProps) applyProperty(targetNode, prop, styleProps[prop]);
        }

        if (targetNode.type === 'TEXT' && !styleProps.textStyleId) {
            const textProps = ['fontName', 'fontSize', 'letterSpacing', 'lineHeight', 'textAlignHorizontal', 'textAlignVertical', 'textCase', 'textDecoration'];
            for (const prop of textProps) {
                if (prop in styleProps) {
                    if (prop === 'fontName' && styleProps.fontName !== figma.mixed) {
                        yield figma.loadFontAsync(styleProps.fontName);
                    }
                    applyProperty(targetNode, prop, styleProps[prop]);
                }
            }
        }

        if (width !== undefined && height !== undefined && 'resize' in targetNode) {
            try {
                targetNode.resize(width, height);
            } catch (e) {}
        }

        // ---- INICIO DE LA CORRECCIÓN ----
        if (children && targetNode.children && typeof targetNode.findOne === 'function') {
            const sourceChildrenNames = Object.keys(children);
            // Regla especial: si solo hay un hijo en el origen y uno en el destino, aplicamos los estilos sin importar el nombre.
            if (sourceChildrenNames.length === 1 && targetNode.children.length === 1) {
                const childNode = targetNode.children[0];
                const childStyles = children[sourceChildrenNames[0]]; // Tomamos el único estilo de hijo que hay
                yield deepApplyStyles(childNode, childStyles);
            } else {
                // Lógica original: para casos complejos, seguimos haciendo coincidir por nombre.
                for (const childNode of targetNode.children) {
                    if (children[childNode.name]) {
                        yield deepApplyStyles(childNode, children[childNode.name]);
                    }
                }
            }
        }
        // ---- FIN DE LA CORRECCIÓN ----
    });
}


const quickPasteHandler = () => __awaiter(_this, void 0, void 0, function* () {
    if (!isQuickPasteActive || !copiedProperties) return;
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        for (const originalNode of selection) {
            let targetNode = originalNode;
            const needsWrapping = copiedProperties.autoWrap && copiedProperties.layoutMode && (targetNode.layoutMode === 'NONE' || !targetNode.layoutMode);
            if (needsWrapping) {
                const frame = figma.createFrame();
                const parent = targetNode.parent;
                if (parent) {
                    const index = parent.children.indexOf(originalNode);
                    parent.insertChild(index, frame);
                }
                frame.x = targetNode.x;
                frame.y = targetNode.y;
                frame.appendChild(targetNode);
                targetNode.x = 0;
                targetNode.y = 0;
                targetNode = frame;
            }
            yield deepApplyStyles(targetNode, copiedProperties);
        }
    }
});

figma.ui.onmessage = (msg) => __awaiter(_this, void 0, void 0, function* () {
    try {
        if (msg.type.startsWith('save') || msg.type.startsWith('load')) {
            if (msg.type === 'saveTheme') { yield figma.clientStorage.setAsync('theme', msg.value); }
            if (msg.type === 'saveCheckbox') { yield figma.clientStorage.setAsync(msg.key, msg.value); }
            if (msg.type === 'saveLanguage') { yield figma.clientStorage.setAsync('language', msg.value); }
            if (msg.type === 'loadPreferences') {
                const prefs = yield Promise.all([
                    figma.clientStorage.getAsync('theme'), figma.clientStorage.getAsync('style'),
                    figma.clientStorage.getAsync('layout'), figma.clientStorage.getAsync('size'),
                    figma.clientStorage.getAsync('text'), figma.clientStorage.getAsync('autoWrap'), figma.clientStorage.getAsync('language')
                ]);
                figma.ui.postMessage({ type: 'preferencesLoaded', preferences: { theme: prefs[0], style: prefs[1], layout: prefs[2], size: prefs[3], text: prefs[4], autoWrap: prefs[5], language: prefs[6] } });
            }
            return;
        }
        
        if (msg.type === 'toggleQuickPaste') {
            isQuickPasteActive = msg.value;
            if (isQuickPasteActive) {
                if(selectionChangeHandler) selectionChangeHandler.dispose();
                selectionChangeHandler = figma.on('selectionchange', quickPasteHandler);
                figma.notify('Modo Gotero Activado 💧');
            } else {
                if (selectionChangeHandler) {
                    selectionChangeHandler.dispose();
                    selectionChangeHandler = null;
                }
                figma.notify('Modo Gotero Desactivado.');
            }
            return;
        }

        const selection = figma.currentPage.selection;
        if (msg.type === 'copy') {
            if (selection.length === 0) {
                figma.notify('Por favor, selecciona un objeto para copiar sus estilos.');
                return;
            }
            const node = selection[0];
            const options = {
                copyStyle: msg.copyStyle,
                copyLayout: msg.copyLayout,
                copySize: msg.copySize,
                copyText: msg.copyText,
            };
            copiedProperties = yield deepCopyStyles(node, options);
            copiedProperties.autoWrap = msg.autoWrap;
            figma.notify('Estilos profundos copiados! ✅');
        }
        if (msg.type === 'paste') {
            if (!copiedProperties) {
                figma.notify('No hay estilos copiados. Usa "Copiar" primero.');
                return;
            }
            if (selection.length === 0) {
                figma.notify('Selecciona uno o más objetos para pegar los estilos.');
                return;
            }
            for (const originalNode of selection) {
                let targetNode = originalNode;
                const needsWrapping = copiedProperties.autoWrap && copiedProperties.layoutMode && (targetNode.layoutMode === 'NONE' || !targetNode.layoutMode);
                if (needsWrapping) {
                    const frame = figma.createFrame();
                    const parent = targetNode.parent;
                    if (parent) {
                        const index = parent.children.indexOf(originalNode);
                        parent.insertChild(index, frame);
                    }
                    frame.x = targetNode.x;
                    frame.y = targetNode.y;
                    frame.appendChild(targetNode);
                    targetNode.x = 0;
                    targetNode.y = 0;
                    targetNode = frame;
                }
                yield deepApplyStyles(targetNode, copiedProperties);
            }
            figma.notify(`Estilos pegados en ${selection.length} objeto(s)! ✨`);
        }
    }
    catch (error) {
        figma.notify('Hubo un error: ' + error.message);
        console.error('Error en el plugin:', error);
    }
});