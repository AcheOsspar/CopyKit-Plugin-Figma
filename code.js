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

// Variables globales para almacenar estilos
var copiedProperties = null;

// Mostrar la Interfaz de Usuario (UI)
figma.showUI(__html__, { width: 320, height: 390 });

// Función para clonar propiedades complejas y evitar errores de "solo lectura"
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}

// Manejador de mensajes unificado
figma.ui.onmessage = (msg) => __awaiter(_this, void 0, void 0, function* () {
    try {
        // --- GUARDAR Y CARGAR PREFERENCIAS ---
        if (msg.type === 'saveTheme') {
            yield figma.clientStorage.setAsync('theme', msg.value);
            return;
        }
        if (msg.type === 'saveCheckbox') {
            yield figma.clientStorage.setAsync(msg.key, msg.value);
            return;
        }
        if (msg.type === 'saveLanguage') {
            yield figma.clientStorage.setAsync('language', msg.value);
            return;
        }
        if (msg.type === 'loadPreferences') {
            const [theme, style, layout, text, autoWrap, language] = yield Promise.all([
                figma.clientStorage.getAsync('theme'), figma.clientStorage.getAsync('style'),
                figma.clientStorage.getAsync('layout'), figma.clientStorage.getAsync('text'),
                figma.clientStorage.getAsync('autoWrap'), figma.clientStorage.getAsync('language')
            ]);
            figma.ui.postMessage({
                type: 'preferencesLoaded',
                preferences: { theme, style, layout, text, autoWrap, language }
            });
            return;
        }

        // --- LÓGICA DE COPIAR ---
        if (msg.type === 'copy') {
            const node = figma.currentPage.selection[0];
            if (!node) {
                figma.notify('Por favor, selecciona un objeto para copiar sus estilos.');
                return;
            }

            copiedProperties = {}; // Reset

            // Copiar estilos visuales
            if (msg.copyStyle) {
                copiedProperties.fills = clone(node.fills);
                copiedProperties.strokes = clone(node.strokes);
                copiedProperties.strokeWeight = node.strokeWeight;
                copiedProperties.strokeAlign = node.strokeAlign;
                copiedProperties.effects = clone(node.effects);
            }

            // Copiar layout
            if (msg.copyLayout && "paddingLeft" in node) {
                 copiedProperties.paddingLeft = node.paddingLeft;
                 copiedProperties.paddingRight = node.paddingRight;
                 copiedProperties.paddingTop = node.paddingTop;
                 copiedProperties.paddingBottom = node.paddingBottom;
                 copiedProperties.itemSpacing = node.itemSpacing;
            }
            
            if ("cornerRadius" in node) {
                copiedProperties.cornerRadius = node.cornerRadius;
            }


            // Copiar estilos de texto
            if (msg.copyText && node.type === 'TEXT') {
                copiedProperties.fontName = clone(node.fontName);
                copiedProperties.fontSize = node.fontSize;
                copiedProperties.letterSpacing = clone(node.letterSpacing);
                copiedProperties.lineHeight = clone(node.lineHeight);
                copiedProperties.textAlignHorizontal = node.textAlignHorizontal;
                copiedProperties.textAlignVertical = node.textAlignVertical;
                copiedProperties.textCase = node.textCase;
                copiedProperties.textDecoration = node.textDecoration;
            }
            
            copiedProperties.autoWrap = msg.autoWrap;

            figma.notify('Estilos copiados! ✅');
        }

        // --- LÓGICA DE PEGAR ---
        if (msg.type === 'paste') {
            if (!copiedProperties) {
                figma.notify('No hay estilos copiados. Usa "Copiar" primero.');
                return;
            }

            const selection = figma.currentPage.selection;
            if (selection.length === 0) {
                figma.notify('Selecciona uno o más objetos para pegar los estilos.');
                return;
            }

            for (const node of selection) {
                // Aplicar Auto Layout si es necesario y está activado
                if (copiedProperties.autoWrap && "paddingLeft" in copiedProperties && !("paddingLeft" in node)) {
                    node.layoutMode = "VERTICAL";
                }

                // Aplicar estilos
                for (const prop in copiedProperties) {
                    if (prop in node) {
                        // Cargar fuente antes de aplicarla
                        if (prop === 'fontName') {
                            yield figma.loadFontAsync(copiedProperties.fontName);
                        }
                        node[prop] = copiedProperties[prop];
                    }
                }
            }
            figma.notify(`Estilos pegados en ${selection.length} objeto(s)! ✨`);
        }
    } catch (error) {
        figma.notify('Hubo un error: ' + error.message);
    }
});