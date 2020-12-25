import { FileType } from './FileSystem';
import { VirtualFileSystem } from './VirtualFileSystem';
import { AlreadyExist, InvalidPath, LoopLinkIsNotAllowed, PathNotExist } from './VirtualFileSystemErrors';

test('Creating a virtual file system object must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()
});

////////////////////////////////////////////////////////////////////////
// Directory
////////////////////////////////////////////////////////////////////////

test('Creating directory /(root) must fail', () => {
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

test('Creating duplicated directories /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow(InvalidPath)

    expect(() => {
        const dir = fs.getEntry('/a')
        expect(dir.type()).toEqual(FileType.Directory)
        expect(dir.name()).toEqual('a')
    }).not.toThrow()

    expect(() => { fs.createDirectory('/a') }).toThrow(AlreadyExist)
});

test('Creating a directory without parent /a/b must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a/b') }).toThrow(PathNotExist)
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

test('Creating invalid path file /a/b/c must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a/b/c') }).toThrow(PathNotExist)
});

////////////////////////////////////////////////////////////////////////
// Move
////////////////////////////////////////////////////////////////////////

test('Moving a file /a to /b must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/b') }).not.toThrow()

    expect(() => { fs.getEntry('/a') }).toThrow()
    expect(() => { fs.getEntry('/b') }).not.toThrow()
});

test('Moving a file /a to /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/a') }).toThrow(AlreadyExist)

    expect(() => { fs.getEntry('/a') }).not.toThrow()
});

test('Moving a directory /a to /b must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/b') }).not.toThrow()

    expect(() => { fs.getEntry('/a') }).toThrow()
    expect(() => { fs.getEntry('/b') }).not.toThrow()
});

test('Moving a directory /a to /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/a') }).toThrow(AlreadyExist)

    expect(() => { fs.getEntry('/a') }).not.toThrow()
});

test('Moving root directory / to /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.move('/', '/a') }).toThrow(InvalidPath)
});

test('Moving directory /a to / must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/') }).toThrow(InvalidPath)
});

test('Moving a directory /a to non exists path /a/b/c must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/a/b/c') }).toThrow(PathNotExist)

    expect(() => { fs.getEntry('/a') }).not.toThrow()
});

////////////////////////////////////////////////////////////////////////
// Change
////////////////////////////////////////////////////////////////////////

test('Changing property of a file must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a')}).not.toThrow()
    expect(() => { fs.change('/a', 'hide') }).not.toThrow()
    expect(() => {
        const node = fs.getEntry('/a')
        expect(node.name()).toEqual('a')
        expect(node.haveProperty('hide')).toEqual(true)
    }).not.toThrow()
});

test('Changing property of a directory must change children also', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()
    expect(() => { fs.change('/', 'hide') }).not.toThrow()
    expect(() => {
        const node = fs.getEntry('/a')
        expect(node.name()).toEqual('a')
        expect(node.haveProperty('hide')).toEqual(true)
    }).not.toThrow()
});

////////////////////////////////////////////////////////////////////////
// Link
////////////////////////////////////////////////////////////////////////

test('Linking root(/) directory to /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.link('/', '/a') }).toThrow(InvalidPath)
});

test('Linking non exist src /a to /b must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.link('/a', '/b') }).toThrow(PathNotExist)
});


test('Linking a file /a to /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a') }).not.toThrow()
    expect(() => { fs.link('/a', '/a') }).toThrow(AlreadyExist)
});

test('Linking a directory /a to /a/b (loop link) must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow()
    expect(() => { fs.link('/a', '/a/a') }).toThrow(LoopLinkIsNotAllowed)
});
