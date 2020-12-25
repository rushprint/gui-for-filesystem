
export enum FileType {
    File,
    Directory,
    Link
}

export interface FileEntry {
    type(): FileType
    depth(): number
    name(): string

    properties(): string[]
    haveProperty(property: string): boolean

    children(): FileEntry[]

    origin(): string|undefined;   //  if entry is link then returns indicate orginal path.
}

/**
 * A Simple virtual file system.
 *
 * Assumptions & Limitations
 * - path delimiter is '/'
 * - root directory is '/'
 * - properties are toggle values. change property twice will turn on and off.
 * - all path parameters must be full-path. (start from /)
 * - all file and directory names must not have any space characters
 * - move operation does not support moving directories.
 * - move operation will replace file if target already exist.
 */

export interface FileSystem {
    // create a directory with given path or throw an exception
    createDirectory(path: string): void
    // create multiple directories with given paths or throw an exception
    createDirectories(paths: string[]): void

    // create a file with given path or throw an exception
    createFile(path: string): void
    // create multiple files with given paths or throw an exception
    createFiles(path: string[]): void

    // move a file or directory to other place or throw an exception
    // - moving root directory to other location is not allowed
    // - moving a directo to root directory /a -> a is not allowed
    move(src: string, dest: string): void

    // Create a link of 'dest' which is pointing 'src'
    link(src: string, dest: string): void

    // Toggle property of a file or directory
    // - if target is directory children will have same properties.
    change(target: string, property: string): void

    // return FileEntry object or throw an exception.
    getEntry(path: string): FileEntry;
}
