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
var temporaryVectors = []; // Array para guardar IDs de vectores temporales

// Función para limpiar vectores temporales
function cleanupTemporaryVectors() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < temporaryVectors.length; i++) {
            try {
                var vectorNode = yield figma.getNodeByIdAsync(temporaryVectors[i]);
                if (vectorNode) {
                    vectorNode.remove();
                    console.log('🧹 Vector temporal limpiado: ' + temporaryVectors[i]);
                }
            } catch (e) {
                // Vector ya no existe, ignorar
                console.log('🧹 Vector temporal ya no existe: ' + temporaryVectors[i]);
            }
        }
        temporaryVectors = [];
    });
}


figma.showUI(__html__, { width: 380, height: 600 });

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
    
    // Detectar si es una instancia de componente o está dentro de uno
    let sourceNode = node;
    if (node.type === 'INSTANCE') {
        // Si es una instancia de componente, usar el nodo directamente
        sourceNode = node;
    }
    
    // Debug: Mostrar todas las propiedades relacionadas con estilos
    console.log('=== DEBUGGING STYLE PROPERTIES ===');
    console.log(`Nodo: ${sourceNode.name} (${sourceNode.type})`);
    console.log('Node tiene las siguientes propiedades de estilo:');
    console.log('- fillStyleId:', sourceNode.fillStyleId, '(tipo:', typeof sourceNode.fillStyleId, ')');
    console.log('- strokeStyleId:', sourceNode.strokeStyleId, '(tipo:', typeof sourceNode.strokeStyleId, ')');
    console.log('- effectStyleId:', sourceNode.effectStyleId, '(tipo:', typeof sourceNode.effectStyleId, ')');
    if (sourceNode.type === 'TEXT') {
        console.log('- textStyleId:', sourceNode.textStyleId, '(tipo:', typeof sourceNode.textStyleId, ')');
    }
    console.log('Node tiene las siguientes propiedades individuales:');
    console.log('- fills length:', sourceNode.fills ? sourceNode.fills.length : 'N/A');
    console.log('- strokes length:', sourceNode.strokes ? sourceNode.strokes.length : 'N/A');
    console.log('- effects length:', sourceNode.effects ? sourceNode.effects.length : 'N/A');
    console.log('Opciones de copia seleccionadas:');
    console.log('- copyFill:', options.copyFill);
    console.log('- copyStroke:', options.copyStroke);
    console.log('- copyEffects:', options.copyEffects);
    console.log('- copyText:', options.copyText);
    console.log('=====================================');
    
    // Fill (rellenos y colores)
    if (options.copyFill) {
        console.log('🔍 Analizando Fill...');
        
        // PRIORIDAD: Copiar Style IDs primero (Design System)
        if (sourceNode.fillStyleId) {
            console.log('📋 fillStyleId encontrado:', sourceNode.fillStyleId);
            console.log('📋 Tipo:', typeof sourceNode.fillStyleId);
            console.log('📋 Es mixed?:', sourceNode.fillStyleId === figma.mixed);
            
            // Simplificar validación - solo verificar que no sea undefined, null o mixed
            if (sourceNode.fillStyleId !== undefined && 
                sourceNode.fillStyleId !== null && 
                sourceNode.fillStyleId !== figma.mixed) {
                
                styles.fillStyleId = sourceNode.fillStyleId;
                console.log('✅ Guardando fillStyleId:', sourceNode.fillStyleId);
                
                // Intentar obtener el nombre del estilo para debugging
                try {
                    const fillStyle = figma.getStyleById(sourceNode.fillStyleId);
                    if (fillStyle) {
                        console.log('✅ Color Style LOCAL encontrado:', fillStyle.name);
                        styles.fillStyleName = fillStyle.name;
                    }
                } catch (e) {
                    console.log('⚠️ Color Style EXTERNO (Design System):', sourceNode.fillStyleId);
                    console.log('⚠️ Error al acceder:', e.message);
                    styles.fillStyleName = 'External Design System Style';
                }
            } else {
                console.log('❌ fillStyleId no válido o es mixed');
            }
        } else {
            console.log('❌ No hay fillStyleId en el nodo');
        }
        
        // Siempre copiar fills como respaldo
        if (sourceNode.fills && sourceNode.fills.length > 0) {
            styles.fills = clone(sourceNode.fills);
            console.log('✅ Copiando fills como respaldo:', sourceNode.fills.length, 'elementos');
        } else {
            console.log('❌ No hay fills en el nodo');
        }
    }
    
    // Stroke (bordes y trazos)
    if (options.copyStroke) {
        console.log('🔍 Analizando Stroke...');
        
        // PRIORIDAD: Copiar Style IDs primero (Design System)
        if (sourceNode.strokeStyleId) {
            console.log('📋 strokeStyleId encontrado:', sourceNode.strokeStyleId);
            
            if (sourceNode.strokeStyleId !== undefined && 
                sourceNode.strokeStyleId !== null && 
                sourceNode.strokeStyleId !== figma.mixed) {
                
                styles.strokeStyleId = sourceNode.strokeStyleId;
                console.log('✅ Guardando strokeStyleId:', sourceNode.strokeStyleId);
                
                try {
                    const strokeStyle = figma.getStyleById(sourceNode.strokeStyleId);
                    if (strokeStyle) {
                        console.log('✅ Stroke Style LOCAL:', strokeStyle.name);
                        styles.strokeStyleName = strokeStyle.name;
                    }
                } catch (e) {
                    console.log('⚠️ Stroke Style EXTERNO:', sourceNode.strokeStyleId);
                    styles.strokeStyleName = 'External Stroke Style';
                }
            }
        }
        
        // Siempre copiar propiedades como respaldo
        if (sourceNode.strokes && sourceNode.strokes.length > 0) {
            styles.strokes = clone(sourceNode.strokes);
            console.log('✅ Copiando strokes:', sourceNode.strokes.length, 'elementos');
        }
        if (sourceNode.strokeWeight !== undefined) {
            styles.strokeWeight = sourceNode.strokeWeight;
            console.log('✅ Copiando strokeWeight:', sourceNode.strokeWeight);
        }
        if (sourceNode.strokeAlign !== undefined) {
            styles.strokeAlign = sourceNode.strokeAlign;
            console.log('✅ Copiando strokeAlign:', sourceNode.strokeAlign);
        }
    }
    
    // Effects (sombras y efectos)
    if (options.copyEffects) {
        console.log('🔍 Analizando Effects...');
        
        // PRIORIDAD: Copiar Style IDs primero (Design System)
        if (sourceNode.effectStyleId) {
            console.log('📋 effectStyleId encontrado:', sourceNode.effectStyleId);
            
            if (sourceNode.effectStyleId !== undefined && 
                sourceNode.effectStyleId !== null && 
                sourceNode.effectStyleId !== figma.mixed) {
                
                styles.effectStyleId = sourceNode.effectStyleId;
                console.log('✅ Guardando effectStyleId:', sourceNode.effectStyleId);
                
                try {
                    const effectStyle = figma.getStyleById(sourceNode.effectStyleId);
                    if (effectStyle) {
                        console.log('✅ Effect Style LOCAL:', effectStyle.name);
                        styles.effectStyleName = effectStyle.name;
                    }
                } catch (e) {
                    console.log('⚠️ Effect Style EXTERNO:', sourceNode.effectStyleId);
                    styles.effectStyleName = 'External Effect Style';
                }
            }
        }
        
        // Siempre copiar effects como respaldo
        if (sourceNode.effects && sourceNode.effects.length > 0) {
            styles.effects = clone(sourceNode.effects);
            console.log('✅ Copiando effects:', sourceNode.effects.length, 'elementos');
        }
    }
    
    // Opacity & Blending (transparencia)
    if (options.copyOpacity) {
        if ('opacity' in sourceNode) styles.opacity = sourceNode.opacity;
    }
    
    // Corner Radius (bordes redondeados)
    if (options.copyRadius) {
        if ('topLeftRadius' in sourceNode) styles.topLeftRadius = sourceNode.topLeftRadius;
        if ('topRightRadius' in sourceNode) styles.topRightRadius = sourceNode.topRightRadius;
        if ('bottomLeftRadius' in sourceNode) styles.bottomLeftRadius = sourceNode.bottomLeftRadius;
        if ('bottomRightRadius' in sourceNode) styles.bottomRightRadius = sourceNode.bottomRightRadius;
    }
    
    if (options.copyLayout) {
        if ("layoutMode" in sourceNode && sourceNode.layoutMode !== "NONE") {
            styles.paddingLeft = sourceNode.paddingLeft; styles.paddingRight = sourceNode.paddingRight;
            styles.paddingTop = sourceNode.paddingTop; styles.paddingBottom = sourceNode.paddingBottom;
            styles.itemSpacing = sourceNode.itemSpacing; styles.layoutMode = sourceNode.layoutMode;
            styles.primaryAxisAlignItems = sourceNode.primaryAxisAlignItems;
            styles.counterAxisAlignItems = sourceNode.counterAxisAlignItems;
        }
        if ('layoutAlign' in sourceNode) styles.layoutAlign = sourceNode.layoutAlign;
        if ('layoutGrow' in sourceNode) styles.layoutGrow = sourceNode.layoutGrow;
        if ('layoutSizingHorizontal' in sourceNode) styles.layoutSizingHorizontal = sourceNode.layoutSizingHorizontal;
        if ('layoutSizingVertical' in sourceNode) styles.layoutSizingVertical = sourceNode.layoutSizingVertical;
    }
    if (options.copySize && "resize" in sourceNode) {
        styles.width = sourceNode.width; styles.height = sourceNode.height;
    }
    if (options.copyText && sourceNode.type === 'TEXT') {
        console.log('🔍 Analizando Text Styles...');
        
        // PRIORIDAD: Copiar Text Style ID primero (Design System)
        if (sourceNode.textStyleId) {
            console.log('📋 textStyleId encontrado:', sourceNode.textStyleId);
            
            if (sourceNode.textStyleId !== undefined && 
                sourceNode.textStyleId !== null && 
                sourceNode.textStyleId !== figma.mixed) {
                
                styles.textStyleId = sourceNode.textStyleId;
                console.log('✅ Guardando textStyleId:', sourceNode.textStyleId);
                
                try {
                    const textStyle = figma.getStyleById(sourceNode.textStyleId);
                    if (textStyle) {
                        console.log('✅ Text Style LOCAL:', textStyle.name);
                        styles.textStyleName = textStyle.name;
                    }
                } catch (e) {
                    console.log('⚠️ Text Style EXTERNO:', sourceNode.textStyleId);
                    styles.textStyleName = 'External Text Style';
                }
            }
        }
        
        // Siempre copiar propiedades como respaldo
        styles.fontName = clone(sourceNode.fontName); 
        styles.fontSize = clone(sourceNode.fontSize);
        styles.letterSpacing = clone(sourceNode.letterSpacing); 
        styles.lineHeight = clone(sourceNode.lineHeight);
        styles.textAlignHorizontal = sourceNode.textAlignHorizontal; 
        styles.textAlignVertical = sourceNode.textAlignVertical;
        styles.textCase = clone(sourceNode.textCase); 
        styles.textDecoration = clone(sourceNode.textDecoration);
        
        console.log('✅ Propiedades de texto copiadas como respaldo');
    }
    
    // Información adicional para debugging
    styles.isInstance = sourceNode.type === 'INSTANCE';
    styles.nodeName = sourceNode.name;
    
    return styles;
}

