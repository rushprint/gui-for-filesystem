
export enum FileType {
    File,
    Directory,
    Link
}

export interface FileEntry {
    type(): FileType        //  entry type
    name(): string          //  entry name
    properties(): string[]
    haveProperty(property: string): boolean
    children(): FileEntry[]
    depth(): number
}

/**
 * A Simple virtual file system.
 *
 * Assumptions
 * - path delimeter is '/'
 * - root directory is '/'
 *
 * Limitations
 * - all parameter path must be full path(start from /)
 * - all file and directory names must not have any space characters
 * - move operation accept full path only for both of source and destination
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
