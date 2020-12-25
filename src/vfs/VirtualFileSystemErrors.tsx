
export class InvalidPath extends Error {
    constructor(path: string) {
        super(`Invalid path: ${path}`)
    }
}

export class DirectoryNotFound extends Error {
    constructor(path: string) {
        super(`Directory Not Found: ${path}`)
    }
}

export class FileNotFound extends Error {
    constructor(path: string) {
        super(`File Not Found: ${path}`)
    }
}

export class AlreadyExist extends Error {
    constructor(name: string) {
        super(`Already exist: ${name}`)
    }
}

export class LoopLinkIsNotAllowed extends Error {
    constructor() {
        super(`Loop link is not allowed`)
    }
}
