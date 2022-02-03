sensor "button" pin 9
actuator "buzzer" pin 11
actuator "led" pin 12

states "button_off" and "button_push_once" and "button_push_twice"

state "button_off" means led becomes low and buzzer becomes low
to button_push_once when button becomes high

state "button_push_once" means led becomes high and buzzer becomes low
to button_push_twice when button becomes high

state "button_push_twice" means led becomes low and buzzer becomes high
to button_off when button becomes high

initial button_off

export "MultiStateAlarm!"