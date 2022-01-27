import { createDefaultModule, DefaultModuleContext, inject, LangiumServices, Module, PartialLangiumServices } from 'langium';
import { PolyDslGeneratedModule } from './generated/module';
import { PolyDslValidationRegistry, PolyDslValidator } from './poly-dsl-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type PolyDslAddedServices = {
    validation: {
        PolyDslValidator: PolyDslValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type PolyDslServices = LangiumServices & PolyDslAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const PolyDslModule: Module<PolyDslServices, PartialLangiumServices & PolyDslAddedServices> = {
    validation: {
        ValidationRegistry: (injector) => new PolyDslValidationRegistry(injector),
        PolyDslValidator: () => new PolyDslValidator()
    }
};

/**
 * Inject the full set of language services by merging three modules:
 *  - Langium default services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 */
export function createPolyDslServices(context?: DefaultModuleContext): PolyDslServices {
    return inject(
        createDefaultModule(context),
        PolyDslGeneratedModule,
        PolyDslModule
    );
}