function deepCopyStyles(node, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar si es texto y cargar fuente si es necesario
        if (node.type === 'TEXT' && options.copyText && node.fontName !== figma.mixed) {
            try {
                yield figma.loadFontAsync(node.fontName);
            } catch (e) {
                console.log('No se pudo cargar fuente:', node.fontName);
            }
        }
        
        const styles = getStylesForNode(node, options);
        
        // Guardar opciones de clonación para usar en el destino
        styles.cloneStructure = options.cloneStructure;
        
        // Información de debug mejorada
        console.log(`Copiando estilos de: ${node.name} (${node.type})`);
        if (node.type === 'INSTANCE') {
            console.log('Es una instancia de componente');
        }
        if (options.cloneStructure) {
            console.log('🏗️ Clonación de estructura ACTIVADA');
        }
        
        // Copiar estilos de hijos para componentes e instancias
        if (node.children && node.children.length > 0) {
            styles.children = {};
            styles.childrenOrder = []; // Nuevo: guardar orden exacto
            
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                try {
                    const childStyles = yield deepCopyStyles(child, options);
                    // Agregar información de orden y tipo
                    childStyles.originalIndex = i;
                    childStyles.nodeType = child.type;
                    childStyles.nodeName = child.name;
                    
                    // Información adicional para mejor recreación
                    if ('width' in child && 'height' in child) {
                        childStyles.width = child.width;
                        childStyles.height = child.height;
                    }
                    if ('x' in child && 'y' in child) {
                        childStyles.x = child.x;
                        childStyles.y = child.y;
                    }
                    
                    // Información especial para vectores
                    if (child.type === 'VECTOR' || child.type === 'BOOLEAN_OPERATION') {
                        childStyles.isVector = true;
                        childStyles.canDuplicate = true;
                        
                        // Duplicar inmediatamente el vector y guardarlo temporalmente
                        try {
                            var duplicatedVector = child.clone();
                            // Mover el vector duplicado a una posición temporal fuera del canvas
                            duplicatedVector.x = -9999;
                            duplicatedVector.y = -9999;
                            
                            // Agregar al canvas temporal para que persista
                            figma.currentPage.appendChild(duplicatedVector);
                            
                            // Guardar el ID para referencia posterior
                            childStyles.vectorCopyId = duplicatedVector.id;
                            childStyles.vectorCopyAvailable = true;
                            
                            // Registrar para limpieza posterior
                            temporaryVectors.push(duplicatedVector.id);
                            
                            console.log('✅ Vector duplicado y guardado temporalmente: ' + child.name + ' (ID: ' + duplicatedVector.id + ')');
                        } catch (e) {
                            console.log('⚠️ No se pudo duplicar vector ' + child.name + ', usará fallback: ' + e.message);
                            childStyles.vectorCopyAvailable = false;
                        }
                        
                        if ('vectorNetwork' in child) {
                            childStyles.vectorData = 'complex_vector';
                        }
                        
                        console.log('📐 Vector detectado para clonación: ' + child.name + ' (' + child.type + ')');
                    }
                    
                    styles.children[child.name] = childStyles;
                    styles.childrenOrder.push({
                        name: child.name,
                        type: child.type,
                        index: i
                    });
                } catch (e) {
                    console.log(`Error copiando hijo ${child.name}:`, e.message);
                }
            }
            console.log(`🏗️ Copiados estilos de ${node.children.length} hijos con información de orden`);
            console.log('🔢 Orden original:', styles.childrenOrder.map(function(item) { return item.name + ' (' + item.type + ')'; }).join(' → '));
        }
        
        return styles;
    });
}

