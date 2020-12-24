import { PathNotExist } from "../AppErrors";
import { FileEntry, FileSystem, FileType } from "./FileSystem";
import { VirtualFileEntry } from "./VirfualFileEntry";

export class VirtualFileSystem implements FileSystem {

    private readonly _root = new VirtualFileEntry(FileType.Directory, '/')

    createDirectories(params: string[]) {
        for(const dir of params) {
            this.createDirectory(dir)
        }
    }

    private createDirectory(path: string) {
        console.log(path)
    }

    createFiles(params: string[]) {
        throw new Error('Method not implemented.');
    }

    move(arg0: string, arg1: string) {
        throw new Error('Method not implemented.');
    }

    link(arg0: string, arg1: string) {
        throw new Error('Method not implemented.');
    }

    change(arg0: string, arg1: string) {
        throw new Error('Method not implemented.');
    }

    getChildren(directory: string): FileEntry[] {
        const node = this.find(directory)
        if (!node) {
            throw new PathNotExist()
        }
        return node.children()
    }

    private parsePath(path: string): string[] {
        return path.split('/')
    }

    private find(path: string): VirtualFileEntry | null {
        return null
    }
}
