import './style.css'
// model loader
import * as Three from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// --MARK: Escena y renderizador

const scene = new Three.Scene();

// Color del fondo gris claro
scene.background = new Three.Color(0x303030)

// instanciar render
const renderer = new Three.WebGLRenderer({ antialias: true });

// para performance poner atributos/2 y updateStyle=false
renderer.setSize(window.innerWidth, window.innerHeight);

// Agregar el render al DOM/html
document.body.appendChild(renderer.domElement);

// -- Fin Escena y renderizador


// ----MARK: Camara

const camera = new Three.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 1000);
// Posicion inicial de la camara, ajustar
camera.position.set(5,5,10);

// --Fin Camara


// ----MARK: Controles de Orbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Suavizado

// --Fin Controles de Orbita


// --MARK: Luz deficniciones
const ambientLight = new Three.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

// luz tipo sol
const directionalLight = new Three.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7/5);
// scene.add(directionalLight);
// --Fin Luz definiciones

// --MARK: VARIABLES PARA OBJETOS
let luzSalaObjeto = null;
let materialApagado = null;
let materialEncendido = null;
let luzReal = null;

// --MARK: Cargar modelo GLTF
const loader = new GLTFLoader();
loader.load(
  '/models/casa.glb',
  
  // onSuccess
  function (gltf) {
    const model = gltf.scene;
    console.log("Modelo cargado:", model);

    // Recorrer modelo para encontrar la luz y materiales
    model.traverse((child) => {
      // donde child es cada objeto dentro del modelo glb
      if (child.isMesh && child.name === "Luz_Sala") {
        console.log("Encontrada la luz de la sala:", child);
        
        // guardar objeto
        luzSalaObjeto = child;

        // crear luz real en la posicion de la luz de la sala
        crearLuzReal();
        // guardar materiales
        materialApagado = child.material;
        // creacion del material encendido y clonar para no arruinar el original
        materialEncendido = child.material.clone();

        // agregar emossive para hacer que brille y definir su intensidad
        materialEncendido.emissive = new Three.Color(0xffffaa);
        materialEncendido.emissiveIntensity = 2;

      }
    });

    // Agregar el modelo a la escena
    scene.add(model);
  },
  // onProgress
  undefined,
  // onError
  function (error) {
    console.error("Error al cargar el modelo GLTF:", error);
  }
)

function crearLuzReal() {

  // intensidad, distancia, decay
  luzReal = new Three.PointLight(0xffffee, 3, 20, 2);

  const posicionLuz = luzSalaObjeto.position;
  luzReal.position.set(posicionLuz.x, posicionLuz.y + 1, posicionLuz.z);

  const lightHelper = new Three.PointLightHelper(luzReal);
  scene.add(lightHelper);
}

// MARK: --- Funciones de control de la luz
window.encenderLuz = function() {
  if (luzSalaObjeto && materialEncendido && luzReal) {
    console.log("Encendiendo la luz de la sala");
    luzSalaObjeto.material = materialEncendido;
    luzReal.intensity = 2;

    if(!luzReal.parent) {
      scene.add(luzReal);
    }
  }else {
    console.warn("No se puede encender la luz: objeto o material no definido");
  }
}

window.apagarLuz = function() {
  if (luzSalaObjeto && materialApagado && luzReal) {
    console.log("Apagando la luz de la sala");
    luzSalaObjeto.material = materialApagado;
    luzReal.intensity = 0;

    if(luzReal.parent) {
      scene.remove(luzReal);
    }
  }else {
    console.warn("No se puede apagar la luz: objeto o material no definido");
  }
}

// MARK: --- Bucle de animacion/renderizado
function animate() {
  requestAnimationFrame(animate);

  // Actualizar controles
  controls.update();
  // Renderizar la escena desde la perspectiva de la camara
  renderer.render(scene, camera);
}

animate();



