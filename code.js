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

// Variables globales para almacenar los estilos copiados
var copiedStyles = null;
var copiedTextStyles = null;

// Mostrar la interfaz de usuario del plugin
figma.showUI(__html__, { width: 320, height: 390 });

// Manejador de mensajes unificado para toda la comunicación desde la UI
figma.ui.onmessage = (msg) => __awaiter(_this, void 0, void 0, function* () {
    try {
        // --- Lógica para guardar preferencias ---
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

        // --- Lógica para cargar preferencias ---
        if (msg.type === 'loadPreferences') {
            const [theme, style, layout, text, autoWrap, language] = yield Promise.all([
                figma.clientStorage.getAsync('theme'),
                figma.clientStorage.getAsync('style'),
                figma.clientStorage.getAsync('layout'),
                figma.clientStorage.getAsync('text'),
                figma.clientStorage.getAsync('autoWrap'),
                figma.clientStorage.getAsync('language')
            ]);

            figma.ui.postMessage({
                type: 'preferencesLoaded', // Mensaje claro para la UI
                preferences: {
                    theme,
                    style,
                    layout,
                    text,
                    autoWrap,
                    language
                }
            });
            return;
        }

        // --- Lógica de Copiar y Pegar ---
        if (msg.type === "copy") {
            const node = figma.currentPage.selection[0];
            if (!node) {
                figma.notify("Selecciona un nodo para copiar");
                return;
            }
            // Aquí va tu lógica completa para extraer y almacenar estilos en las variables globales
            // Ejemplo: copiedStyles = { fills: node.fills, ... };
            figma.notify("Estilos copiados!");
            return;
        }

        if (msg.type === "paste") {
            if (!copiedStyles && !copiedTextStyles) {
                figma.notify("No hay estilos en el portapapeles");
                return;
            }
            if (figma.currentPage.selection.length === 0) {
                figma.notify("Selecciona al menos un nodo para pegar los estilos");
                return;
            }
            for (const node of figma.currentPage.selection) {
                // Aquí va tu lógica completa para aplicar los estilos guardados al nodo
                // Ejemplo: if (copiedStyles.fills) node.fills = copiedStyles.fills;
            }
            figma.notify("Estilos aplicados");
            return;
        }

    } catch (e) {
        figma.notify("Error: " + (e.message || e));
    }
});