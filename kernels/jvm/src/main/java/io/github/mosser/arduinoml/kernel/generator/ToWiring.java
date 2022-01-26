package io.github.mosser.arduinoml.kernel.generator;

import io.github.mosser.arduinoml.kernel.App;
import io.github.mosser.arduinoml.kernel.behavioral.*;
import io.github.mosser.arduinoml.kernel.structural.*;

/**
 * Quick and dirty visitor to support the generation of Wiring code
 */
public class ToWiring extends Visitor<StringBuffer> {
	enum PASS {ONE, TWO}


	public ToWiring() {
		this.result = new StringBuffer();
	}

	private void w(String s) {
		result.append(String.format("%s",s));
	}

	@Override
	public void visit(App app) {
		//first pass, create global vars
		context.put("pass", PASS.ONE);
		w("// Wiring code generated from an ArduinoML model\n");
		w(String.format("// Application name: %s\n", app.getName())+"\n");

		w("long debounce = 200;\n");
		w("\nenum STATE {");
		String sep ="";
		for(State state: app.getStates()){
			w(sep);
			state.accept(this);
			sep=", ";
		}
		w("};\n");
		for (State state: app.getStates()){
			System.out.println(state);
			if (state.getTimer() != null){
				w(String.format("boolean %sStateTimer=%b;\n", state.getName(), state.getTimer().isActive()));
			}
		}
		if (app.getInitial() != null) {
			w("STATE currentState = " + app.getInitial().getName()+";\n");
		}

//		for(Brick brick: app.getBricks()){
		if(app.getBricks().size()>0)
			app.getBricks().get(0).accept(this);
//		}
		//second pass, setup and loop
		context.put("pass",PASS.TWO);
		w("\nvoid setup(){\n");
		for(Brick brick: app.getBricks()){
			brick.accept(this);
		}
		w("}\n");

		w("\nvoid loop() {\n" +
			"\tswitch(currentState){\n");
		for(State state: app.getStates()){
			state.accept(this);
		}
		w("\t}\n" +
			"}");
	}

	@Override
	public void visit(Actuator actuator) {
		if(context.get("pass") == PASS.ONE) {
			return;
		}
		if(context.get("pass") == PASS.TWO) {
			w(String.format("  pinMode(%d, OUTPUT); // %s [Actuator]\n", actuator.getPin(), actuator.getName()));
			return;
		}
	}


	@Override
	public void visit(Sensor sensor) {
		if(context.get("pass") == PASS.ONE) {
			w("boolean bounceGuard = false;\n");
			w("long lastDebounceTime = 0;\n");
			return;
		}
		if(context.get("pass") == PASS.TWO) {
			w(String.format("  pinMode(%d, INPUT);  // %s [Sensor]\n", sensor.getPin(), sensor.getName()));
			return;
		}
	}

	@Override
	public void visit(State state) {
		if(context.get("pass") == PASS.ONE){
			w(state.getName());
			return;
		}
		if(context.get("pass") == PASS.TWO) {
			w("\t\tcase " + state.getName() + ":\n");
			for (Action action : state.getActions()) {
				action.accept(this);
			}
			if(state.getTimer() != null){
				w(String.format("\t\t\tif(%sStateTimer){\n", state.getName()));
				w(String.format("\t\t\t\tdelay(%d);\n", state.getTimer().getTime()));
				w("\t\t\t\tcurrentState = " + state.getTransitions().get(0).getNext().getName() + ";\n");
				w("\t\t\t\tbreak;\n");
				w("\t\t\t}\n");
			}
			for (Transition transition : state.getTransitions()) {
				transition.accept(this);
			}
			w("\t\tbreak;\n");
			return;
		}

	}

	@Override
	public void visit(Transition transition) {
		if(context.get("pass") == PASS.ONE) {
			return;
		}
		if(context.get("pass") == PASS.TWO) {
			w("\t\t\tbounceGuard = millis() - lastDebounceTime > debounce;\n");
			w(String.format("\t\t\tif ( bounceGuard "));
			for (Condition condition :transition.getConditions()) {
				condition.accept(this);
			}
			w(") {\n");
			w("\t\t\t\tlastDebounceTime = millis();\n");
			w("\t\t\t\tcurrentState = " + transition.getNext().getName() + ";\n");
			w("\t\t\t\tbreak;\n");
			w("\t\t\t}\n");
			return;
		}
	}

	@Override
	public void visit(Condition condition) {
		w(String.format("&& (digitalRead(%s) == %s) ", condition.getSensor().getPin(), condition.getValue()));
	}

	@Override
	public void visit(Action action) {
		if(context.get("pass") == PASS.ONE) {
			return;
		}
		if(context.get("pass") == PASS.TWO) {
			w(String.format("\t\t\tdigitalWrite(%d,%s);\n",action.getActuator().getPin(),action.getValue()));
			return;
		}
	}

}
