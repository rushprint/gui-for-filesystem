import { FileType } from '../FileSystem';
import { VirtualFileSystem } from '../VirtualFileSystem';
import { AlreadyExist, DirectoryNotFound, InvalidPath, LoopLinkIsNotAllowed } from '../VirtualFileSystemErrors';

test('Creating a virtual file system object must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()
});

////////////////////////////////////////////////////////////////////////
// Directory
////////////////////////////////////////////////////////////////////////

test('Getting root node must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => {
        const root = fs.getEntry('/')
        expect(root).not.toBeNull()
    }).not.toThrow()
});


test('Creating root directory / must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/') }).toThrow(InvalidPath)
});

test('Creating a directory /a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow(InvalidPath)

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.Directory)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()
});

test('Creating duplicated directories /a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow(InvalidPath)

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.Directory)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()

    expect(() => { fs.createDirectory('/a') }).not.toThrow(AlreadyExist)
});

test('Creating a directory that is duplicated name of file /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a') }).not.toThrow(InvalidPath)

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.File)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()

    expect(() => { fs.createDirectory('/a') }).toThrow(AlreadyExist)
});

test('Creating a directory without parent /a/b must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a/b') }).not.toThrow()
});

test('Creating multiple directories /a, /b must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectories(['/a', '/b']) }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.Directory)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/b')
        expect(dir.type()).toEqual(FileType.Directory)
        expect(dir.name()).toEqual('b')
    }).not.toThrow()
});

test('Depth of nodes', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow(InvalidPath)
    expect(() => { fs.createDirectory('/a/b') }).not.toThrow(InvalidPath)
    expect(() => { fs.createDirectory('/a/b/c') }).not.toThrow(InvalidPath)

    expect(() => {
        const dir = fs.getEntry('/')
        expect(dir.depth()).toEqual(0)
    }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.depth()).toEqual(1)
    }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a/b')
        expect(dir.depth()).toEqual(2)
    }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a/b/c')
        expect(dir.depth()).toEqual(3)
    }).not.toThrow()
});


////////////////////////////////////////////////////////////////////////
// File
////////////////////////////////////////////////////////////////////////

test('Creating a file /a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a') }).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.File)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()
});

test('Creating duplicated files /a, /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.File)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()

    expect(() => { fs.createFile('/a') }).toThrow(AlreadyExist)
});

test('Creating invalid path file /a/b/c must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a/b/c') }).not.toThrow()
});

