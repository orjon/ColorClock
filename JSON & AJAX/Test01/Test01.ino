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

int ledPins[] = {3, 4, 5}; //Red, Green, Blue

/*LED is common cathode, need +5 for LED ON
  Common cathode is the longest lead, second in from case flat
  for my device.
  common anode, ON = LOW, OFF = High
*/

const boolean ON = HIGH;
const boolean OFF = LOW;
//array defining LED state for color, these can not be constants.
boolean RED[] = {ON, OFF, OFF};
boolean GREEN[] = {OFF, ON, OFF};
boolean BLUE[] = {OFF, OFF, ON};
boolean YELLOW[] = {ON, ON, OFF};
boolean CYAN[] = {OFF, ON, ON};
boolean MAGENTA[] = {ON, OFF, ON};
boolean WHITE[] = {ON, ON, ON};
boolean BLACK[] = {OFF, OFF, OFF};

// Listen on default port 5555, the webserver on the Yun
// will forward there all the HTTP requests for us.
YunServer server;
String readString;
String command;
String currentVal;

void setup() {
  pinMode(ledPins[0], OUTPUT); //pin 3 for red
  pinMode(ledPins[1], OUTPUT); //pin 4 for green
  pinMode(ledPins[2], OUTPUT); //pinn 5 for blue
  // Bridge startup
  Bridge.begin();

  /* Listen for incoming connection only from localhost
  (no one from the external network could connect) */
  server.listenOnLocalhost();
  server.begin();
}

void loop() {
  // Get clients coming from server
  YunClient client = server.accept();

  // There is a new client?
  if (client) {
    // read the command
    String command = client.readString();
    command.trim(); //kill whitespace
 
   //Now to process the command from string to the boolean color array
   
    if (command == "black")
     {
      setColor(ledPins, BLACK);
      currentMeasure();
     }
    if (command == "red")
     {
      setColor(ledPins, RED);
     currentMeasure();
     }
    if (command == "green")
     {
      setColor(ledPins, GREEN);
     currentMeasure();
     }
    if (command == "blue")
     {
      setColor(ledPins, BLUE);
      currentMeasure();
     }
     if (command == "yellow")
     {
      setColor(ledPins, YELLOW);
      currentMeasure();
     }
    if (command == "cyan")
     {
      setColor(ledPins, CYAN);
      currentMeasure();
     }
    if (command == "magenta")
     {
      setColor(ledPins, MAGENTA);
      currentMeasure();
     }
    if (command == "white")
     {
     setColor(ledPins, WHITE);
     currentMeasure();
     }
     
    // Close connection and free resources.
    client.stop();
  }

  delay(50); // Poll every 50ms
}

void setColor(int* led, boolean* color)
 {
 for(int i = 0; i < 3; i++){
  digitalWrite(led[i], color[i]);
  }
 }
 
void currentMeasure()
  {
    int rawVal = analogRead(A0);
    float milliAmp = rawVal / 10.4346;
    String tmp = String(milliAmp);
    tmp= "Current is " + tmp + " mA";
    //Note: Bridge.put does only string
    Bridge.put("value",tmp);
  }
