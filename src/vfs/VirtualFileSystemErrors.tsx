export class InvalidPath extends Error {
    constructor(path: string) {
        super(`Invalid path: ${path}`)
    }
}

export class PathNotExist extends Error {
    constructor(path?: string) {
        super(path ? `Not Found Entry: ${path}` : `Directory Not Found`)
    }
}

export class AlreadyExist extends Error {
    constructor(name: string) {
        super(`Already exist: ${name}`)
    }
}

export class ParentIsNotDirectory extends Error {
    constructor() {
        super(`Parent is not directory`)
    }
}

export class LoopLinkIsNotAllowed extends Error {
    constructor() {
        super(`Loop link is not allowed`)
    }
}

