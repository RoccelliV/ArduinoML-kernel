import fs from 'fs';
import { CompositeGeneratorNode, processGeneratorNode } from 'langium';
import { Action, Actuator, App, Brick, Condition, Conditions, isActuator, isActuatorAction, isScreen, isScreenAction, isSensor, OPERATOR, Screen, Sensor, State, Transition } from '../language-server/generated/ast';
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
    if (isSensor(b)) {
        return this.compileSensor(b as Sensor); 
    } else if (isActuator(b)) {
        return this.compileActuator(b as Actuator);
    } else if (isScreen(b)) {
        return this.compileScreen(b as Screen);
    }
    return ``
}

	compileActuator(actuator: Actuator): string {
        return `
        pinMode(${actuator.pin}, OUTPUT); // ${actuator.name} [Actuator]`
    }

    compileScreen(screen: Screen): string {
        return `
        pinMode(${screen.pin}, OUTPUT); // ${screen.name} [Screen]`
    }
	
	declareSensor(sensor: Sensor): string {
        return `
		boolean ${sensor.name}BounceGuard = false;
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
					    ${state.actions.map(action => this.compileAction(action)).join(';')};
                        ${state.transition !== null ? (this.compileTransition(state.transition) + "break;") : ''}
                ` 
    }

	compileTransition(transition: Transition): string {
        return `
        ${transition.conditions.map(conditions => conditions.conditions.map(condition => this.declareCondition(condition)).join('')).join('')}
       ${this.compileConditions(transition.conditions)}
       currentState = ${transition.next.ref?.name};
    }
    `
}


    declareCondition(condition: Condition): string {
        return condition.sensor.ref != undefined ? this.declareBounceGuard(condition.sensor.ref) : ``;
    }
    declareBounceGuard(sensor: Sensor): string {
       return `${sensor.name}BounceGuard = millis() - ${sensor.name}LastDebounceTime > debounce;`
    }

    compileConditions(conditions: Conditions[]): string {
        return `if (${conditions.map(conditions => '(' + conditions.conditions.map(condition => this.compileCondition(condition)).join(conditions.op == undefined ? '' : this.compileOperator(conditions.op)) + ')').join(' && ')}
            {
                ${conditions.map(conditions =>conditions.conditions.map(condition => condition.sensor.ref?.name + 'LastDebounceTime = millis();').join('')).join(';')}
                
                `
    }

       
    compileCondition(condition: Condition): string {
        return condition.sensor.ref != undefined ?
            `${this.declareDigitalRead(condition.sensor.ref?.pin)}) == ${condition.value} && ${condition.sensor.ref?.name}BounceGuard` : ''
        }
    

    compileOperator(operator: OPERATOR): string {
        switch(operator) {
            case 'AND':
                return ' && '
            case 'OR':
                return ' || '
        }
    }

    compileAction(action: Action): string {
        if (isActuatorAction(action)) {
            return this.declareDigitalWrite(action.brick.ref?.pin,action.value);
        } else if (isScreenAction(action)) {
            if (isActuator(action.value.ref) || isSensor(action.value.ref)) {
                let readValue = this.declareDigitalRead(action.value.ref.pin);
                switch (action.value.ref.brickType) {
                    case 'button':
                    case 'led':
                    case 'buzzer':
                        readValue += ` == LOW ? "OFF" : "ON"`
                        break;
                    case 'temperature':
                        readValue += ` * 0.48828125 + " *C"`
                        break;
                    default:
                        break;
                }
                return this.declareDigitalWrite(action.brick.ref?.pin, (action.prefix != undefined ? action.prefix : '') + readValue);
            } else {
                return this.declareDigitalWrite(action.brick.ref?.pin,(action.prefix != undefined ? action.prefix : '') + action.value);
            }
        } else {
            return ``
        }
    }

    declareDigitalRead(pin: number | undefined): string {
        if (pin != undefined)
            return `digitalRead(${pin})`
        return ''
    }

    declareDigitalWrite(pin: number | undefined, value: string): string {
        if (pin != undefined)
            return `digitalWrite(${pin}, ${value})`
        return '';
    }
	
}

