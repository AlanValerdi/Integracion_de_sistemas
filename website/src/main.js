import './style.css';
// Importa el setup de la escena
import { setupScene, scene, camera, renderer } from './core/scene.js';
// Importa el cargador de modelos
import { loadModel } from './core/loader.js';
// Importa módulo de luces
import { setupLights, encenderLuzA, apagarLuzA, encenderLuzB, apagarLuzB } from './controls/LightManager.js';
// Importa modulo de movimiento
import { setupMovement } from './controls/movement.js'; 
import { encenderTV, apagarTV, cambiarCanal, setupTV } from './controls/TVManager.js';
import { setUpWebScoket } from './core/webSocketManager.js';

// ---  definicion Init ---
async function init() {
    // setear escena
    setupScene();

    // Carga el modelo 
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

        // Inicializa los módulos de control
        setupLights(gltf.scene, scene);
        // setupTV(gltf.scene, scene);
        setupMovement(camera, renderer.domElement, collidables);
        setupTV(gltf.scene);
        setUpWebScoket();

        console.log("Aplicación 3D inicializada.");

    } catch (error) {
        console.error("No se pudo inicializar la aplicación:", error);
    }
}

// --- Init ---
init();

// --- func para consola ---
// Control de luces
window.encenderLuzA = encenderLuzA;
window.apagarLuzA = apagarLuzA;
window.encenderLuzB = encenderLuzB;
window.apagarLuzB = apagarLuzB;

// Control de TV
window.encenderTV = encenderTV;
window.apagarTV = apagarTV;
window.cambiarCanal = cambiarCanal;

