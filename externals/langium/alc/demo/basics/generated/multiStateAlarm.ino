
//Wiring code generated from an ArduinoML model
// Application name: MultiStateAlarm
long debounce = 200;
enum STATE
{
    off,
    buzzer_on,
    led_on
};
STATE currentState = off;

boolean buttonBounceGuard = false;
long buttonLastDebounceTime = 0;

void setup()
{

    pinMode(11, OUTPUT); // buzzer [Actuator]
    pinMode(10, INPUT);  // button [Sensor]
    pinMode(9, OUTPUT);  // led [Actuator]
}

void loop()
{
    switch (currentState)
    {

    case off:
        digitalWrite(11, LOW);
        digitalWrite(9, LOW);

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(10)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = buzzer_on;
        }
        break;

    case buzzer_on:
        digitalWrite(11, HIGH);
        digitalWrite(9, LOW);

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(10)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = led_on;
        }
        break;

    case led_on:
        digitalWrite(11, LOW);
        digitalWrite(9, HIGH);

        buttonBounceGuard = millis() - buttonLastDebounceTime > debounce;
        if ((digitalRead(10)) == HIGH && buttonBounceGuard)
        {
            buttonLastDebounceTime = millis();

            currentState = off;
        }
        break;
    }
}
