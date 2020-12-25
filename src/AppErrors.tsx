

export class NotEnoughParams extends Error {
    constructor() {
        super('Not enough parameters')
    }
}

export class InvalidParamCount extends Error {
    constructor() {
        super('Not enough parameters')
    }
}

export class UnknownCommand extends Error {
    constructor() {
        super('Unknown command')
    }
}

