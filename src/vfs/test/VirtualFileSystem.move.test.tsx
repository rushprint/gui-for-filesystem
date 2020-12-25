import { VirtualFileSystem } from '../VirtualFileSystem';
import { AlreadyExist, InvalidPath } from '../VirtualFileSystemErrors';

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

test('Moving a file /a to same path /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/a') }).toThrow(AlreadyExist)

    expect(() => { fs.getEntry('/a') }).not.toThrow()
});

test('Moving a file /a to non exist path /b/b/a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a')}).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()

    expect(() => { fs.move('/a', '/b/b/a') }).not.toThrow()

    expect(() => { fs.getEntry('/b/b/a') }).not.toThrow()
});

test('Moving a file /b/b/m to /a/ must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/b/b/m')}).not.toThrow()
    expect(() => { fs.getEntry('/b/b/m') }).not.toThrow()

    expect(() => { fs.move('/b/b/m', '/a/') }).not.toThrow()

    expect(() => { fs.getEntry('/a/m') }).not.toThrow()
});
