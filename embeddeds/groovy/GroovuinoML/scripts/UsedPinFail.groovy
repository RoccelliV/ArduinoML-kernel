sensor "button_1" pin 10
sensor "button_2" pin 10

actuator "led" pin 8
actuator "buzzer" pin 9

states "on" and "off"

state "on" means led becomes high and buzzer becomes high
to off when button_1 becomes high
to off when button_2 becomes high

state "off" means led becomes low and buzzer becomes low
to on when button_1 becomes high
to on when button_2 becomes high

initial off

export "Failed scenario : Already used pin !"

