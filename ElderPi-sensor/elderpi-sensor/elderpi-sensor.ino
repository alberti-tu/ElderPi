#include <HttpClient.h>
#include <SparkFunMAX17043.h>

SYSTEM_MODE(MANUAL);

HttpClient http;  
http_header_t headers[] = {  { "Content-Type", "application/json" },  { NULL, NULL }   };  

http_request_t request;  
http_response_t response;  

bool precense = false;  // Presence sensor status
bool alert = false;     // Low battery threshold

void setup() {  
    Serial.begin(9600);
    
    request.ip = IPAddress(10,42,0,1);
    request.port = 80;  
    
    response.body = "NULL";
    
    pinMode(D5, INPUT);     // Precense data
    
    lipo.begin();
    lipo.quickStart();
    lipo.setThreshold(5);
}  

// Send data to the server
void postRequest(String path) {  
    request.path = path;  
    double battery = (double) lipo.getSOC();
    if(battery > 100) battery = 100; 
    request.body = "{\"deviceID\":\"" + System.deviceID() + "\", \"battery\":" + battery + "}";
   
    http.post(request, response, headers);
} 

// Check the sensor and update the state
bool readStatus(){
    bool changeStatus = false;
    bool newStatus = false;
    
    newStatus = digitalRead(D5);

    //true if presence goes from 0 to 1
    if((precense == 0) && (newStatus == 1))  changeStatus = true;

    precense = newStatus;    // Save the presence sensor status
    return changeStatus;
}

// Check the battery level threshold and update the state
bool readAlert(){
    bool changeStatus = false;
    bool newStatus = false;
    
    newStatus = lipo.getAlert();

    // true if battery level threshold goes from 0 to 1
    if((alert == 0) && (newStatus == 1))  changeStatus = true;

    alert = newStatus;    // Save the battery status
    return changeStatus;
}

// Main program
void loop() {
    System.sleep(D4, RISING, 10);   // D4 Wake up pin
    
    int status = ((int) readStatus() + (int) readAlert() * 2);
    
    // Send data
    if(status > 0) {
        WiFi.on();
        WiFi.connect();
        
        // Connection stablished
        if(WiFi.ready()) {
            switch (status) {
                case 1:
                    postRequest("/sensor");
                break;
                case 2:
                    postRequest("/sensor/alert");
                break;
                case 3:
                    postRequest("/sensor");
                    postRequest("/sensor/alert");
                break;
            }
        }
        
        WiFi.off();
    }
}  