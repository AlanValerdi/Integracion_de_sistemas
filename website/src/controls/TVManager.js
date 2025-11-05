import * as THREE from 'three';
import { scene } from '../core/scene.js'; // Importamos la escena global

// --- Variables "Privadas" del Módulo ---
let tvPantallaObjeto = null;
let materialApagado = null;
let materialCanales = []; // Un array para guardar los 3 canales
let tvLuz = { light: null }; // Luz que emite la TV
let tvLuzTarget = { target: null };

let isEncendido = false;
let canalActual = 0;

// --- Funciones Privadas ---

/**
 * Crea la luz SpotLight que simula el brillo de la TV en la habitación.
 */
function crearLuzTV() {
    // Usamos una SpotLight rectangular para simular una TV
    tvLuz.light = new THREE.SpotLight(0xffffff, 0, 40, Math.PI / 4, 0.5, 1);
    
    // Posicionar la luz justo enfrente de la pantalla
    const posicionPantalla = new THREE.Vector3();
    tvPantallaObjeto.getWorldPosition(posicionPantalla); // Obtiene la posición mundial
    
    // Coloca la luz un poco delante de la pantalla
    tvLuz.light.position.set(posicionPantalla.x, posicionPantalla.y, posicionPantalla.z + 0.5); 
    
    // --- Apuntar la Luz ---
    // Hacemos que la luz apunte hacia el sofá (ajusta la 'x' o 'z' si es necesario)
    tvLuzTarget.target = new THREE.Object3D();
    tvLuzTarget.target.position.set(posicionPantalla.x, posicionPantalla.y, 0); // Apunta al centro
    
    scene.add(tvLuzTarget.target);
    tvLuz.light.target = tvLuzTarget.target;
    
    // La luz de la TV también proyecta sombras (¡efecto genial!)
    tvLuz.light.castShadow = true;
}

/**
 * Carga las texturas y crea los 3 materiales para los canales.
 */
function prepararMaterialesCanales() {
    const textureLoader = new THREE.TextureLoader();
    
    const rutasCanales = [
        '/textures/canal_1.jpg', // Asegúrate que la ruta sea correcta
        '/textures/canal_2.jpg',
        '/textures/canal_3.jpg'
    ];

    rutasCanales.forEach(ruta => {
        const texturaTV = textureLoader.load(ruta);
        
        // El material "encendido" usa 'map' (la imagen) y 'emissiveMap' (para que brille)
        const material = new THREE.MeshStandardMaterial({
            map: texturaTV,
            emissive: new THREE.Color(0xffffff), // Color base del brillo
            emissiveMap: texturaTV,             // La textura también define dónde brilla
            emissiveIntensity: 1.0              // Intensidad del brillo
        });
        materialCanales.push(material);
    });
}

// --- Funciones Públicas (Exportadas) ---

/**
 * Función de inicialización. Busca la TV en el modelo y prepara los materiales.
 */
export function setupTV(model) {
    // 1. Cargar las 3 texturas y crear los 3 materiales
    prepararMaterialesCanales();

    // 2. Buscar la pantalla de la TV en el modelo
    model.traverse((child) => {
        if (child.isMesh && child.name === "TV_Pantalla") {
            console.log("TV_Pantalla encontrada!");
            tvPantallaObjeto = child;
            
            // 3. Guardar el material original (apagado)
            // Hacemos una copia para evitar sobrescribir el original
            materialApagado = child.material.clone();
            materialApagado.emissive = new THREE.Color(0x000000); // Asegurarnos que esté negro
            
            // 4. Crear la luz SpotLight para la TV
            crearLuzTV();
        }
    });
}

/**
 * Enciende la TV.
 */
export function encenderTV() {
    if (tvPantallaObjeto && !isEncendido) {
        console.log("Encendiendo TV, canal:", canalActual + 1);
        isEncendido = true;
        
        // Aplicar el material del canal actual
        tvPantallaObjeto.material = materialCanales[canalActual];
        
        // Encender la luz de la habitación
        tvLuz.light.intensity = 120; // Ajusta esta intensidad
        if (!tvLuz.light.parent) {
            scene.add(tvLuz.light);
        }
    }
}

/**
 * Apaga la TV.
 */
export function apagarTV() {
    if (tvPantallaObjeto && isEncendido) {
        console.log("Apagando TV");
        isEncendido = false;
        
        // Aplicar el material de apagado
        tvPantallaObjeto.material = materialApagado;
        
        // Apagar la luz de la habitación
        tvLuz.light.intensity = 0;
    }
}

/**
 * Cambia al siguiente canal, encendiendo la TV si estaba apagada.
 */
export function cambiarCanal() {
    if (!tvPantallaObjeto) return; // No hacer nada si la TV no se ha encontrado

    if (!isEncendido) {
        // Si la TV está apagada, "cambiar canal" la enciende
        encenderTV();
    } else {
        // Si ya está encendida, cicla al siguiente canal
        canalActual = (canalActual + 1) % materialCanales.length; // Cicla 0 -> 1 -> 2 -> 0
        tvPantallaObjeto.material = materialCanales[canalActual];
        console.log("Cambiando a canal:", canalActual + 1);
    }
}