import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { updateMovement } from '../controls/movement';

// --- Componentes Centrales ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// --- Variables "Privadas" del Módulo ---
// let controls; // 
const clock = new THREE.Clock();

// --- Función de Inicialización ---
export function setupScene() {
    // 1. Configurar Escena
    scene.background = new THREE.Color(0x303030); // Fondo oscuro

    // 2. Configurar Cámara
    camera.position.set(5, 5, 10); // Posición inicial

    // 3. Configurar Renderizador
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // // 4. Configurar Controles de Órbita
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true; // Suavizado

    // 5. Luz Ambiental Base (muy oscura)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Aumenté un poco de 0 para que no sea negro total
    scene.add(ambientLight);

    // 6. Iniciar el Bucle de Animación
    animate();
}

// --- Bucle de Animación ---
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    // Actualizar controles (órbita y futuros controles WASD)
    // controls.update();

    updateMovement(delta);
    
    // Renderizar la escena
    renderer.render(scene, camera);
}

// --- Exportaciones ---
// Exportamos los componentes para que otros módulos (como LightManager) puedan usarlos
export { scene, camera, renderer };