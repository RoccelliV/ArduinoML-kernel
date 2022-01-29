/******************************************************************************
 * This file was generated by langium-cli 0.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { AstNode, AstReflection, Reference, isAstNode } from 'langium';

export interface Action extends AstNode {
    readonly $container: State;
    actuator: Reference<Actuator>
    value: Signal
}

export const Action = 'Action';

export function isAction(item: unknown): item is Action {
    return reflection.isInstance(item, Action);
}

export interface App extends AstNode {
    bricks: Array<Brick>
    initial: Reference<State>
    name: string
    states: Array<State>
}

export const App = 'App';

export function isApp(item: unknown): item is App {
    return reflection.isInstance(item, App);
}

export interface Brick extends AstNode {
    readonly $container: App;
    name: string
    pin: number
}

export const Brick = 'Brick';

export function isBrick(item: unknown): item is Brick {
    return reflection.isInstance(item, Brick);
}

export interface Condition extends AstNode {
    readonly $container: Conditions;
    sensor: Reference<Sensor>
    value: Signal
}

export const Condition = 'Condition';

export function isCondition(item: unknown): item is Condition {
    return reflection.isInstance(item, Condition);
}

export interface Conditions extends AstNode {
    readonly $container: Transition;
    conditions: Array<Condition>
    op: OPERATOR
}

export const Conditions = 'Conditions';

export function isConditions(item: unknown): item is Conditions {
    return reflection.isInstance(item, Conditions);
}

export interface State extends AstNode {
    readonly $container: App;
    actions: Array<Action>
    name: string
    transition: Transition
}

export const State = 'State';

export function isState(item: unknown): item is State {
    return reflection.isInstance(item, State);
}

export interface Transition extends AstNode {
    readonly $container: State;
    conditions: Array<Conditions>
    next: Reference<State>
}

export const Transition = 'Transition';

export function isTransition(item: unknown): item is Transition {
    return reflection.isInstance(item, Transition);
}

export interface Actuator extends Brick {
}

export const Actuator = 'Actuator';

export function isActuator(item: unknown): item is Actuator {
    return reflection.isInstance(item, Actuator);
}

export interface Sensor extends Brick {
}

export const Sensor = 'Sensor';

export function isSensor(item: unknown): item is Sensor {
    return reflection.isInstance(item, Sensor);
}

export type Signal = 'HIGH' | 'LOW'

export type OPERATOR = 'AND' | 'OR'

export type PolyDslAstType = 'Action' | 'App' | 'Brick' | 'Condition' | 'Conditions' | 'State' | 'Transition' | 'Actuator' | 'Sensor';

export type PolyDslAstReference = 'Action:actuator' | 'App:initial' | 'Condition:sensor' | 'Transition:next';

export class PolyDslAstReflection implements AstReflection {

    getAllTypes(): string[] {
        return ['Action', 'App', 'Brick', 'Condition', 'Conditions', 'State', 'Transition', 'Actuator', 'Sensor'];
    }

    isInstance(node: unknown, type: string): boolean {
        return isAstNode(node) && this.isSubtype(node.$type, type);
    }

    isSubtype(subtype: string, supertype: string): boolean {
        if (subtype === supertype) {
            return true;
        }
        switch (subtype) {
            case Actuator:
            case Sensor: {
                return this.isSubtype(Brick, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(referenceId: PolyDslAstReference): string {
        switch (referenceId) {
            case 'Action:actuator': {
                return Actuator;
            }
            case 'App:initial': {
                return State;
            }
            case 'Condition:sensor': {
                return Sensor;
            }
            case 'Transition:next': {
                return State;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }
}

export const reflection = new PolyDslAstReflection();
