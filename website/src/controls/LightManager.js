import * as THREE from 'three';
import { scene } from '../core/scene.js';

// 1. Variables "privadas" del módulo. Nadie más necesita verlas.
let LuzLampA, materialApagadoA, materialEncendidoA, luzRealA, luzTargetA;
let luzLampB, materialApagadoB, materialEncendidoB, luzRealB, luzTargetB;

// 2. Función privada (no se exporta)
function crearLuzReal(luzMesh, luzRealRef, luzTargetRef, scene) {
    luzRealRef.light = new THREE.SpotLight(0xffffee, 0, 50, Math.PI / 3, 0.4, 1);
    
    const posicionBase = luzMesh.position;
    luzRealRef.light.position.set(posicionBase.x, posicionBase.y + 7.5, posicionBase.z);
    
    luzRealRef.light.castShadow = true; 
    luzRealRef.light.shadow.mapSize.width = 1024;
    luzRealRef.light.shadow.mapSize.height = 1024;
    
    luzTargetRef.target = new THREE.Object3D();
    luzTargetRef.target.position.set(posicionBase.x + 3, 0, posicionBase.z);
    
    luzRealRef.light.target = luzTargetRef.target;
    scene.add(luzTargetRef.target);

    // const lightHelper = new THREE.SpotLightHelper(luzRealRef.light);
    // scene.add(lightHelper);
}

// 3. Función de inicialización (exportada)
// Esta función buscará las luces en el modelo cargado.
export function setupLights(model, scene) {
    // Inicializar las variables de referencia
    luzRealA = { light: null };
    luzRealB = { light: null };
    luzTargetA = { target: null };
    luzTargetB = { target: null };

    model.traverse((child) => {
        if (child.isMesh && child.name === "LampA_Luz") {
            LuzLampA = child;
            materialApagadoA = child.material;
            materialEncendidoA = child.material.clone();
            materialEncendidoA.emissive = new THREE.Color(0xffffaa);
            materialEncendidoA.emissiveIntensity = 2;
            crearLuzReal(LuzLampA, luzRealA, luzTargetA, scene); 
        }

        if (child.isMesh && child.name === "LampB_Luz") {
            luzLampB = child;
            materialApagadoB = child.material;
            materialEncendidoB = child.material.clone();
            materialEncendidoB.emissive = new THREE.Color(0xffffaa);
            materialEncendidoB.emissiveIntensity = 2;
            crearLuzReal(luzLampB, luzRealB, luzTargetB, scene);
        }
    });
}

// 4. Funciones de control (exportadas)
export function encenderLuzA() {
  if (LuzLampA && materialEncendidoA && luzRealA.light) { 
    LuzLampA.material = materialEncendidoA;
    luzRealA.light.intensity = 100;
    if (!luzRealA.light.parent) {
      scene.add(luzRealA.light);
    }
    console.log("Encendiendo Luz Izquierda");
  }
}

export function apagarLuzA() {
  if (LuzLampA && materialApagadoA && luzRealA.light) { 
    LuzLampA.material = materialApagadoA;
    luzRealA.light.intensity = 0;
    if(luzRealA.light.parent) {
      scene.remove(luzRealA.light);
    }
  }
}

// --- FUNCIONES DE CONTROL LUZ B (Derecha) ---
export function encenderLuzB() { 
  // Comprueba la propiedad .light
  if (luzLampB && materialEncendidoB && luzRealB.light) { 
    luzLampB.material = materialEncendidoB;
    luzRealB.light.intensity = 100; // Usa .light
    if (!luzRealB.light.parent) {
      scene.add(luzRealB.light); // Añade .light
    }
    console.log("Encendiendo Luz Derecha");
  }
}

export function apagarLuzB() {
  if (luzLampB && materialApagadoB && luzRealB) {
    console.log("Apagando la luz de la sala");
    luzLampB.material = materialApagadoB;
    luzRealB.light.intensity = 0; // Usa .light

    if(luzRealB.light.parent) {
      scene.remove(luzRealB.light);
    }  
  }
}

// ... (funciones para Luz B) ...