// descomentar para instalar dependencias para que las referencias funcionen ... 
// #include <WiFi.h>
// #include <ESPAsyncWebServer.h>
// #include <WebSocketsServer.h>

// --- conf 
const char* ssid = "wifi";
const char* password = "pass";


// Crear el servidor web y ws en el puerto 80 y 81
AsyncWebServer server(80);

WebSocketsServer webSocket = WebSocketsServer(81);

uint8_t clienteNum; // guarda el ID del cliente (navegador)

// Función que se ejecuta cuando el WebSocket recibe un evento
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Desconectado!\n", num);
            break;
            
        case WStype_CONNECTED: {
            // Un cliente se ha conectado (tu navegador)
            IPAddress ip = webSocket.remoteIP(num);
            Serial.printf("[%u] Conectado desde %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);
            
            // Guarda el ID del cliente para enviarle mensajes
            clienteNum = num; 
            break;
        }
            
        case WStype_TEXT:
            // TODO: cuando se tenga el microfono aqui se esperaran y serviran las llamadas del cliente
            // Si el navegador envía un mensaje al ESP32
            Serial.printf("[%u] Recibido: %s\n", num, payload);
            break;
    }
}

void setup() {
    Serial.begin(115200);
    Serial.println("Iniciando...");

    // 1. Conectar a wifi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando a WiFi...");
    }

    // 2. Imprimir la IP del ESP32
    // TODO: definir la ip en websocket.js
    Serial.println("Conectado a Wi-Fi");
    Serial.print("IP del ESP32: ");
    Serial.println(WiFi.localIP()); 

    // 3. Iniciar el servidor ws
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
    
    // 4. Iniciar el servidor web 
    server.begin();
}

void loop() {
    // Escucha constantemente por nuevos eventos
    webSocket.loop();
    
    // --- test inciial ... ---
    // TODO: IMPORTANTE, esto es solo una prueba, aqui se definira las funciones con el micro
    // Envía "LUZ_A_ON" al navegador cada 10 segundos.
    delay(10000);
    Serial.println("Enviando comando de prueba LUZ_A_ON...");
    
    // Envía el comando al cliente guardado
    webSocket.sendTXT(clienteNum, "LUZ_A_ON"); 
}