import { FileEntry, FileSystem, FileType } from "./FileSystem";
import { ParsedPath, parsePath } from "./Path";
import { isSameArray } from "./Utils";
import { VirtualFileEntry } from "./VirfualFileEntry";
import { AlreadyExist, DirectoryNotFound, FileNotFound, InvalidPath, LoopLinkIsNotAllowed } from "./VirtualFileSystemErrors";

export class VirtualFileSystem implements FileSystem {

    private readonly _root = new VirtualFileEntry(FileType.Directory, '/')

    createDirectories(paths: string[]) {
        for(const dir of paths) {
            this.createDirectory(dir)
        }
    }

    createDirectory(path: string) {

        //  parse path
        const parsed = parsePath(path)

        if(parsed.name) {
            parsed.dirs.push(parsed.name)
        }

        //  creating root directory is not allowed.
        if(parsed.isRoot()) {
            throw new InvalidPath('Creating root(/) directory is not allowed')
        }

        this._createDiretory(parsed.dirs)
    }

    createFiles(paths: string[]) {
        for(const path of paths) {
            this.createFile(path)
        }
    }

    createFile(path: string) {
        //  parse path
        const parsed = parsePath(path)

        if(!parsed.name) {
            throw new InvalidPath(path)
        }

        //  get parent directory
        const parent = this._createDiretory(parsed.dirs)
        if(!parent) {
            throw new InvalidPath(path)
        }

        //  check already exists.
        if(parent.getChild(parsed.name)) {
            throw new AlreadyExist(path)
        }

        //  create child file.
        parent.addChild(new VirtualFileEntry(FileType.File, parsed.name))
    }

    // Limitations
    // - Only support file source.
    move(srcPath: string, dstPath: string) {

        //  find source.
        const parsedSrc = parsePath(srcPath)
        if(!parsedSrc.name) {
            throw new InvalidPath(srcPath)
        }
        // console.log(srcPath, '=>', parsedSrc);

        const parsedDst = parsePath(dstPath)
        if(!parsedDst.name) {
            parsedDst.name = parsedSrc.name
        }

        if(isSameArray(parsedSrc.dirs, parsedDst.dirs) && (parsedSrc.name === parsedDst.name)) {
            throw new AlreadyExist("Source and target is same")
        }

        //  find source file
        const srcDir = this._getDirectoryEntry(parsedSrc)
        if(!srcDir) {
            throw new DirectoryNotFound(parsedSrc.dirPath())
        }
        const src = srcDir.getChild(parsedSrc.name)
        if(!src) {
            throw new FileNotFound(srcPath)
        }

        //  find destination dir
        const dstDir = this._createDiretory(parsedDst.dirs)

        srcDir.removeChild(parsedSrc.name)
        src.setName(parsedDst.name)
        dstDir.addChild(src)

        this._dump()
    }

    link(srcPath: string, dstPath: string) {

        //  find source.
        const parsedSrc = parsePath(srcPath)
        if(!parsedSrc.isFile()) {
            parsedSrc.name = parsedSrc.dirs.pop()
        }
        if(!parsedSrc.name) {
            throw new InvalidPath("Moving root(/) directory is not allowed")
        }

        const srcDir = this._getDirectoryEntry(parsedSrc)
        if(!srcDir) {
            throw new DirectoryNotFound(parsedSrc.dirPath())
        }
        const src = srcDir.getChild(parsedSrc.name)
        if(!src) {
            throw new FileNotFound(srcPath)
        }

        //  find destination
        const parsedDst = parsePath(dstPath)
        if(!parsedDst.isFile()) {
            parsedDst.name = parsedDst.dirs.pop()
        }
        if(!parsedDst.name) {
            throw new InvalidPath("Replacing root(/) directory is not allowed")
        }
        const dstDir = this._createDiretory(parsedDst.dirs)
        const dst = dstDir.getChild(parsedDst.name)
        if(dst) {
            //  We can handle this error => Replace
            throw new AlreadyExist(dstPath)
        }

        //  check link loop <- Requirement.
        // Note:
        // - Linking parent directory into it's subdirectory cause loop link problem. (In real file system it is no problem.)
        // - While linking a subdirectory into it's parent directory does not cause the problem.
        if(dstPath.startsWith(srcPath)) {
            throw new LoopLinkIsNotAllowed()
        }

        dstDir.addChild(new VirtualFileEntry(FileType.Link, parsedDst.name, srcPath))
    }

    change(path: string, property: string) {
        const target = this._getEntry(path)

        //  toggle property
        target.toggleProperty(property)
    }

    getEntry(path: string): FileEntry {
        return this._getEntry(path)
    }

    private _getEntry(path: string): VirtualFileEntry {

        const parsed = parsePath(path)

        if(parsed.isRoot()) {
            return this._root
        }

        const parent = this._getDirectoryEntry(parsed)
        if(!parent) {
            throw new InvalidPath(path)
        }

        if(!parsed.name) {
            return parent
        }

        const target = parent.getChild(parsed.name)
        if(!target) {
            throw new FileNotFound(path)
        }

        return target
    }

    private _getDirectoryEntry(parsed: ParsedPath): VirtualFileEntry|undefined {

        let node: VirtualFileEntry = this._root

        for(const dir of parsed.dirs) {
            const child = node.getChild(dir)
            if(!child) {
                throw new DirectoryNotFound(parsed.dirPath())
            }
            if(child.type() !== FileType.Directory) {
                throw new DirectoryNotFound(parsed.dirPath())
            }
            node = child
        }

        return node
    }

    private _createDiretory(pathNames: string[]): VirtualFileEntry {
        let parent = this._root
        const progress = []

        for(const name of pathNames) {
            progress.push(name)

            const exist = parent.getChild(name)
            if(exist) {
                if(exist.type() === FileType.Directory) {
                    parent = exist
                    // console.log(`child directory ${name} exists`);
                    continue
                } else {
                    throw new AlreadyExist(`/${progress.join('/')} is not directory`)
                }
            } else {
                // console.log(`create child directory ${name}`);
                const child = new VirtualFileEntry(FileType.Directory, name)
                parent.addChild(child)
                parent = child
            }
        }
        return parent
    }

    private _dump() {
        this._root.dump('');
    }
}
