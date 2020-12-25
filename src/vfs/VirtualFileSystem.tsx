import { FileEntry, FileSystem, FileType } from "./FileSystem";
import { VirtualFileEntry } from "./VirfualFileEntry";
import { AlreadyExist, InvalidPath, LoopLinkIsNotAllowed, PathNotExist } from "./VirtualFileSystemErrors";

interface ParsedPath {
    dirs: string[]
    name: string
}

export class VirtualFileSystem implements FileSystem {

    private readonly _root = new VirtualFileEntry(FileType.Directory, '/')

    createDirectory(path: string) {
        //  parse path
        const parsed = this._parsePath(path)

        //  creating root directory is not allowed.
        if((parsed.dirs.length == 0) && !parsed.name) {
            throw new InvalidPath('Cannot create root(/) directory')
        }

        //  get parent directory
        const parent = this._getNode(parsed.dirs)

        //  create child directory.
        parent.addChild(new VirtualFileEntry(FileType.Directory, parsed.name))
    }

    createDirectories(paths: string[]) {
        for(const dir of paths) {
            this.createDirectory(dir)
        }
    }

    createFile(path: string) {
        //  parse path
        const parsed = this._parsePath(path)

        //  creating root directory is not allowed.
        if((parsed.dirs.length == 0) && !parsed.name) {
            throw new InvalidPath('Cannot create root(/) file')
        }

        if(parsed.name === '') {
            throw new InvalidPath(path)
        }

        //  get parent directory
        const parent = this._getNode(parsed.dirs)

        //  create child file.
        parent.addChild(new VirtualFileEntry(FileType.File, parsed.name))
    }

    createFiles(paths: string[]) {
        for(const path of paths) {
            this.createFile(path)
        }
    }

    move(srcPath: string, destPath: string) {
        // parse
        const src = this._parsePath(srcPath)
        const dest = this._parsePath(destPath)

        // check src or dest == /
        if((src.dirs.length == 0) && !src.name) {
            throw new InvalidPath('Cannot move root(/) directory')
        }
        if((dest.dirs.length == 0) && !dest.name) {
            throw new InvalidPath('Cannot move to root(/) directory')
        }

        //  check if target is already exists.
        const destParent = this._getNode(dest.dirs)
        const destNode = destParent.getChild(dest.name)
        if(destNode) {
            throw new AlreadyExist(destPath)
        }

        const srcParent = this._getNode(src.dirs)
        const target = srcParent.getChild(src.name)
        if(!target) {
            throw new PathNotExist(srcPath)
        }
        target.setName(dest.name)
        destParent.addChild(target)
        srcParent.removeChild(src.name)
    }

    link(srcPath: string, destPath: string) {
        // parse
        const src = this._parsePath(srcPath)
        const dest = this._parsePath(destPath)

        // check src or dest == /
        if((src.dirs.length == 0) && !src.name) {
            throw new InvalidPath('Cannot link root(/) directory')
        }
        if((dest.dirs.length == 0) && !dest.name) {
            throw new InvalidPath('Cannot link to root(/) directory')
        }

        //  check if target is already exists.
        const destParent = this._getNode(dest.dirs)
        const destNode = destParent.getChild(dest.name)
        if(destNode) {
            throw new AlreadyExist(destPath)
        }

        const srcParent = this._getNode(src.dirs)
        const target = srcParent.getChild(src.name)
        if(!target) {
            throw new PathNotExist(srcPath)
        }

        //  check link loop <- Requirement.
        // Note:
        // - Linking parent directory into it's subdirectory cause loop link problem. (In real file system it is no problem.)
        // - While linking a subdirectory into it's parent directory does not cause the problem.
        if(destPath.startsWith(srcPath)) {
            throw new LoopLinkIsNotAllowed()
        }

        destParent.addChild(new VirtualFileEntry(FileType.Link, dest.name, srcPath))
    }

    change(path: string, property: string) {
        //  parse path
        const parsed = this._parsePath(path)

        let target = this._root
        if((parsed.dirs.length == 0) && !parsed.name) {
            target = this._root
        } else {
            const parent = this._getNode(parsed.dirs)
            const child = parent.getChild(parsed.name)
            if(!child) {
                throw new PathNotExist(path)
            }
            target = child
        }

        //  toggle property
        target.toggleProperty(property)
    }

    getEntry(path: string): FileEntry {
        const parsed = this._parsePath(path)
        try {
            const parent = this._getNode(parsed.dirs)
            const target = parent.getChild(parsed.name)
            if(!target) {
                throw new PathNotExist(path)
            }
            return target
        } catch (e) {
            throw new PathNotExist(path)
        }
    }

    private _getNode(dirs: string[]): VirtualFileEntry {
        let node: VirtualFileEntry = this._root

        for(const dir of dirs) {
            const child = node.getChild(dir)
            if(!child) {
                throw new PathNotExist('/' + dirs.join('/'))
            }
            node = child
        }

        return node
    }

    // TODO: need to split file path and directory path
    private _parsePath(path: string): ParsedPath {

        if(!path || !path.startsWith('/')) {
            throw new InvalidPath(path)
        }

        const dirs = path.split('/')
        dirs.shift()
        const name = dirs.pop()

        if(name) {
            return {
                dirs: dirs,
                name: name
            }
        } else {
            return {
                dirs: dirs,
                name: ''
            }
        }
    }
}
