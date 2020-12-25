import { VirtualFileSystem } from '../VirtualFileSystem';

////////////////////////////////////////////////////////////////////////
// Change
////////////////////////////////////////////////////////////////////////

test('Changing property of a file must success', () => {
    const fs = new VirtualFileSystem()
    expect(fs).not.toBeNull()

    expect(() => { fs.createDirectory('/a') }).not.toThrow()
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

    expect(() => { fs.createFile('/a') }).not.toThrow()
    expect(() => { fs.change('/', 'hide') }).not.toThrow()
    expect(() => {
        const node = fs.getEntry('/a')
        expect(node.name()).toEqual('a')
        expect(node.haveProperty('hide')).toEqual(true)
    }).not.toThrow()
});
