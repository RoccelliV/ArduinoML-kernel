sensor "button" pin 10
sensor "button" pin 10

actuator "led" pin 10
actuator "buzzer" pin 8

state "on" means led becomes high and buzzer becomes high
state "off" means led becomes low and buzzer becomes low

initial off

from on to off when button becomes high
from off to on when button becomes high

export "Failed scenario!"

