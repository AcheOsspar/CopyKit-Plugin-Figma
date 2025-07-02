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
var copiedStyles = null;
var copiedTextStyles = null;
figma.showUI(__html__, { width: 350, height: 360 }); // Ventana por defecto 350x360
figma.ui.onmessage = function (msg) { return __awaiter(_this, void 0, void 0, function () {
    var node, textNode, fontName, fontSize, letterSpacing, lineHeight, fills, _a, fontName, fontSize, letterSpacing, lineHeight, fills, _b, _i, _c, node, parent_1, frame, e_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 23, , 24]);
                if (!(msg.type === "copy")) return [3 /*break*/, 15];
                node = figma.currentPage.selection[0];
                if (!node) {
                    figma.notify("Selecciona un nodo válido para copiar");
                    return [2 /*return*/];
                }
                if (!(msg.copyLayout &&
                    node.type === "FRAME" &&
                    node.layoutMode &&
                    node.children.length === 1 &&
                    node.children[0].type === "TEXT")) return [3 /*break*/, 7];
                textNode = node.children[0];
                fontName = void 0, fontSize = void 0, letterSpacing = void 0, lineHeight = void 0, fills = void 0;
                if (!(textNode.characters.length > 0)) return [3 /*break*/, 5];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, textNode.getRangeFontName(0, 1)];
            case 2:
                fontName = _d.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = _d.sent();
                fontName = textNode.fontName;
                return [3 /*break*/, 4];
            case 4:
                try {
                    fontSize = textNode.getRangeFontSize(0, 1);
                }
                catch (_e) {
                    fontSize = textNode.fontSize;
                }
                try {
                    letterSpacing = textNode.getRangeLetterSpacing(0, 1);
                }
                catch (_f) {
                    letterSpacing = textNode.letterSpacing;
                }
                try {
                    lineHeight = textNode.getRangeLineHeight(0, 1);
                }
                catch (_g) {
                    lineHeight = textNode.lineHeight;
                }
                try {
                    fills = textNode.getRangeFills(0, 1);
                }
                catch (_h) {
                    fills = textNode.fills;
                }
                return [3 /*break*/, 6];
            case 5:
                fontName = textNode.fontName;
                fontSize = textNode.fontSize;
                letterSpacing = textNode.letterSpacing;
                lineHeight = textNode.lineHeight;
                fills = textNode.fills;
                _d.label = 6;
            case 6:
                if (fontName === figma.mixed || fontSize === figma.mixed) {
                    figma.notify("El texto tiene fuentes mixtas, se copiará solo el primer estilo.");
                }
                copiedTextStyles = {
                    fontName: fontName,
                    fontSize: fontSize,
                    letterSpacing: letterSpacing,
                    lineHeight: lineHeight,
                    textCase: textNode.textCase,
                    textDecoration: textNode.textDecoration,
                    fills: fills,
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
                return [2 /*return*/];
            case 7:
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
                if (!(msg.copyText && node.type === "TEXT")) return [3 /*break*/, 14];
                fontName = void 0, fontSize = void 0, letterSpacing = void 0, lineHeight = void 0, fills = void 0;
                if (!(node.characters.length > 0)) return [3 /*break*/, 12];
                _d.label = 8;
            case 8:
                _d.trys.push([8, 10, , 11]);
                return [4 /*yield*/, node.getRangeFontName(0, 1)];
            case 9:
                fontName = _d.sent();
                return [3 /*break*/, 11];
            case 10:
                _b = _d.sent();
                fontName = node.fontName;
                return [3 /*break*/, 11];
            case 11:
                try {
                    fontSize = node.getRangeFontSize(0, 1);
                }
                catch (_j) {
                    fontSize = node.fontSize;
                }
                try {
                    letterSpacing = node.getRangeLetterSpacing(0, 1);
                }
                catch (_k) {
                    letterSpacing = node.letterSpacing;
                }
                try {
                    lineHeight = node.getRangeLineHeight(0, 1);
                }
                catch (_l) {
                    lineHeight = node.lineHeight;
                }
                try {
                    fills = node.getRangeFills(0, 1);
                }
                catch (_m) {
                    fills = node.fills;
                }
                return [3 /*break*/, 13];
            case 12:
                fontName = node.fontName;
                fontSize = node.fontSize;
                letterSpacing = node.letterSpacing;
                lineHeight = node.lineHeight;
                fills = node.fills;
                _d.label = 13;
            case 13:
                if (fontName === figma.mixed || fontSize === figma.mixed) {
                    figma.notify("El texto tiene estilos mixtos, se copiará solo el primer estilo.");
                }
                copiedTextStyles = {
                    fontName: fontName,
                    fontSize: fontSize,
                    letterSpacing: letterSpacing,
                    lineHeight: lineHeight,
                    textCase: node.textCase,
                    textDecoration: node.textDecoration,
                    fills: fills,
                };
                _d.label = 14;
            case 14:
                figma.notify("Estilos copiados");
                _d.label = 15;
            case 15:
                if (!(msg.type === "paste")) return [3 /*break*/, 22];
                if (!copiedStyles && !copiedTextStyles) {
                    figma.notify("No hay estilos copiados aún");
                    return [2 /*return*/];
                }
                _i = 0, _c = figma.currentPage.selection;
                _d.label = 16;
            case 16:
                if (!(_i < _c.length)) return [3 /*break*/, 21];
                node = _c[_i];
                if (!(msg.copyLayout &&
                    (copiedStyles === null || copiedStyles === void 0 ? void 0 : copiedStyles.layoutMode) &&
                    node.type === "TEXT" &&
                    msg.autoWrap)) return [3 /*break*/, 18];
                parent_1 = node.parent;
                frame = figma.createFrame();
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
                return [4 /*yield*/, figma.loadFontAsync(copiedTextStyles.fontName)];
            case 17:
                _d.sent();
                // Remover el nodo de su padre antes de añadirlo al frame
                if (parent_1)
                    parent_1.removeChild(node);
                frame.appendChild(node);
                // Añadir el frame al padre original
                if (parent_1)
                    parent_1.appendChild(frame);
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
                return [3 /*break*/, 20];
            case 18:
                // Aplicar estilos visuales normales
                if (msg.copyStyle && copiedStyles && "fills" in node) {
                    // Reemplazar fills
                    node.fills = clone(copiedStyles.fills);
                    // Reemplazar strokes y strokeWeight
                    node.strokes = clone(copiedStyles.strokes);
                    // Si el nodo copiado tiene strokeWeight, reemplazarlo (para RECTANGLE, FRAME, etc.)
                    if ("strokeWeight" in copiedStyles && "strokeWeight" in node) {
                        node.strokeWeight = copiedStyles.strokeWeight;
                    }
                    else if ("strokes" in copiedStyles && copiedStyles.strokes.length > 0 && "strokeWeight" in node) {
                        // Si el nodo copiado tiene strokes, pero no strokeWeight explícito, intenta copiar el del nodo copiado
                        if ("strokeWeight" in node && "strokeWeight" in copiedStyles) {
                            node.strokeWeight = copiedStyles.strokeWeight;
                        }
                        else if ("strokeWeight" in node && "strokeWeight" in copiedStyles.strokes[0]) {
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
                if (!(msg.copyText && copiedTextStyles && node.type === "TEXT")) return [3 /*break*/, 20];
                return [4 /*yield*/, figma.loadFontAsync(copiedTextStyles.fontName)];
            case 19:
                _d.sent();
                node.fontName = copiedTextStyles.fontName;
                node.fontSize = copiedTextStyles.fontSize;
                node.letterSpacing = copiedTextStyles.letterSpacing;
                node.lineHeight = copiedTextStyles.lineHeight;
                node.textCase = copiedTextStyles.textCase;
                node.textDecoration = copiedTextStyles.textDecoration;
                node.fills = copiedTextStyles.fills;
                _d.label = 20;
            case 20:
                _i++;
                return [3 /*break*/, 16];
            case 21:
                figma.notify("Estilos aplicados");
                _d.label = 22;
            case 22: return [3 /*break*/, 24];
            case 23:
                e_1 = _d.sent();
                figma.notify("Error en el plugin: " + (e_1.message || e_1));
                return [3 /*break*/, 24];
            case 24: return [2 /*return*/];
        }
    });
}); };
function clone(value) {
    return JSON.parse(JSON.stringify(value));
}
