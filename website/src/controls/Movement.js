import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let controls;
let camera;
let collidableObjects = []; // Aquí guardaremos las paredes

// Estado del teclado
const keyStates = {
    'KeyW': false,
    'KeyS': false,
    'KeyA': false,
    'KeyD': false,
    'Space': false
};

// Vectores para el movimiento
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

/**
 * Inicializa los controles de movimiento en primera persona.
 */
export function setupMovement(cam, domElement, collidables) {
    camera = cam;
    collidableObjects = collidables; // Guardamos las paredes

    // 1. Inicializar PointerLockControls (control de la cámara con el mouse)
    controls = new PointerLockControls(camera, domElement);

    // 2. Añadir un "Click Listener" para activar los controles
    // El usuario debe hacer clic en la pantalla para bloquear el mouse
    domElement.addEventListener('click', () => {
        controls.lock();
    });

    // 3. Escuchar eventos del teclado
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

/**
 * Actualiza el estado de las teclas presionadas
 */
function onKeyDown(event) {
    if (event.code in keyStates) {
        keyStates[event.code] = true;
    }
}

function onKeyUp(event) {
    if (event.code in keyStates) {
        keyStates[event.code] = false;
    }
}

/**
 * Esta función se llama en cada frame desde el bucle de animación.
 * Mueve la cámara basándose en el estado del teclado y el delta time.
 */
export function updateMovement(delta) {
    // Si los controles no están inicializados o no están bloqueados, no hacer nada
    if (!controls || !controls.isLocked) {
        return;
    }

    const moveSpeed = 1.5; // Velocidad de movimiento (ajusta a tu gusto)

    // --- Aplicar "fricción" ---
    // Esto hace que el movimiento se detenga suavemente
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    // velocity.y -= 9.8 * 10.0 * delta; // (Gravedad - la añadiremos después si quieres)

    // --- Calcular dirección ---
    direction.z = Number(keyStates['KeyW']) - Number(keyStates['KeyS']);
    direction.x = Number(keyStates['KeyA']) - Number(keyStates['KeyD']);
    direction.normalize(); // Asegura velocidad constante en diagonal

    // --- Aplicar velocidad según las teclas ---
    if (keyStates['KeyW'] || keyStates['KeyS']) {
        velocity.z -= direction.z * moveSpeed * delta;
    }
    if (keyStates['KeyA'] || keyStates['KeyD']) {
        velocity.x -= direction.x * moveSpeed * delta;
    }

    // --- Fase 2 (Colisiones) - Lo implementaremos aquí ---
    // Por ahora, nos movemos libremente

    // --- Aplicar movimiento a la cámara ---
    // moveRight y moveForward mueven la cámara Relativo a donde está mirando
    controls.moveRight(velocity.x); // (Positivo porque A es izquierda, D es derecha)
    controls.moveForward(-velocity.z); // (Negativo porque W es adelante, S es atrás)
}