function createElementFromStructure(elementInfo, parent) {
    return __awaiter(this, void 0, void 0, function* () {
        let newElement;
        
        // Crear el elemento según su tipo
        switch (elementInfo.nodeType) {
            case 'RECTANGLE':
                newElement = figma.createRectangle();
                break;
            case 'ELLIPSE':
                newElement = figma.createEllipse();
                break;
            case 'POLYGON':
                newElement = figma.createPolygon();
                break;
            case 'STAR':
                newElement = figma.createStar();
                break;
            case 'VECTOR':
                // Intentar usar el vector duplicado si está disponible
                if (elementInfo.vectorCopyAvailable && elementInfo.vectorCopyId) {
                    try {
                        // Buscar el vector duplicado por ID usando método asíncrono
                        var savedVector = yield figma.getNodeByIdAsync(elementInfo.vectorCopyId);
                        if (savedVector && savedVector.type === 'VECTOR') {
                            newElement = savedVector.clone();
                            console.log('✅ Vector real clonado desde copia guardada: ' + elementInfo.nodeName);
                        } else {
                            console.log('⚠️ Vector guardado no encontrado o tipo incorrecto, usando fallback');
                            newElement = figma.createRectangle();
                        }
                    } catch (e) {
                        console.log('⚠️ Error clonando vector guardado, usando fallback: ' + e.message);
                        newElement = figma.createRectangle();
                    }
                } else {
                    newElement = figma.createRectangle(); // Fallback
                    console.log('⚠️ Vector convertido a Rectangle para compatibilidad');
                }
                break;
            case 'BOOLEAN_OPERATION':
                // Intentar usar la operación booleana duplicada si está disponible
                if (elementInfo.vectorCopyAvailable && elementInfo.vectorCopyId) {
                    try {
                        // Buscar la operación booleana duplicada por ID usando método asíncrono
                        var savedOperation = yield figma.getNodeByIdAsync(elementInfo.vectorCopyId);
                        if (savedOperation && savedOperation.type === 'BOOLEAN_OPERATION') {
                            newElement = savedOperation.clone();
                            console.log('✅ Boolean Operation real clonada desde copia guardada: ' + elementInfo.nodeName);
                        } else {
                            console.log('⚠️ Boolean Operation guardada no encontrada o tipo incorrecto, usando fallback');
                            newElement = figma.createRectangle();
                        }
                    } catch (e) {
                        console.log('⚠️ Error clonando Boolean Operation guardada, usando fallback: ' + e.message);
                        newElement = figma.createRectangle();
                    }
                } else {
                    newElement = figma.createRectangle(); // Fallback
                    console.log('⚠️ Boolean Operation convertida a Rectangle para compatibilidad');
                }
                break;
            case 'LINE':
                newElement = figma.createLine();
                break;
            case 'TEXT':
                newElement = figma.createText();
                // Cargar fuente por defecto
                try {
                    yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
                    newElement.characters = elementInfo.nodeName || 'Texto';
                } catch (e) {
                    console.log('No se pudo cargar fuente Inter, usando fuente por defecto');
                }
                break;
            case 'FRAME':
                newElement = figma.createFrame();
                break;
            case 'GROUP':
                newElement = figma.group([], parent); // Crear grupo vacío
                break;
            case 'COMPONENT':
            case 'INSTANCE':
                newElement = figma.createFrame(); // Los componentes/instancias se convierten en frames
                break;
            default:
                newElement = figma.createRectangle(); // Respaldo por defecto
                console.log(`⚠️ Tipo de elemento no reconocido: ${elementInfo.nodeType}, usando Rectangle`);
                break;
        }
        
        // Configurar nombre si no se configuró arriba
        if (!newElement.name || newElement.name === 'Rectangle') {
            newElement.name = elementInfo.nodeName || (elementInfo.nodeType + ' clonado');
        }
        
        // Configurar tamaño básico si está disponible
        if (elementInfo.width && elementInfo.height && 'resize' in newElement) {
            try {
                newElement.resize(elementInfo.width, elementInfo.height);
            } catch (e) {
                // Si falla, usar tamaño por defecto para elementos creados
                if ('resize' in newElement && !elementInfo.vectorCopyAvailable) {
                    newElement.resize(100, 100);
                }
            }
        }
        
        // Agregar al padre
        if (parent && 'appendChild' in parent) {
            parent.appendChild(newElement);
        }
        
        console.log(`🏗️ Elemento creado: ${newElement.name} (${newElement.type})`);
        return newElement;
    });
}

