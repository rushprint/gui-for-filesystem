import { VirtualFileSystem } from '../VirtualFileSystem';

test('Deleting / must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.delete(['/']) }).toThrow()
    expect(() => { fs.getEntry('/') }).not.toThrow()
});

test('Deleting not existing /a must fail', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.delete(['/a']) }).toThrow()
});

test('Deleting existing file /a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a') }).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()
    expect(() => { fs.delete(['/a']) }).not.toThrow()
});

test('Deleting existing directory /a must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow()
    expect(() => { fs.getEntry('/a') }).not.toThrow()
    expect(() => { fs.delete(['/a']) }).not.toThrow()
});

test('Deleting directory /a will delete sub items', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createFile('/a/a') }).not.toThrow()
    expect(() => { fs.getEntry('/a/a') }).not.toThrow()
    expect(() => { fs.delete(['/a']) }).not.toThrow()
    expect(() => { fs.getEntry('/a') }).toThrow()
    expect(() => { fs.getEntry('/a/a') }).toThrow()
});

