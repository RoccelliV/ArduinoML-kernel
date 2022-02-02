/******************************************************************************
 * This file was generated by langium-cli 0.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import { loadGrammar, Grammar } from 'langium';

let loaded: Grammar | undefined;
export const grammar = (): Grammar => loaded || (loaded = loadGrammar(`{
  "$type": "Grammar",
  "usedGrammars": [],
  "hiddenTokens": [
    {
      "$refText": "WS"
    },
    {
      "$refText": "SL_COMMENT"
    },
    {
      "$refText": "ML_COMMENT"
    }
  ],
  "metamodelDeclarations": [],
  "rules": [
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "App",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Keyword",
            "value": "app",
            "elements": []
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ID"
              }
            }
          },
          {
            "$type": "Keyword",
            "value": "initial"
          },
          {
            "$type": "Keyword",
            "value": "state"
          },
          {
            "$type": "Assignment",
            "feature": "initial",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "State"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            }
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Keyword",
            "value": "bricks"
          },
          {
            "$type": "Assignment",
            "feature": "bricks",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Brick"
              }
            }
          },
          {
            "$type": "Assignment",
            "feature": "bricks",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Brick"
              }
            },
            "elements": [],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "states"
          },
          {
            "$type": "Assignment",
            "feature": "states",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "State"
              }
            }
          },
          {
            "$type": "Assignment",
            "feature": "states",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "State"
              }
            },
            "elements": [],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "}"
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Brick",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "arguments": [],
            "rule": {
              "$refText": "Actuator"
            },
            "elements": []
          },
          {
            "$type": "RuleCall",
            "arguments": [],
            "rule": {
              "$refText": "Sensor"
            },
            "elements": []
          },
          {
            "$type": "RuleCall",
            "arguments": [],
            "rule": {
              "$refText": "Screen"
            },
            "elements": []
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Actuator",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "deviceType",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ActuatorType"
              }
            },
            "elements": []
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ID"
              }
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Keyword",
            "value": "PIN"
          },
          {
            "$type": "Assignment",
            "feature": "no",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "INT"
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Sensor",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "deviceType",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "SensorType"
              }
            },
            "elements": []
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ID"
              }
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Keyword",
            "value": "PIN"
          },
          {
            "$type": "Assignment",
            "feature": "no",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "INT"
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Screen",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "deviceType",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ScreenType"
              }
            },
            "elements": []
          },
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ID"
              }
            }
          },
          {
            "$type": "Keyword",
            "value": ":"
          },
          {
            "$type": "Keyword",
            "value": "BUS"
          },
          {
            "$type": "Assignment",
            "feature": "no",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "INT"
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "State",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "name",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "ID"
              }
            },
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "{"
          },
          {
            "$type": "Assignment",
            "feature": "actions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Action"
              }
            }
          },
          {
            "$type": "Assignment",
            "feature": "actions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Action"
              }
            },
            "elements": [],
            "cardinality": "*"
          },
          {
            "$type": "Assignment",
            "feature": "transition",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Transition"
              }
            }
          },
          {
            "$type": "Keyword",
            "value": "}"
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Action",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "RuleCall",
            "arguments": [],
            "rule": {
              "$refText": "ActuatorAction"
            },
            "elements": []
          },
          {
            "$type": "RuleCall",
            "arguments": [],
            "rule": {
              "$refText": "ScreenAction"
            },
            "elements": []
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "ActuatorAction",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "brick",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "Actuator"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            },
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "<="
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Signal"
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "ScreenAction",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "brick",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "Screen"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            },
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "<="
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "prefix",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "arguments": [],
                  "rule": {
                    "$refText": "STRING"
                  }
                },
                "elements": []
              },
              {
                "$type": "Keyword",
                "value": ":="
              }
            ],
            "cardinality": "?"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "Brick"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Transition",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Conditions"
              }
            },
            "elements": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Keyword",
                "value": ",",
                "elements": []
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "arguments": [],
                  "rule": {
                    "$refText": "Conditions"
                  }
                }
              }
            ],
            "cardinality": "*"
          },
          {
            "$type": "Keyword",
            "value": "=>"
          },
          {
            "$type": "Assignment",
            "feature": "next",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "State"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Conditions",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "conditions",
            "operator": "+=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Condition"
              }
            },
            "elements": []
          },
          {
            "$type": "Group",
            "elements": [
              {
                "$type": "Assignment",
                "feature": "op",
                "operator": "=",
                "terminal": {
                  "$type": "RuleCall",
                  "arguments": [],
                  "rule": {
                    "$refText": "OPERATOR"
                  }
                },
                "elements": []
              },
              {
                "$type": "Assignment",
                "feature": "conditions",
                "operator": "+=",
                "terminal": {
                  "$type": "RuleCall",
                  "arguments": [],
                  "rule": {
                    "$refText": "Condition"
                  }
                }
              }
            ],
            "cardinality": "?"
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Condition",
      "hiddenTokens": [],
      "alternatives": {
        "$type": "Group",
        "elements": [
          {
            "$type": "Assignment",
            "feature": "sensor",
            "operator": "=",
            "terminal": {
              "$type": "CrossReference",
              "type": {
                "$refText": "Sensor"
              },
              "terminal": {
                "$type": "RuleCall",
                "arguments": [],
                "rule": {
                  "$refText": "ID"
                }
              }
            },
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "is"
          },
          {
            "$type": "Assignment",
            "feature": "value",
            "operator": "=",
            "terminal": {
              "$type": "RuleCall",
              "arguments": [],
              "rule": {
                "$refText": "Signal"
              }
            }
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "Signal",
      "hiddenTokens": [],
      "type": "string",
      "alternatives": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "HIGH",
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "LOW",
            "elements": []
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "OPERATOR",
      "hiddenTokens": [],
      "type": "string",
      "alternatives": {
        "$type": "Alternatives",
        "elements": [
          {
            "$type": "Keyword",
            "value": "AND",
            "elements": []
          },
          {
            "$type": "Keyword",
            "value": "OR",
            "elements": []
          }
        ]
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "SensorType",
      "hiddenTokens": [],
      "type": "DeviceType",
      "alternatives": {
        "$type": "Assignment",
        "feature": "deviceType",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "Keyword",
              "value": "Button",
              "elements": []
            },
            {
              "$type": "Keyword",
              "value": "Thermometer"
            }
          ]
        },
        "elements": []
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "ScreenType",
      "hiddenTokens": [],
      "type": "DeviceType",
      "alternatives": {
        "$type": "Assignment",
        "feature": "deviceType",
        "operator": "=",
        "terminal": {
          "$type": "Keyword",
          "value": "Lcd",
          "elements": []
        },
        "elements": []
      }
    },
    {
      "$type": "ParserRule",
      "parameters": [],
      "name": "ActuatorType",
      "hiddenTokens": [],
      "type": "DeviceType",
      "alternatives": {
        "$type": "Assignment",
        "feature": "deviceType",
        "operator": "=",
        "terminal": {
          "$type": "Alternatives",
          "elements": [
            {
              "$type": "Keyword",
              "value": "Led",
              "elements": []
            },
            {
              "$type": "Keyword",
              "value": "Buzzer"
            }
          ]
        },
        "elements": []
      }
    },
    {
      "$type": "TerminalRule",
      "name": "WS",
      "regex": "\\\\s+"
    },
    {
      "$type": "TerminalRule",
      "name": "ID",
      "regex": "[_a-zA-Z][\\\\w_]*"
    },
    {
      "$type": "TerminalRule",
      "name": "INT",
      "type": "number",
      "regex": "[0-9]+"
    },
    {
      "$type": "TerminalRule",
      "name": "STRING",
      "regex": "\\"[^\\"]*\\"|'[^']*'"
    },
    {
      "$type": "TerminalRule",
      "name": "ML_COMMENT",
      "regex": "\\\\/\\\\*[\\\\s\\\\S]*?\\\\*\\\\/"
    },
    {
      "$type": "TerminalRule",
      "name": "SL_COMMENT",
      "regex": "\\\\/\\\\/[^\\\\n\\\\r]*"
    }
  ],
  "name": "PolyDsl",
  "definesHiddenTokens": true
}`));