function cloneStructure(targetNode, sourceStructure, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options.cloneStructure || !sourceStructure.children) {
            return; // No hacer nada si no está activada la clonación
        }
        
        console.log('🏗️ Iniciando clonación de estructura...');
        console.log('Estructura origen: ' + Object.keys(sourceStructure.children).length + ' elementos');
        console.log('Nodo destino: ' + (targetNode.children ? targetNode.children.length : 0) + ' elementos');
        
        // Obtener información de orden original
        var childrenOrder = sourceStructure.childrenOrder || [];
        console.log('🔢 Orden objetivo:', childrenOrder.map(function(item) { return item.name + ' (' + item.type + ')'; }).join(' → '));
        
        // Obtener tipos de elementos que ya existen en el target
        var existingTypes = [];
        var existingNames = [];
        if (targetNode.children) {
            for (var i = 0; i < targetNode.children.length; i++) {
                var childType = targetNode.children[i].type;
                var childName = targetNode.children[i].name;
                if (existingTypes.indexOf(childType) === -1) {
                    existingTypes.push(childType);
                }
                existingNames.push(childName);
            }
        }
        
        console.log('🏗️ Tipos existentes en target: ' + existingTypes.join(', '));
        console.log('🏗️ Nombres existentes en target: ' + existingNames.join(', '));
        
        // Crear elementos en orden específico
        var elementsToCreate = [];
        var isAutoLayout = targetNode.layoutMode && targetNode.layoutMode !== 'NONE';
        
        console.log('🔧 Target es AutoLayout: ' + (isAutoLayout ? 'Sí' : 'No'));
        
        // Procesar elementos en orden original
        for (var j = 0; j < childrenOrder.length; j++) {
            var orderInfo = childrenOrder[j];
            var elementInfo = sourceStructure.children[orderInfo.name];
            
            if (!elementInfo) continue;
            
            // Verificar si ya existe este tipo
            var typeExists = existingTypes.indexOf(elementInfo.nodeType) !== -1;
            var nameExists = existingNames.indexOf(orderInfo.name) !== -1;
            
            if (!typeExists && !nameExists) {
                elementsToCreate.push({
                    info: elementInfo,
                    targetIndex: j,
                    name: orderInfo.name
                });
                console.log('📝 Planificado para crear: ' + orderInfo.name + ' (' + elementInfo.nodeType + ') en posición ' + j);
            } else {
                console.log('🏗️ ⚠️ Saltando ' + orderInfo.name + ' (' + elementInfo.nodeType + ') - tipo o nombre ya existe');
            }
        }
        
        console.log('🔍 Elementos a crear: ' + elementsToCreate.length + ' elementos');
        
        // Crear elementos en orden
        for (var k = 0; k < elementsToCreate.length; k++) {
            var elementToCreate = elementsToCreate[k];
            var elementInfo = elementToCreate.info;
            var targetIndex = elementToCreate.targetIndex;
            
            console.log('🏗️ Creando: ' + elementToCreate.name + ' (' + elementInfo.nodeType + ') en posición ' + targetIndex);
            
            try {
                var newElement = yield createElementFromStructure(elementInfo, targetNode);
                
                // Si es AutoLayout, intentar insertar en la posición correcta
                if (isAutoLayout && 'insertChild' in targetNode) {
                    try {
                        // Calcular la posición de inserción considerando elementos existentes
                        var insertIndex = Math.min(targetIndex, targetNode.children.length);
                        
                        // Remover del final y insertar en la posición correcta
                        var childIndex = targetNode.children.indexOf(newElement);
                        if (childIndex !== -1 && childIndex !== insertIndex) {
                            targetNode.insertChild(insertIndex, newElement);
                            console.log('📍 Elemento reposicionado en índice ' + insertIndex + ' dentro del AutoLayout');
                        }
                    } catch (insertError) {
                        console.log('⚠️ No se pudo reposicionar en AutoLayout: ' + insertError.message);
                    }
                }
                
                // Aplicar estilos inmediatamente al elemento recién creado
                yield deepApplyStyles(newElement, elementInfo);
                
                console.log('✅ Elemento creado y estilizado: ' + newElement.name);
            } catch (e) {
                console.log('❌ Error creando elemento ' + elementToCreate.name + ': ' + e.message);
            }
        }
        
        console.log('🏗️ Clonación de estructura completada');
        
        // Log final del orden actual
        if (targetNode.children) {
            var finalOrder = [];
            for (var m = 0; m < targetNode.children.length; m++) {
                finalOrder.push(targetNode.children[m].name + ' (' + targetNode.children[m].type + ')');
            }
            console.log('🔢 Orden final: ' + finalOrder.join(' → '));
        }
    });
}

