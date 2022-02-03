package main.groovy.groovuinoml.dsl;

import java.util.*;

import groovy.lang.Binding;
import io.github.mosser.arduinoml.kernel.App;
import io.github.mosser.arduinoml.kernel.behavioral.*;
import io.github.mosser.arduinoml.kernel.behavioral.Timer;
import io.github.mosser.arduinoml.kernel.generator.ToWiring;
import io.github.mosser.arduinoml.kernel.generator.Visitor;
import io.github.mosser.arduinoml.kernel.structural.Actuator;
import io.github.mosser.arduinoml.kernel.structural.Brick;
import io.github.mosser.arduinoml.kernel.structural.Sensor;

public class GroovuinoMLModel {
	private List<Brick> bricks;
	private List<State> states;
	private HashMap<String, List<Integer>> typedPins = new HashMap<String, List<Integer>>();

	private State initialState;
	private Binding binding;

	private State currentStateRunning;
	
	public GroovuinoMLModel(Binding binding) {
		this.bricks = new ArrayList<Brick>();
		this.states = new ArrayList<State>();
		this.binding = binding;
		this.typedPins.put("sensor", new ArrayList<Integer>());
		this.typedPins.put("actuator", new ArrayList<Integer>());
	}
	
	public void createSensor(String name, Integer pinNumber) {
		Sensor sensor = new Sensor();
		sensor.setName(name);
		sensor.setPin(pinNumber);
		this.bricks.add(sensor);
		this.binding.setVariable(name, sensor);
	}
	
	public void createActuator(String name, Integer pinNumber) {
		Actuator actuator = new Actuator();
		actuator.setName(name);
		actuator.setPin(pinNumber);
		this.bricks.add(actuator);
		this.binding.setVariable(name, actuator);
	}
	
	public State createState(String name, List<Action> actions) {
		State state = new State();
		state.setName(name);
		state.setActions(actions);
		this.states.add(state);
		this.binding.setVariable(name, state);
		return state;
	}

	public void createExceptionState(String name, Actuator actuator, int blinkingTimes){
		ExceptionState exceptionState = new ExceptionState();
		exceptionState.setName(name);
		exceptionState.setActuator(actuator);
		exceptionState.setNbBlinking(blinkingTimes);
		this.states.add(exceptionState);
		this.binding.setVariable(name, exceptionState);
	}
	
	public void createTransition(State from, State to, List<Condition> conditions) {
		Transition transition = new Transition();
		transition.setNext(to);
		transition.setConditions(conditions);
		from.addTransition(transition);
	}

	public void addTimerToState(String name, Timer timer){
		Optional<State> state = this.states.stream().filter(s->s.getName().equals(name)).findFirst();
		state.ifPresent(value -> value.setTimer(timer));
	}
	

	public void createExceptionTransition(State from, State to, List<Condition> conditions) {
		ExceptionTransition exceptionTransition = new ExceptionTransition();
		exceptionTransition.setNext(to);
		exceptionTransition.setConditions(conditions);
		from.addTransition(exceptionTransition);
	}

	public void updateState(State currentStateRunning) {
		this.currentStateRunning = currentStateRunning;
	}

	public void addActionByStateName(String stateName, Action action) {
		Optional<State> state = this.states.stream().filter(s -> s.getName().equals(stateName)).findFirst();
		state.ifPresent(value -> value.addAction(action));
	}

	public Optional<State> getStateByName(String name){
		return this.states.stream().filter(state -> state.getName().equals(name)).findFirst();
	}

	public State getCurrentStateRunning() {
		return currentStateRunning;
	}

	public List<State> getStates() {
		return states;
	}

	public State getInitialState() {
		return initialState;
	}

	public void setInitialState(State state) {
		this.initialState = state;
	}

	public HashMap<String, List<Integer>> getTypedPins() {
		return typedPins;
	}

	@SuppressWarnings("rawtypes")
	public Object generateCode(String appName) {
		App app = new App();
		app.setName(appName);
		app.setBricks(this.bricks);
		app.setStates(this.states);
		app.setInitial(this.initialState);
		Visitor codeGenerator = new ToWiring();
		app.accept(codeGenerator);
		
		return codeGenerator.getResult();
	}
}
