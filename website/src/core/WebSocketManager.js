// Exportar funciones para controlar el entorno
import { encenderTV, apagarTV, cambiarCanal } from "../controls/TVManager";
import { encenderLuzA, encenderLuzB, apagarLuzA, apagarLuzB } from "../controls/LightManager";

// Realizar conexiones 
// MARK: TODO: Asignar conexion con el esp32
const esp32_IP = "";    

// Conexion para el websocket
let ws;


// setUpWebScoket
export function setUpWebScoket() {
    console.log("Intentando conexion en: ", esp32_IP)

    ws = new WebSocket(esp32_IP)

    ws.onopen = (e) =>{
        console.log("Conexion exitosa con ", esp32_IP, e)
    }

    ws.onerror = (e) => {
        console.log("La conexion fallo con: ", e)
    }

    ws.onclose = () => {
        console.warn("La conexion se cerro, reintentando en 2 segundos")
        setTimeout(setUpWebScoket, 200)
    }

    ws.onmessage = (e) => {
        const command = e.data
        console.log("Mensaje recibido: ", command)
        
        switch(command) {

            // Casos de manejo de luz
            case "Enciende luz de la izquierda":
                encenderLuzA()
            case "Apaga la luz de la izquierda":
                apagarLuzA
            case "Enciende luz de la derecha":
                encenderLuzB()
            case "Apaga la luz de la derecha":
                apagarLuzB()
            
            // Manejo de TV
            case "Enciende la tele":
                encenderTV()
            case "Cambia de canal":
                cambiarCanal()
            case "Apagar la tele":
                apagarTV()

        }

    }

}