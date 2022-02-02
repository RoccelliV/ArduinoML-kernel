
        #include <LiquidCrystal.h>
		//Wiring code generated from an ArduinoML model
		// Application name: SupportLcd
		long debounce = 200;
		enum STATE {off, on};
		STATE currentState = off;
		
		boolean buttonBounceGuard = false;
		long buttonLastDebounceTime = 0;
    
        LiquidCrystal lcd(10, 11, 12, 13, 14, 15, 16); // lcd [Screen]

		void setup(){
            
        pinMode(8, INPUT);  // button [Sensor]
        pinMode(9, OUTPUT); // led [Actuator]
        lcd.begin(16, 2);
		}

		void loop() {
			switch(currentState){
                
                case off:
					    digitalWrite(9, LOW);lcd.print(digitalRead(9) == LOW ? "OFF" : "ON");
                        
        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
       if (
            (digitalRead(8) == HIGH && buttonBounceGuard)
        )
            {
                buttonLastDebounceTime = millis();
                
                
       currentState = on;
    }
    break;
                
                case on:
					    digitalWrite(9, HIGH);lcd.print(digitalRead(9) == LOW ? "OFF" : "ON");
                        
        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
       if (
            (digitalRead(8) == HIGH && buttonBounceGuard)
        )
            {
                buttonLastDebounceTime = millis();
                
                
       currentState = off;
    }
    break;
                
			}
            delay(50);
            lcd.clear();
		}
        