sensor "button" pin 9
actuator "led" pin 12

states "on" and "off"

state "on" means "led" becomes "high"
    to "off" when "button" becomes "high"

state "off" means "led" becomes "low"
    to "on" when "button" becomes "high"

tor "eo"

initial off

export "StateAlarmBased!"