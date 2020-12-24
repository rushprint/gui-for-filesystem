import { FileEntry, FileType } from "./FileSystem"

export class VirtualFileEntry implements FileEntry {

    private _parent: VirtualFileEntry|null = null
    private _children = []
    private _properties = new Set<string>()

    constructor(
        public readonly _type: FileType,
        public _name: string,
        public _source?: FileEntry
    ) {}

    type(): FileType {
        return this._type
    }

    name(): string {
        return this._name
    }

    properties(): string[] {
        return Array.from(this._properties)
    }

    children() : FileEntry[] {
        return this._children
    }

    depth(): number {
        let d = 0;
        let parent = this._parent
        while(parent) {
            d++
            parent = parent._parent
        }
        return d
    }

    // Setters - for VirtualFileSystem only.

    setParent(parent: VirtualFileEntry) {
        this._parent = parent
    }

    setName(name: string): void {
        this._name = name
    }

    setProperty(name: string) {
        if(this._properties.has(name)) {
            this._properties.delete(name)
        } else {
            this._properties.add(name)
        }
    }
}
