import { FileType } from '../FileSystem';
import { VirtualFileSystem } from '../VirtualFileSystem';
import { AlreadyExist, InvalidPath, LoopLinkIsNotAllowed } from '../VirtualFileSystemErrors';

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

    expect(() => { fs.link('/a', '/b') }).toThrow()
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

test('Linking a file /a to /b must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a') }).not.toThrow()
    expect(() => { fs.link('/a', '/b') }).not.toThrow()
    expect(() => {
        const link = fs.getEntry('/b')
        expect(link.type()).toEqual(FileType.Link)
        expect(link.origin()).toEqual('/a')
    }).not.toThrow()
});
