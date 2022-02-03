sensor "button1" pin 9
sensor "button2" pin 10
actuator "buzzer" pin 11

states "on" and "off" and "one_btn_on"

state "off" means "buzzer" becomes "low"
to "one_btn_on" when button1 becomes high and button2 becomes low
to "one_btn_on" when button1 becomes low and button2 becomes high
to "on" when button1 becomes high and button2 becomes high

state "on" means "buzzer" becomes "high"
to "one_btn_on" when button1 becomes low and button2 becomes high
to "one_btn_on" when button1 becomes high and button2 becomes low
to "off" when button1 becomes low and button2 becomes low

state "one_btn_on" means "buzzer" becomes "low"
to "on" when button1 becomes high and button2 becomes high
to "off" when button1 becomes low and button2 becomes low

initial "off"

export "DualCheckAlarm!"