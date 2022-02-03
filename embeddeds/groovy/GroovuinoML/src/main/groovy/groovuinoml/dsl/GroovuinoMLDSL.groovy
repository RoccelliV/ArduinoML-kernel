package main.groovy.groovuinoml.dsl

import groovuinoml.dsl.Duration
import groovuinoml.dsl.TimeUnit
import org.codehaus.groovy.control.CompilerConfiguration
import org.codehaus.groovy.control.customizers.SecureASTCustomizer
import io.github.mosser.arduinoml.kernel.structural.SIGNAL

class GroovuinoMLDSL {
	private GroovyShell shell
	private CompilerConfiguration configuration
	private GroovuinoMLBinding binding
	private GroovuinoMLBasescript basescript
	
	GroovuinoMLDSL() {
		binding = new GroovuinoMLBinding()
		binding.setGroovuinoMLModel(new GroovuinoMLModel(binding));
		configuration = getDSLConfiguration()
		configuration.setScriptBaseClass("main.groovy.groovuinoml.dsl.GroovuinoMLBasescript")
		shell = new GroovyShell(configuration)
		setupUnits();
		binding.setVariable("high", SIGNAL.HIGH)
		binding.setVariable("low", SIGNAL.LOW)
	}

	private void setupUnits() {
		Number.metaClass {
			getMillisecond { -> new Duration(delegate, TimeUnit.millisecond) }
			getSecond { -> new Duration(delegate, TimeUnit.second) }
			getMinute { -> new Duration(delegate, TimeUnit.minute) }
		}
		binding.setVariable("millisecond", new Duration(1, TimeUnit.millisecond))
		binding.setVariable("second", new Duration(1, TimeUnit.second))
		binding.setVariable("minute", new Duration(1, TimeUnit.minute))
	}

	private static CompilerConfiguration getDSLConfiguration() {
		def secure = new SecureASTCustomizer()
		secure.with {
			//disallow closure creation
			closuresAllowed = false
			//disallow method definitions
			methodDefinitionAllowed = true
			//empty white list => forbid imports
			importsWhitelist = [
				'java.lang.*'
			]
			staticImportsWhitelist = []
			staticStarImportsWhitelist= []
			//language tokens disallowed
//			tokensBlacklist= []
			//language tokens allowed
			tokensWhitelist= []
			//types allowed to be used  (including primitive types)
			constantTypesClassesWhiteList= [
				int, Integer, Number, Integer.TYPE, String, Object
			]
			//classes who are allowed to be receivers of method calls
			receiversClassesWhiteList= [
				int, Number, Integer, String, Object
			]
		}
		
		def configuration = new CompilerConfiguration()
		configuration.addCompilationCustomizers(secure)
		
		return configuration
	}

	void eval(File scriptFile) {
		Script script = shell.parse(scriptFile)
		
		binding.setScript(script)
		script.setBinding(binding)
		
		script.run()
	}
}
