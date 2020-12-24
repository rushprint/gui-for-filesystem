
export enum FileType {
    File,
    Directory,
    Link
}

export interface FileEntry {
    type(): FileType  //  entry type
    name(): string    //  entry name
}

export interface FileSystem {
    createDirectories(params: string[]): void
    createFiles(params: string[]): void
    move(arg0: string, arg1: string): void
    link(arg0: string, arg1: string): void
    change(arg0: string, arg1: string): void

    getChildren(directory: string): FileEntry[]
}
