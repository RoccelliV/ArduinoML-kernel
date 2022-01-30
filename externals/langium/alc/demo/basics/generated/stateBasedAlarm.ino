
//Wiring code generated from an ArduinoML model
// Application name: StateBasedAlarm
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

    pinMode(11, OUTPUT); // led [Actuator]
    pinMode(9, INPUT);   // button [Sensor]
}

void loop()
{
    switch (currentState)
    {

    case off:
        digitalWrite(11, LOW);

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(9)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = on;
        }
        break;

    case on:
        digitalWrite(11, HIGH);

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(9)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = off;
        }
        break;
    }
}
