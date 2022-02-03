sensor "button" pin 9
actuator "led" pin 10

states "on" and "off"

waitFor 10.millisecond when "led" becomes "on"

state "on" means led becomes high
to off when button becomes low

state "off" means led becomes low
to on when button becomes high

initial off


export "TemporalTransition!"