
export enum FileType {
    File,
    Directory,
    Link
}

export interface FileEntry {
    type(): FileType        //  entry type
    name(): string          //  entry name
    properties(): string[]
    children(): FileEntry[]
    depth(): number
}

export interface FileSystem {
    createDirectories(params: string[]): void
    createFiles(params: string[]): void
    move(src: string, dest: string): void
    link(src: string, dest: string): void
    change(target: string, property: string): void

    getRoot(): FileEntry;
}
