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

    depth(): number {
        let d = 0;
        let parent = this._parent
        while(parent) {
            d++
            parent = parent._parent
        }
        return d
    }

    // Internal use only.

    setParent(parent: VirtualFileEntry) {
        this._parent = parent
    }

    addChild(child: VirtualFileEntry) {

        if(this._type !== FileType.Directory) {
            throw new ParentIsNotDirectory()
        }

        if(this._children.has(child.name())) {
            throw new AlreadyExist(child.name())
        }

        this._children.set(child.name(), child)
    }

    removeChild(name: string) {
        this._children.delete(name)
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
