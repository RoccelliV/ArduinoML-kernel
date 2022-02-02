

//Wiring code generated from an ArduinoML model
// Application name: DualCheckAlarm
long debounce = 200;
enum STATE
{
    off,
    on
};
STATE currentState = off;

boolean button1BounceGuard = false;
long button1LastDebounceTime = 0;

boolean button2BounceGuard = false;
long button2LastDebounceTime = 0;

void setup()
{

    pinMode(11, OUTPUT); // buzzer [[object Object]]
    pinMode(10, OUTPUT); // button1 [[object Object]]
    pinMode(9, OUTPUT);  // button2 [[object Object]]
}

void loop()
{
    switch (currentState)
    {

    case off:
        digitalWrite(11, LOW);

        button1BounceGuard = millis() - button1LastDebounceTime > debounce;
        button2BounceGuard = millis() - button2LastDebounceTime > debounce;
        if (
            (digitalRead(10) == HIGH && button1BounceGuard && digitalRead(9) == HIGH && button2BounceGuard))
        {
            button1LastDebounceTime = millis();
            button2LastDebounceTime = millis();

            currentState = on;
        }
        break;

    case on:
        digitalWrite(11, HIGH);

        button1BounceGuard = millis() - button1LastDebounceTime > debounce;
        button2BounceGuard = millis() - button2LastDebounceTime > debounce;
        if (
            (digitalRead(10) == LOW && button1BounceGuard && digitalRead(9) == LOW && button2BounceGuard))
        {
            button1LastDebounceTime = millis();
            button2LastDebounceTime = millis();

            currentState = off;
        }
        break;
    }
    delay(50);
}
