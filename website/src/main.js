import './style.css';
// Importa el setup de la escena
import { setupScene, scene, camera, renderer } from './core/scene.js';
// Importa el cargador de modelos
import { loadModel } from './core/loader.js';
// Importa módulo de luces
import { setupLights, encenderLuzA, apagarLuzA, encenderLuzB, apagarLuzB } from './controls/LightManager.js';
// Importa modulo de movimiento
import { setupMovement } from './controls/movement.js'; 

// --- 1. Inicialización Asíncrona ---
async function init() {
    // 1. Configura la escena, cámara, renderer y loop de animación
    setupScene();

    // 2. Carga el modelo (espera a que termine)
    try {
        const gltf = await loadModel('/models/casa.glb');
        scene.add(gltf.scene); // Añade el modelo a la escena

        // Obtener structure model (Paredes)
        const collidables = [];
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.name === "Structure") {
                collidables.push(child);
            }
        });

        // 3. Inicializa los módulos de control (luces, TV, etc.)
        setupLights(gltf.scene, scene);
        // setupTV(gltf.scene, scene);
        setupMovement(camera, renderer.domElement, collidables);

        console.log("Aplicación 3D inicializada.");

    } catch (error) {
        console.error("No se pudo inicializar la aplicación:", error);
    }
}

// --- 2. Iniciar la Aplicación ---
init();

// --- 3. Exponer controles a la consola para pruebas ---
// (Esto es opcional, pero útil para ti)
window.encenderLuzA = encenderLuzA;
window.apagarLuzA = apagarLuzA;
window.encenderLuzB = encenderLuzB;
window.apagarLuzB = apagarLuzB;
// ...etc.