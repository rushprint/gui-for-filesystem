import { parsePath } from "../Path";
import { isSameArray } from "../Utils";

test('dir path /', () => {
    const parsed = parsePath('/')
    expect(isSameArray(parsed.dirs, [])).toEqual(true)
});

test('dir path /a', () => {
    const parsed = parsePath('/a')
    expect(isSameArray(parsed.dirs, [])).toEqual(true)
    expect(parsed.name).toEqual('a')
});

test('dir path /a/', () => {
    const parsed = parsePath('/a/')
    expect(isSameArray(parsed.dirs, ['a'])).toEqual(true)
    expect(parsed.name).toEqual(undefined)
});

test('dir path /a/b', () => {
    const parsed = parsePath('/a/b')
    expect(isSameArray(parsed.dirs, ['a'])).toEqual(true)
    expect(parsed.name).toEqual('b')
});

test('dir path /a/b/c', () => {
    const parsed = parsePath('/a/b/c')
    expect(isSameArray(parsed.dirs, ['a', 'b'])).toEqual(true)
    expect(parsed.name).toEqual('c')
});