function applyProperty(targetNode, prop, value) {
    if (prop in targetNode) {
        try {
            targetNode[prop] = value;
        } catch (e) {
            // Si falla aplicar un Style ID, intentar con las propiedades individuales
            console.log(`No se pudo aplicar ${prop} con valor:`, value, 'Error:', e.message);
        }
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
        delete styleProps.isInstance;
        delete styleProps.nodeName;
        delete styleProps.cloneStructure;

        console.log(`🎯 Aplicando estilos a: ${targetNode.name} (${targetNode.type})`);
        console.log('📋 Estilos recibidos:', {
            fillStyleId: styleProps.fillStyleId,
            strokeStyleId: styleProps.strokeStyleId,
            effectStyleId: styleProps.effectStyleId,
            textStyleId: styleProps.textStyleId,
            hasFills: !!styleProps.fills,
            hasStrokes: !!styleProps.strokes,
            hasEffects: !!styleProps.effects
        });

        // PRIORIDAD 1: Aplicar Style IDs de Design System primero (MÉTODO ASÍNCRONO)
        if (styleProps.fillStyleId) {
            console.log(`🎨 Aplicando fillStyleId: ${styleProps.fillStyleId}`);
            try {
                // Usar método asíncrono para estilos externos
                yield targetNode.setFillStyleIdAsync(styleProps.fillStyleId);
                console.log('✅ FillStyleId aplicado exitosamente con setFillStyleIdAsync');
                
                // Verificar si se aplicó correctamente
                if (targetNode.fillStyleId === styleProps.fillStyleId) {
                    console.log('✅ FillStyleId confirmado en el nodo destino');
                } else {
                    console.log('⚠️ FillStyleId no coincide después de aplicar');
                }
            } catch (e) {
                console.log('❌ Error aplicando fillStyleId con método asíncrono:', e.message);
                // Intentar método síncrono como respaldo
                try {
                    targetNode.fillStyleId = styleProps.fillStyleId;
                    console.log('⚠️ Aplicado con método síncrono como respaldo');
                } catch (syncError) {
                    console.log('❌ Error también con método síncrono:', syncError.message);
                }
            }
        }
        if (styleProps.strokeStyleId) {
            console.log(`🎨 Aplicando strokeStyleId: ${styleProps.strokeStyleId}`);
            try {
                yield targetNode.setStrokeStyleIdAsync(styleProps.strokeStyleId);
                console.log('✅ StrokeStyleId aplicado exitosamente con setStrokeStyleIdAsync');
            } catch (e) {
                console.log('❌ Error aplicando strokeStyleId con método asíncrono:', e.message);
                try {
                    targetNode.strokeStyleId = styleProps.strokeStyleId;
                    console.log('⚠️ StrokeStyleId aplicado con método síncrono como respaldo');
                } catch (syncError) {
                    console.log('❌ Error también con método síncrono:', syncError.message);
                }
            }
        }
        if (styleProps.effectStyleId) {
            console.log(`🎨 Aplicando effectStyleId: ${styleProps.effectStyleId}`);
            try {
                yield targetNode.setEffectStyleIdAsync(styleProps.effectStyleId);
                console.log('✅ EffectStyleId aplicado exitosamente con setEffectStyleIdAsync');
            } catch (e) {
                console.log('❌ Error aplicando effectStyleId con método asíncrono:', e.message);
                try {
                    targetNode.effectStyleId = styleProps.effectStyleId;
                    console.log('⚠️ EffectStyleId aplicado con método síncrono como respaldo');
                } catch (syncError) {
                    console.log('❌ Error también con método síncrono:', syncError.message);
                }
            }
        }
        if (targetNode.type === 'TEXT' && styleProps.textStyleId) {
            console.log(`🎨 Aplicando textStyleId: ${styleProps.textStyleId}`);
            try {
                yield targetNode.setTextStyleIdAsync(styleProps.textStyleId);
                console.log('✅ TextStyleId aplicado exitosamente con setTextStyleIdAsync');
            } catch (e) {
                console.log('❌ Error aplicando textStyleId con método asíncrono:', e.message);
                try {
                    targetNode.textStyleId = styleProps.textStyleId;
                    console.log('⚠️ TextStyleId aplicado con método síncrono como respaldo');
                } catch (syncError) {
                    console.log('❌ Error también con método síncrono:', syncError.message);
                }
            }
        }

        // PRIORIDAD 2: Aplicar propiedades individuales solo si NO hay Style IDs
        // Fill (rellenos y colores)
        if ((!styleProps.fillStyleId || styleProps.fillStyleId === '') && 'fills' in styleProps) {
            applyProperty(targetNode, 'fills', styleProps.fills);
        }
        
        // Stroke (bordes y trazos) - aplicar propiedades individuales
        if ((!styleProps.strokeStyleId || styleProps.strokeStyleId === '') && 'strokes' in styleProps) {
            applyProperty(targetNode, 'strokes', styleProps.strokes);
        }
        if ('strokeWeight' in styleProps) applyProperty(targetNode, 'strokeWeight', styleProps.strokeWeight);
        if ('strokeAlign' in styleProps) applyProperty(targetNode, 'strokeAlign', styleProps.strokeAlign);
        
        // Effects (sombras y efectos)
        if ((!styleProps.effectStyleId || styleProps.effectStyleId === '') && 'effects' in styleProps) {
            applyProperty(targetNode, 'effects', styleProps.effects);
        }
        
        // Opacity & Blending (transparencia)
        if ('opacity' in styleProps) applyProperty(targetNode, 'opacity', styleProps.opacity);
        
        // Corner Radius (bordes redondeados)
        if ('topLeftRadius' in styleProps) applyProperty(targetNode, 'topLeftRadius', styleProps.topLeftRadius);
        if ('topRightRadius' in styleProps) applyProperty(targetNode, 'topRightRadius', styleProps.topRightRadius);
        if ('bottomLeftRadius' in styleProps) applyProperty(targetNode, 'bottomLeftRadius', styleProps.bottomLeftRadius);
        if ('bottomRightRadius' in styleProps) applyProperty(targetNode, 'bottomRightRadius', styleProps.bottomRightRadius);

        var containerLayoutProps = ['layoutMode', 'itemSpacing', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'primaryAxisAlignItems', 'counterAxisAlignItems'];
        for (var i = 0; i < containerLayoutProps.length; i++) {
            var prop = containerLayoutProps[i];
            if (prop in styleProps) applyProperty(targetNode, prop, styleProps[prop]);
        }
        
        var childLayoutProps = ['layoutAlign', 'layoutGrow', 'layoutSizingHorizontal', 'layoutSizingVertical'];
        for (var j = 0; j < childLayoutProps.length; j++) {
            var prop = childLayoutProps[j];
            if (prop in styleProps) applyProperty(targetNode, prop, styleProps[prop]);
        }

        if (targetNode.type === 'TEXT') {
            // Si hay textStyleId, aplicarlo tiene prioridad sobre propiedades individuales
            if (styleProps.textStyleId && styleProps.textStyleId !== '') {
                // Ya se aplicó arriba, pero aplicamos propiedades individuales solo si no hay Style ID
                var textProps = ['fontName', 'fontSize', 'letterSpacing', 'lineHeight', 'textAlignHorizontal', 'textAlignVertical', 'textCase', 'textDecoration'];
                for (var k = 0; k < textProps.length; k++) {
                    var prop = textProps[k];
                    if (prop in styleProps) {
                        if (prop === 'fontName' && styleProps.fontName !== figma.mixed) {
                            try {
                                yield figma.loadFontAsync(styleProps.fontName);
                            } catch (e) {
                                console.log('No se pudo cargar fuente:', styleProps.fontName);
                            }
                        }
                        // Solo aplicar si es una propiedad específica que queremos mantener junto con el style
                        if (['textAlignHorizontal', 'textAlignVertical'].indexOf(prop) !== -1) {
                            applyProperty(targetNode, prop, styleProps[prop]);
                        }
                    }
                }
            } else {
                // No hay textStyleId, aplicar todas las propiedades individuales
                var textProps = ['fontName', 'fontSize', 'letterSpacing', 'lineHeight', 'textAlignHorizontal', 'textAlignVertical', 'textCase', 'textDecoration'];
                for (var m = 0; m < textProps.length; m++) {
                    var prop = textProps[m];
                    if (prop in styleProps) {
                        if (prop === 'fontName' && styleProps.fontName !== figma.mixed) {
                            try {
                                yield figma.loadFontAsync(styleProps.fontName);
                            } catch (e) {
                                console.log('No se pudo cargar fuente:', styleProps.fontName);
                            }
                        }
                        applyProperty(targetNode, prop, styleProps[prop]);
                    }
                }
            }
        }

        if (width !== undefined && height !== undefined && 'resize' in targetNode) {
            try {
                targetNode.resize(width, height);
            } catch (e) {}
        }

        // ---- CLONACIÓN DE ESTRUCTURA (NUEVA FUNCIONALIDAD) ----
        // Clonar elementos faltantes ANTES de aplicar estilos a los hijos
        if (children && styles.cloneStructure) {
            yield cloneStructure(targetNode, styles, { cloneStructure: styles.cloneStructure });
        }

        // ---- MEJORADO PARA COMPONENTES ----
        if (children && targetNode.children && targetNode.children.length > 0) {
            const sourceChildrenNames = Object.keys(children);
            console.log(`Aplicando estilos a ${targetNode.children.length} hijos`);
            
            // Regla especial: si solo hay un hijo en el origen y uno en el destino, aplicamos los estilos sin importar el nombre.
            if (sourceChildrenNames.length === 1 && targetNode.children.length === 1) {
                const childNode = targetNode.children[0];
                const childStyles = children[sourceChildrenNames[0]];
                console.log(`Aplicando estilo único de hijo: ${sourceChildrenNames[0]} → ${childNode.name}`);
                yield deepApplyStyles(childNode, childStyles);
            } else {
                // Lógica mejorada: hacer coincidir por nombre y por posición si es necesario
                for (let i = 0; i < targetNode.children.length; i++) {
                    const childNode = targetNode.children[i];
                    
                    // Intentar por nombre primero
                    if (children[childNode.name]) {
                        console.log(`Aplicando estilo por nombre: ${childNode.name}`);
                        yield deepApplyStyles(childNode, children[childNode.name]);
                    } 
                    // Si no encuentra por nombre, intentar por posición
                    else if (sourceChildrenNames[i] && children[sourceChildrenNames[i]]) {
                        console.log(`Aplicando estilo por posición ${i}: ${sourceChildrenNames[i]} → ${childNode.name}`);
                        yield deepApplyStyles(childNode, children[sourceChildrenNames[i]]);
                    }
                }
            }
        }
        // ---- FIN DE LA MEJORA ----
    });
}


