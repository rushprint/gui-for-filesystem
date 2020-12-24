import { FileEntry, FileType } from "./FileSystem"

export class VirtualFileEntry implements FileEntry {

    //  for directory
    private _children = []

    constructor(
        public readonly _type: FileType,
        public _name: string,
        public _source?: FileEntry
    ) {

    }

    type(): FileType {
        return this._type
    }

    name(): string {
        return this._name
    }

    setName(name: string): void {
        this._name = name
    }

    children() : FileEntry[] {
        return this._children
    }
}
