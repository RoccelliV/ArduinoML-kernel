grammar PolyDsl
hidden(WS, SL_COMMENT, ML_COMMENT)


App:
	'app' name=ID 'initial' 'state' initial=[State|ID]
	'{'
		'bricks'
		bricks+=Brick
		(bricks+=Brick)* 
		
		'states'
		states+=State
		(states+=State)* 		
	'}';


Brick:
	Actuator | Sensor | Screen;

Actuator:
	deviceType=ActuatorType name=ID ':' connection=Pin;

Sensor:
	deviceType=SensorType name=ID ':' connection=Pin;

Screen:
	deviceType=ScreenType name=ID ':' connection=Bus;


State:
	name=ID '{'
		actions+=Action
		(actions+=Action)* 
		transition=Transition
	'}';


Action:
	ActuatorAction | ScreenAction;

ActuatorAction:
	brick=[Actuator|ID]'<=' value=Signal;

ScreenAction:
	brick=[Screen|ID] '<=' (prefix=STRING ':=')? value=[Brick|ID];


Transition:
	conditions+=Conditions (',' conditions+=Conditions)* '=>' next=[State|ID];

Conditions:
	conditions+=Condition (op=OPERATOR conditions+=Condition)?;

Condition:
	sensor=[Sensor|ID] 'is' value=Signal;

Signal returns string: 'HIGH' | 'LOW';
OPERATOR returns string: 'AND' | 'OR';
SensorType returns DeviceType: deviceType=('Button' | 'Thermometer');
ScreenType returns DeviceType: deviceType=('Lcd');
ActuatorType returns DeviceType: deviceType=('Led' | 'Buzzer');

Bus returns Connection:
	 typeConnection='BUS' no=INT;
Pin returns Connection:
	 typeConnection='PIN' no=INT;

terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"[^"]*"|'[^']*'/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;