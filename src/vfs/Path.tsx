import { InvalidPath } from "./VirtualFileSystemErrors"

export class ParsedPath {
    public dirs: string[] = []
    public name: string|undefined = undefined

    isRoot(): boolean {
        return this.dirs.length === 0 && !this.name
    }

    isFile(): boolean {
        return this.name !== undefined
    }

    dirPath(): string {
        return `/${this.dirs.join('/')}`
    }
}

export function parsePath(path: string): ParsedPath {

    if(!path) {
        throw new InvalidPath(path)
    }

    path = path.trim()

    if(!path.startsWith('/')) {
        throw new InvalidPath(path)
    }

    const parsed = new ParsedPath()

    parsed.dirs = path.split('/')
    if(path.startsWith('/')) {
        parsed.dirs.shift()
    }

    parsed.name = parsed.dirs.pop()
    if(parsed.name === '') {
        parsed.name = undefined
    }

    // console.log(path, '->', parsed);

    return parsed
}
