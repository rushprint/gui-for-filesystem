import { FileEntry, FileType } from "./FileSystem"
import { AlreadyExist, ParentIsNotDirectory } from "./VirtualFileSystemErrors"

export class VirtualFileEntry implements FileEntry {
    private _parent: VirtualFileEntry|null = null
    private _children = new Map<string, VirtualFileEntry>()
    private _properties = new Set<string>()

    constructor(
        public readonly _type: FileType,
        public _name: string,
        public _source?: string
    ) {}

    type(): FileType {
        return this._type
    }

    name(): string {
        return this._name
    }

    haveProperty(property: string): boolean {
        return this._properties.has(property)
    }

    properties(): string[] {
        return Array.from(this._properties)
    }

    children() : FileEntry[] {
        return Array.from(this._children.values())
    }

    origin(): string|undefined {
        return this._source
    }

    depth(): number {
        let d = 0;
        let node: VirtualFileEntry = this
        while(node._parent) {
            d++
            node = node._parent
        }
        return d
    }

    // Internal use only.

    setParent(parent: VirtualFileEntry|null) {
        this._parent = parent
    }

    addChild(child: VirtualFileEntry) {

        if(this._type !== FileType.Directory) {
            throw new ParentIsNotDirectory()
        }

        if(this._children.has(child.name())) {
            throw new AlreadyExist(child.name())
        }

        child.setParent(this)

        this._children.set(child.name(), child)
    }

    removeChild(name: string) {
        const child = this._children.get(name)
        if(child) {
            this._children.delete(name)
            child.setParent(null)
        }
    }

    setName(name: string): void {
        this._name = name
    }

    getChild(name: string): VirtualFileEntry|undefined {
        return this._children.get(name)
    }

    toggleProperty(property: string) {
        if(this._properties.has(property)) {
            this.propertyOff(property)
        } else {
            this.propertyOn(property)
        }
    }

    private propertyOn(property: string) {
        this._properties = this._properties.add(property)
        if(this._type === FileType.Directory) {
            //  recursive call for children
            for(const child of Array.from(this._children.values())) {
                child.propertyOn(property)
            }
        }
    }

    private propertyOff(property: string) {
        this._properties.delete(property)
        if(this._type === FileType.Directory) {
            //  recursive call for children
            for(const child of Array.from(this._children.values())) {
                child.propertyOff(property)
            }
        }
    }
}
