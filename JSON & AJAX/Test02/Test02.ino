/*
 wexRGB 2 Feb. 2015, test of Bridge.put to see how it works
 A copy of the wexRGB.html and a copy of zepto.js, a  minimized 
 version of jQuery need to be placed in /mnt/sda1/arduino/www.  If the 
 IDE sees the Yun then it is possible to do this with IDE when the files
 are in sketch directory .  If manually uploaded to 
 yun, rename wexRGB.html to index.html in sda1/arduino/www/webRGB.
 To use, open browser to  http://your_yun_name.local/sd/webRGB/

 RGB LED pins are:
 3 = redPin, 4 = greenPin, 5 = bluePin for LED in array
 
 The common cathode is thru 51 ohm resistor to GND.  This measures current.
 The resistor for the red pin is 330 ohms. Green resistor is 510 ohms.The blue
 resistor is 270 ohms.  The different resistor values compensate for the volt drops
 of color LED devices and help to provide the right color balance.  

 */

#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>


// Listen on default port 5555, the webserver on the Yun
// will forward there all the HTTP requests for us.
YunServer server;
String readString;
String webserverString;


void setup() {
  // Bridge startup
  delay(100);
  Serial.begin(115200);
  delay(100);
  Bridge.begin();
  delay(100);
  /* Listen for incoming connection only from localhost
  (no one from the external network could connect) */
  server.listenOnLocalhost();
  server.begin();
  delay(100);
  digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(100);                       // wait for a second
  digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
  delay(100);  
  Serial.println("START");
}


char inData[80];
byte index = 0;


String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}


void loop() {
  // Get clients coming from server
  YunClient client = server.accept();
 //Serial.println();



  // There is a new client?
  if (client) {
    // read the command

    String webserverString = client.readString();    // Reads from http://yunip/arduino/
    webserverString.trim(); //kill whitespace
    int hours = atoi((getValue(webserverString, ',',0)).c_str());
    int mins  = atoi((getValue(webserverString, ',',1)).c_str());
    int secs = atoi((getValue(webserverString, ',',2)).c_str());
    int shift = atoi((getValue(webserverString, ',',3)).c_str());
    Serial.println(hours);
    Serial.println(mins);
    Serial.println(secs);     
    Serial.println(shift);   
    Serial.println(shift*2); 
    // Close connection and free resources.
    client.stop();
//    Bridge.put("this is what I got",webserverString);
  }

  delay(50); // Poll every 50ms
}

