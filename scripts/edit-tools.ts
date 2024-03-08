// Name: EDIT Tools

import "@johnlindquist/kit"

const usePairingFunction = (a: number, b: number) => {
    return 2 ** a * (2 * b + 1) - 1
}

const useUnpairingFunction = (z: number) => {
    const a = Math.floor(Math.log2((z + 1) / 2))
    const b = (z + 1) / (2 ** a) - 1
    return { a, b }
}

const convertOperationToNumber = (operation: OperationType) => {
    const operationToNumberMap = {
        "void": 0,
        "increment": 1,
        "decrement": 2,
        "jump": 3
    } as const;

    return operationToNumberMap[operation]
}

const convertVariableToNumber = (variabile: string) => {
    // the letters are in this order: Y, X1, Z1, X2, Z2,...
    const letter = variabile[0]
    const number = variabile[1]

    if (number === undefined) {
        return letter.charCodeAt(0) - 88
    } else {
        return (letter.charCodeAt(0) - 88) + (parseInt(number) - 1) * 5
    }
}

const convertLabelToNumber = (etichetta: string) => {

    const letter = etichetta[0]
    const number = etichetta[1]

    if (letter === undefined) {
        return 0
    }

    if (number === undefined) {
        return letter.charCodeAt(0) - 64
    } else {
        return (letter.charCodeAt(0) - 64) + (parseInt(number) - 1) * 5
    }


}

const parseInstruction = (instruction: string) => {
    const currentInstruction = new Instruction(instruction)
    return currentInstruction
}

type OperationType = "jump" | "void" | "increment" | "decrement"

class Instruction {
    label: string
    operation: OperationType
    savedToVariable: string
    usingVariable: string
    instructionNumber: number
    raw: string

    static operationRegex = {
        "increment": /([A-Z0-9]+)\s?<--\s?([A-Z0-9]+) \+ ([A-Z0-9]+)/g,
        "decrement": /([A-Z0-9]+)\s?<--\s?([A-Z0-9]+) \- ([A-Z0-9]+)/g,
        "void": /([A-Z0-9]+)\s?<--\s?([A-Z0-9]+)/g,
        "jump": /IF ([A-Z0-9]+) != 0 GOTO ([A-Z0-9]+)/g
    }


    constructor(instruction: string) {
        this.raw = instruction
        this.checkForLabel(instruction)
        this.checkForOperation(instruction)
        this.calculateInstructionNumber()
    }

    calculateInstructionNumber() {
        const labelNumber = convertLabelToNumber(this.label)
        const operationNumber = convertOperationToNumber(this.operation)
        const savedToVariableNumber = convertVariableToNumber(this.savedToVariable)
        //TODO solve bug here
        this.instructionNumber = usePairingFunction(labelNumber, usePairingFunction(operationNumber, savedToVariableNumber))
    }

    checkForOperation(instruction: string) {
        for (const operation in Instruction.operationRegex) {
            const match = instruction.match(Instruction.operationRegex[operation])
            if (match) {
                this.operation = operation as OperationType
                return
            }
        }
    }

    checkForSavedToVariable(instruction: string) {
        const match = instruction.match(/([A-Z0-9]+) <--/g)
        if (match) {
            this.savedToVariable = match[0]
        } else {
            this.savedToVariable = ""
        }
    }

    checkForLabel(instruction: string) {
        const labelRegex = /\[([A-Z0-9]+)\]/g
        const match = instruction.match(labelRegex)
        if (match) {
            this.label = match[0].replace('[', '').replace(']', '')
        } else {
            this.label = ""
        }
    }

    toString() {
        return `Label: ${this.label}, Operation: ${this.operation}, Raw: ${this.raw}, Number: ${this.instructionNumber}`
    }
}

await div(
    md(`
        ${parseInstruction('Y <-- Y').toString()}
    `)
)