
//Wiring code generated from an ArduinoML model
// Application name: SupportLcd
long debounce = 200;
enum STATE
{
    off,
    on
};
STATE currentState = off;

boolean buttonBounceGuard = false;
long buttonLastDebounceTime = 0;

void setup()
{

    pinMode(10, INPUT); // button [Sensor]
    pinMode(9, OUTPUT); // led [Actuator]
    pinMode(8, OUTPUT); // lcd [Screen]
}

void loop()
{
    switch (currentState)
    {

    case off:
        digitalWrite(9, LOW);
        digitalWrite(8, digitalRead(9) == LOW ? "OFF" : "ON");

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(10)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = on;
        }
        break;

    case on:
        digitalWrite(9, HIGH);
        digitalWrite(8, digitalRead(9) == LOW ? "OFF" : "ON");

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(10)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = off;
        }
        break;
    }
}
