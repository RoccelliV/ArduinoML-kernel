import { ValidationAcceptor, ValidationCheck, ValidationRegistry } from 'langium';
import { PolyDslAstType, App, Connection, Brick } from './generated/ast';
import { PolyDslServices } from './poly-dsl-module';

/**
 * Map AST node types to validation checks.
 */
type PolyDslChecks = { [type in PolyDslAstType]?: ValidationCheck | ValidationCheck[] }

/**
 * Registry for validation checks.
 */
export class PolyDslValidationRegistry extends ValidationRegistry {
    constructor(services: PolyDslServices) {
        super(services);
        const validator = services.validation.PolyDslValidator;
        const checks: PolyDslChecks = {
            App: [validator.checkPinsAreUnique, validator.checkConnectionsExist]
        };
        this.register(checks, validator);
    }
}

/**
 * Implementation of custom validations.
 */
export class PolyDslValidator {

    checkPinsAreUnique(app: App, accept: ValidationAcceptor): void {
        let bus = app.bricks.filter(brick => this.isBus(brick.connection)).map(brick => brick.connection.no);
        let pin = app.bricks.filter(brick => this.isPin(brick.connection)).map(brick => brick.connection.no);
        let duplicatesPin = this.findDuplicates(pin);
        let duplicatesBus = this.findDuplicates(bus);
        duplicatesPin.forEach(p => accept('error', 'the pin ' + p + ' is used by more than one device.', { node: this.findBrickByPin(app.bricks, p), property: 'no' }));
        duplicatesBus.forEach(b => accept('error', 'the bus ' + b + ' is used by more than one device.', { node: this.findBrickByPin(app.bricks, b), property: 'no' }));
        let busPin = bus.reduce((obj, item) => obj.set(item, resolveBus(item)), new Map<number, number[]>());
        pin = Array.from(new Set(pin));
        busPin.forEach((p, bus) => {
            this.findDuplicates(pin.concat(p)).forEach(dp => accept('error', 'the bus ' + bus + ' is using the pin ' + dp + ' which is used by other devices.', { node: this.findBrickByPin(app.bricks, bus), property: 'no' }))
        })
    }

    checkConnectionsExist(app: App, accept: ValidationAcceptor): void {
        let bus = app.bricks.filter(brick => this.isBus(brick.connection)).filter(brick => resolveBus(brick.connection.no).length == 0).map(brick => brick.connection.no);
        let pin = app.bricks.filter(brick => this.isPin(brick.connection)).filter(brick => brick.connection.no < 8 && brick.connection.no > 12).map(brick => brick.connection.no);
        new Set(bus).forEach(b => accept('error', 'the bus ' + b + ' is not supported', { node: this.findBrickByPin(app.bricks, b), property: 'no' }));
        new Set(pin).forEach(p => accept('error', 'the pin ' + p + ' is not supported', { node: this.findBrickByPin(app.bricks, p), property: 'no' }));
    }

    findDuplicates(array: number[]): number[] {
        const count = new Map<number, number>();
        array.forEach(el => {
            let res = count.get(el);
            if (res != undefined) {
                count.set(el,res +1)
             }
             else 
                count.set(el, 1);;
            });
            array = [];
        count.forEach((v, k) => {
            if (v > 1) {
                array.push(k);
            }
        })
        return array;
        
      }

      isBus(connection: Connection): boolean {
        return connection.typeConnection == 'BUS';
    }

    isPin(connection: Connection): boolean {
        return connection.typeConnection == 'PIN';
    }

    findBrickByPin(bricks: Brick[], no: number): Connection {
        return bricks.find(brick => brick.connection.no == no)!.connection;
    }

}

export function resolveBus(no: number): number[] {
    if (no == 2) {
        return [10, 11, 12, 13, 14, 15, 16];
    } else {
        return [];
    }
}