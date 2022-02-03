sensor "button_1" pin 8
sensor "button_2" pin 9
actuator "led" pin 10

states "on_light" and "off_light"

state "on_light" means "led" becomes high
to off_light when button_1 becomes low
to off_light when button_2 becomes low

state "off_light" means "led" becomes low
to on_light when button_1 becomes high
to on_light when button_2 becomes high

error "blink" times 3 on led when button_1 becomes high and button_2 becomes high

initial off_light

export "ExceptionThrowing Scenario!"