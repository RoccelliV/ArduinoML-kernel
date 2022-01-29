import fs from 'fs';
import { CompositeGeneratorNode, processGeneratorNode } from 'langium';
import { Action, Actuator, App, Brick, isActuator, isSensor, Sensor, State, Transition } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import path from 'path';

export function generateJavaScript(app: App, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.ino`;
    const fileNode = new CompositeGeneratorNode();
    const arduinoMLGenerator = new ArduinoMLGenerator();
    fileNode.append(arduinoMLGenerator.compile(app));
  
    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, processGeneratorNode(fileNode));
    return generatedFilePath;
}
class ArduinoMLGenerator {
		
	compile(app: App): string { 
        return `
		//Wiring code generated from an ArduinoML model
		// Application name: ${app.name}
		long debounce = 200;
		enum STATE {${app.states.map(state => state.name).join(', ')}};
		${app.initial != null ? `STATE currentState = ${app.initial.ref?.name};` : ''}
		${app.bricks.map(brick => this.declareBrick(brick)).join('')}

		void setup(){
            ${app.bricks.map(brick => this.compileBrick(brick)).join('')}
		}

		void loop() {
			switch(currentState){
                ${app.states.map(state => this.compileState(state)).join('')}
			}
		}
        `
    }

	declareBrick(b: Brick): string { 
        return isSensor(b) ? this.declareSensor(b as Sensor) : ''
    }

	compileBrick(b: Brick): string {
    return isSensor(b) ? this.compileSensor(b as Sensor) : isActuator(b) ? this.compileActuator(b as Actuator) : ''
    }

	compileActuator(actuator: Actuator): string {
        return `
        pinMode(${actuator.pin}, OUTPUT); // ${actuator.name} [Actuator]`
    }
	
	declareSensor(sensor: Sensor): string {
        return `
		bool ${sensor.name}BounceGuard = false;
		long ${sensor.name}LastDebounceTime = 0;
    `
    }

	compileSensor(sensor: Sensor): string {
        return `
        pinMode(${sensor.pin}, INPUT);  // ${sensor.name} [Sensor]` 
    }

	compileState(state: State): string {
        return `
                case ${state.name}:
					${state.actions.map(action => this.compileAction(action)).join('')}
                    ${state.transition !== null ? (this.compileTransition(state.transition) + "break;") : ''}
                ` 
    }

	compileTransition(transition: Transition): string {
        return `${transition.sensor.ref?.name}BounceGuard = millis() - ${transition.sensor.ref?.name}LastDebounceTime > debounce;
                    if (digitalRead(${transition.sensor.ref?.pin}) == ${transition.value} && ${transition.sensor.ref?.name}BounceGuard) {
                        ${transition.sensor.ref?.name}LastDebounceTime = millis();
                        currentState = ${transition.next.ref?.name};
                    }
                    `
}

	compileAction(action: Action): string {
        return `
        digitalWrite(${action.actuator.ref?.pin},${action.value});`
    }
	
}

