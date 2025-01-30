# Basic JavaScript to Flow Component Mappings

## Variable Declarations
- **Const/Let/Variable Declaration** → `variable` component
  - Properties:
    - `name`: Variable name
    - `value`: Initialization value (if any)
  - Connections: To any usage points

## Function Calls
- **Function Call** → `function_call` component
  - Properties:
    - `functionName`: Called function name
    - `arguments`: Array of argument expressions
  - Connections: From argument sources to this component

## Basic Control Flow
- **If Statement** → `conditional` component
  - Properties:
    - `condition`: Condition expression
  - Connections: 
    - `true` branch to first child
    - `false` branch to second child

## Loops
- **For Loop** → `loop` component
  - Properties:
    - `iterator`: Iterator variable name
    - `collection`: Collection expression
  - Connections: Body components connected in sequence
