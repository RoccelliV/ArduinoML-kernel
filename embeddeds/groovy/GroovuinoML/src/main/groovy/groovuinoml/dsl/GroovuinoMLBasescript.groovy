package main.groovy.groovuinoml.dsl

import io.github.mosser.arduinoml.kernel.behavioral.Condition
import io.github.mosser.arduinoml.kernel.behavioral.Action
import io.github.mosser.arduinoml.kernel.behavioral.Timer
import io.github.mosser.arduinoml.kernel.behavioral.State
import io.github.mosser.arduinoml.kernel.structural.Actuator
import io.github.mosser.arduinoml.kernel.structural.Sensor
import io.github.mosser.arduinoml.kernel.structural.SIGNAL

abstract class GroovuinoMLBasescript extends Script {

	def checkPinsUtilization(String typePin, int n){
		def model = ((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel()

		if(model.getTypedPins().get(typePin).contains(n)){
			throw new IllegalArgumentException("Pins of type [" + typePin + "] - number : "+ n + " already use");
		}else{
			model.getTypedPins().get(typePin).push(n as Integer);
		}
	}

	// sensor "name" pin n
	def sensor(String name) {
		[pin: { n ->
			checkPinsUtilization("sensor", n as Integer)
			((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createSensor(name, n as Integer) },
		onPin: { n -> ((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createSensor(name, n)}]
	}
	
	// actuator "name" pin n
	def actuator(String name) {
		[pin: { n ->
			checkPinsUtilization("actuator", n as Integer)
			((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createActuator(name, n)
		}]
	}

	// state "name" means actuator becomes signal [and actuator becomes signal]*n
	def state(String name) {
		List<Action> actions = new ArrayList<Action>()
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createState(name, actions)
		// recursive closure to allow multiple and statements
		def closure
		closure = { actuator -> 
			[becomes: { signal ->
				Action action = new Action()
				action.setActuator(actuator instanceof String ? (Actuator)((GroovuinoMLBinding)this.getBinding()).getVariable(actuator) : (Actuator)actuator)
				action.setValue(signal instanceof String ? (SIGNAL)((GroovuinoMLBinding)this.getBinding()).getVariable(signal) : (SIGNAL)signal)
				actions.add(action)
				[and: closure]
			}]
		}
		[means: closure]
	}
	
	// initial state
	def initial(state) {
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().setInitialState(state instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state) : (State)state)
	}

	def waitFor(amount){
		[when : {String state ->
			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().addTimerToState(state, new Timer(true, amount));
		}]
	}
	
	// from state1 to state2 when sensor becomes signal
	def from(state1) {
		def conditions = [] as List<Condition>

		def closure
		closure = { Sensor sensor ->
			[becomes: { SIGNAL signal ->
				conditions.add(new Condition(
							sensor instanceof String ? (Sensor)((GroovuinoMLBinding)this.getBinding()).getVariable(sensor) : (Sensor)sensor,
							signal instanceof String ? (SIGNAL)((GroovuinoMLBinding)this.getBinding()).getVariable(signal) : (SIGNAL)signal
				))
				[and: closure]
			}]
		}
		[to: { state2 ->
			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createTransition(
					state1 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state1) : (State)state1,
					state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2) : (State)state2,
					conditions)

			//actualize current state of app
			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().updateState(state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2): (State)state2)
			//((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().setInitialState(state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2): (State)state2)
			[when: closure]
		}]
	}
	def error(nbBlinking){

		def conditions = [] as List<Condition>

		def closure
		closure = { Sensor sensor ->
			[becomes: { SIGNAL signal ->
				conditions.add(new Condition(
						sensor instanceof String ? (Sensor)((GroovuinoMLBinding)this.getBinding()).getVariable(sensor) : (Sensor)sensor,
						signal instanceof String ? (SIGNAL)((GroovuinoMLBinding)this.getBinding()).getVariable(signal) : (SIGNAL)signal
				))
				[and: closure]
			}]
		}

		[on: {Actuator actuator ->
			def randomNumber =  0
			String errorStateName = "error_${-> randomNumber}"
			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createExceptionState(errorStateName, actuator, nbBlinking)

			//Retrieve current state
			def currentState = ((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().getCurrentStateRunning()

			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createExceptionTransition(
					currentState,
					errorStateName instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(errorStateName) : (State)state2,
					conditions)

			[when: closure]
		}]
	}

	// export name
	def export(String name) {
		println(((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().generateCode(name).toString())
	}
	
	// disable run method while running
	int count = 0
	abstract void scriptBody()
	def run() {
		if(count == 0) {
			count++
			scriptBody()
		} else {
			println "Run method is disabled"
		}
	}
}