const quickPasteHandler = () => __awaiter(_this, void 0, void 0, function* () {
    if (!isQuickPasteActive || !copiedProperties) return;
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
        for (var i = 0; i < selection.length; i++) {
            var originalNode = selection[i];
            var targetNode = originalNode;
            var needsWrapping = copiedProperties.autoWrap && copiedProperties.layoutMode && (targetNode.layoutMode === 'NONE' || !targetNode.layoutMode);
            if (needsWrapping) {
                var frame = figma.createFrame();
                var parent = targetNode.parent;
                if (parent) {
                    var index = parent.children.indexOf(originalNode);
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
                    figma.clientStorage.getAsync('theme'), figma.clientStorage.getAsync('fill'),
                    figma.clientStorage.getAsync('stroke'), figma.clientStorage.getAsync('effects'),
                    figma.clientStorage.getAsync('opacity'), figma.clientStorage.getAsync('radius'),
                    figma.clientStorage.getAsync('layout'), figma.clientStorage.getAsync('size'),
                    figma.clientStorage.getAsync('text'), figma.clientStorage.getAsync('autoWrap'), 
                    figma.clientStorage.getAsync('cloneStructure'), figma.clientStorage.getAsync('language')
                ]);
                figma.ui.postMessage({ type: 'preferencesLoaded', preferences: { theme: prefs[0], fill: prefs[1], stroke: prefs[2], effects: prefs[3], opacity: prefs[4], radius: prefs[5], layout: prefs[6], size: prefs[7], text: prefs[8], autoWrap: prefs[9], cloneStructure: prefs[10], language: prefs[11] } });
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
            
            // Limpiar vectores temporales de la copia anterior
            yield cleanupTemporaryVectors();
            
            const node = selection[0];
            console.log(`Copiando estilos de: ${node.name} (${node.type})`);
            
            const options = {
                copyFill: msg.copyFill,
                copyStroke: msg.copyStroke,
                copyEffects: msg.copyEffects,
                copyOpacity: msg.copyOpacity,
                copyRadius: msg.copyRadius,
                copyLayout: msg.copyLayout,
                copySize: msg.copySize,
                copyText: msg.copyText,
                cloneStructure: msg.cloneStructure,
            };
            copiedProperties = yield deepCopyStyles(node, options);
            copiedProperties.autoWrap = msg.autoWrap;
            
            // Detectar si se copiaron estilos del Design System
            let designSystemStyles = [];
            let styleNames = [];
            
            if (copiedProperties.fillStyleId) {
                designSystemStyles.push('Color');
                try {
                    const fillStyle = figma.getStyleById(copiedProperties.fillStyleId);
                    if (fillStyle) styleNames.push(fillStyle.name);
                } catch (e) {}
            }
            if (copiedProperties.strokeStyleId) {
                designSystemStyles.push('Stroke');
                try {
                    const strokeStyle = figma.getStyleById(copiedProperties.strokeStyleId);
                    if (strokeStyle) styleNames.push(strokeStyle.name);
                } catch (e) {}
            }
            if (copiedProperties.effectStyleId) {
                designSystemStyles.push('Effect');
                try {
                    const effectStyle = figma.getStyleById(copiedProperties.effectStyleId);
                    if (effectStyle) styleNames.push(effectStyle.name);
                } catch (e) {}
            }
            if (copiedProperties.textStyleId) {
                designSystemStyles.push('Text');
                try {
                    const textStyle = figma.getStyleById(copiedProperties.textStyleId);
                    if (textStyle) styleNames.push(textStyle.name);
                } catch (e) {}
            }
            
            // Detectar tipo de componente
            let componentInfo = '';
            if (node.type === 'INSTANCE') {
                componentInfo = ' (Instancia de componente)';
            } else if (node.type === 'COMPONENT') {
                componentInfo = ' (Componente maestro)';
            }
            
            if (designSystemStyles.length > 0) {
                let message = `Estilos copiados! ✅ Incluye: ${designSystemStyles.join(', ')} Styles`;
                if (styleNames.length > 0) {
                    message += ` (${styleNames.join(', ')})`;
                }
                message += componentInfo;
                figma.notify(message);
            } else {
                figma.notify(`Estilos profundos copiados! ✅${componentInfo}`);
            }
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
            for (var j = 0; j < selection.length; j++) {
                var originalNode = selection[j];
                var targetNode = originalNode;
                var needsWrapping = copiedProperties.autoWrap && copiedProperties.layoutMode && (targetNode.layoutMode === 'NONE' || !targetNode.layoutMode);
                if (needsWrapping) {
                    var frame = figma.createFrame();
                    var parent = targetNode.parent;
                    if (parent) {
                        var index = parent.children.indexOf(originalNode);
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