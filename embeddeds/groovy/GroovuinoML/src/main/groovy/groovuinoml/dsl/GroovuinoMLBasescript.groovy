package main.groovy.groovuinoml.dsl

import groovuinoml.dsl.Duration
import groovy.transform.BaseScript
import io.github.mosser.arduinoml.kernel.behavioral.Condition
import io.github.mosser.arduinoml.kernel.behavioral.Action
import io.github.mosser.arduinoml.kernel.behavioral.Timer
import io.github.mosser.arduinoml.kernel.behavioral.State
import io.github.mosser.arduinoml.kernel.structural.Actuator
import io.github.mosser.arduinoml.kernel.structural.Sensor
import io.github.mosser.arduinoml.kernel.structural.SIGNAL

abstract class GroovuinoMLBasescript extends Script {

	State curState;

	// sensor "name" pin n
	def sensor(String name) {
		[pin: { n -> ((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createSensor(name, n) },
		 onPin: { n -> ((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createSensor(name, n)}]
	}

	// actuator "name" pin n
	def actuator(String name) {
		[pin: { n -> ((GroovuinoMLBinding)this.getBinding()).getGroovuinoMLModel().createActuator(name, n) }]
	}

	// defines states "name" [and "name"]*n
	def states(state1){
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createState(state1, new ArrayList<Action>())
		def closure
		closure = { state ->
			((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createState(state, new ArrayList<Action>())
			[and: closure]
		}
		[and: closure]
	}

	def waitFor(Duration duration){
		[when : {String actuator ->
			[becomes : { String state ->
				((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().addTimerToState(state, new Timer(duration.amount*duration.unit.multiplier as int));
			}]
		}]
	}

	// state "name" means actuator becomes signal [and actuator becomes signal]*n
	def state(String name) {
		Optional<State> optionalState = ((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().getStateByName(name);

		if (optionalState.isPresent()){
			curState = optionalState.get();
			// recursive closure to allow multiple and statements
			def closure
			closure = { actuator ->
				[becomes: { signal ->
					Action action = new Action()
					action.setActuator(actuator instanceof String ? (Actuator)((GroovuinoMLBinding)this.getBinding()).getVariable(actuator) : (Actuator)actuator)
					action.setValue(signal instanceof String ? (SIGNAL)((GroovuinoMLBinding)this.getBinding()).getVariable(signal) : (SIGNAL)signal)
					((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().addActionByStateName(name, action)
					[and: closure]
				}]
			}
			[means: closure]
		}
	}

	// initial state
	def initial(state) {
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().setInitialState(state instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state) : (State)state)
	}


	// from state1 to state2 when sensor becomes signal
	def to(state2) {
		def conditions = [] as List<Condition>

		def closure
		closure = { sensor ->
			[becomes: { signal ->
				conditions.add(new Condition(
						sensor instanceof String ? (Sensor)((GroovuinoMLBinding)this.getBinding()).getVariable(sensor) : (Sensor)sensor,
						signal instanceof String ? (SIGNAL)((GroovuinoMLBinding)this.getBinding()).getVariable(signal) : (SIGNAL)signal
				))
				[and: closure]
			}]
		}
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().createTransition(curState,
				state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2) : (State)state2,
				conditions)

		//actualize current state of app
		((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().updateState(state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2): (State)state2)
		//((GroovuinoMLBinding) this.getBinding()).getGroovuinoMLModel().setInitialState(state2 instanceof String ? (State)((GroovuinoMLBinding)this.getBinding()).getVariable(state2): (State)state2)

		[when: closure]
	}

	def error(type){

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


		[times: { nbBlinking ->
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

	def distance(String str1, String str2) {
		def dist = new int[str1.size() + 1][str2.size() + 1]
		(0..str1.size()).each { dist[it][0] = it }
		(0..str2.size()).each { dist[0][it] = it }

		(1..str1.size()).each { i ->
			(1..str2.size()).each { j ->
				dist[i][j] = [dist[i - 1][j] + 1, dist[i][j - 1] + 1, dist[i - 1][j - 1] + ((str1[i - 1] == str2[j - 1]) ? 0 : 1)].min()
			}
		}
		return dist[str1.size()][str2.size()]
	}

	def methodMissing(String name, args) {
		def methods = GroovuinoMLBasescript.declaredMethods.findAll { !it.synthetic }.name
		def distanceName = [:];
		for (String nameMethod : methods){
			distanceName[nameMethod] = distance(name, nameMethod);
		}
		distanceName = distanceName.sort({ a, b -> a.value <=> b.value }).entrySet()
				.stream()
				.filter({ entry -> entry.getValue() <= 3  })
				.collect();
		if(!distanceName.isEmpty()) {
			def nearestMethod = distanceName.collectEntries().iterator().next().getKey() as String
			String RED = "\033[0;31m";
			String RESET = "\033[0m";
			println(RED+"-----------------------------------------------------------------------------------------")
			println("Unable to find operation : "+ name);
			def signMeth =[]
			GroovuinoMLBasescript.declaredMethods.findAll { !it.synthetic }.each {signMeth.add("$it.name $it.parameters.name")}
			for (String s : signMeth){
				if (s.startsWith(nearestMethod))
					println("Did you mean the operation => "+ s + " ?")
			}
			println("-----------------------------------------------------------------------------------------"+RESET)
			System.exit(0);
		}
	}
}