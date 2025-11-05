import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'; // Opcional pero recomendado

// Inicializar el cargador UNA SOLA VEZ
const loader = new GLTFLoader();

// Opcional: Configurar DRACO para mallas comprimidas (muchos modelos de Sketchfab lo usan)
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/draco/'); // Necesitarías copiar la carpeta 'draco' a /public
// loader.setDRACOLoader(dracoLoader);

/**
 * Carga un modelo GLTF/GLB y devuelve una Promesa que se resuelve con el objeto gltf.
 * @param {string} path Ruta al modelo en la carpeta /public
 * @returns {Promise<object>} Una Promesa que se resuelve con el objeto gltf.
 */
export function loadModel(path) {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            // onSuccess
            (gltf) => {
                console.log(`Modelo cargado exitosamente: ${path}`);
                resolve(gltf); // La Promesa se cumple y devuelve el modelo
            },
            // onProgress (opcional, útil para pantallas de carga)
            (xhr) => {
                const percentLoaded = (xhr.loaded / xhr.total * 100).toFixed(0);
                console.log(`Cargando modelo... ${percentLoaded}%`);
            },
            // onError
            (error) => {
                console.error(`Error al cargar el modelo ${path}:`, error);
                reject(error); // La Promesa falla y devuelve el error
            }
        );
    });
}