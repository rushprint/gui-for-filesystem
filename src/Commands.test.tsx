import { InvalidParamCount, UnknownCommand } from "./AppErrors";
import { parseCommand } from "./Commands";

test('Command unkonwn', () => {
    expect(() => { parseCommand('') }).toThrow(UnknownCommand)
    expect(() => { parseCommand('unknown') }).toThrow(UnknownCommand)
    expect(() => { parseCommand('unknown aaa') }).toThrow(UnknownCommand)
});

test('Command "add file"', () => {
    expect(() => { parseCommand('add') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('add file') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('add file /a') }).not.toThrow()
    expect(() => { parseCommand('add file /a /b') }).not.toThrow()  //  multiple target support.
});

test('Command "add directory"', () => {
    expect(() => { parseCommand('add') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('add directory') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('add directory /a') }).not.toThrow()
    expect(() => { parseCommand('add directory /a /b') }).not.toThrow() //  multiple target support.
});

test('Command "move"', () => {
    expect(() => { parseCommand('move') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('move /a') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('move /a /a') }).not.toThrow()
    expect(() => { parseCommand('move /a /b /c') }).toThrow(InvalidParamCount)
});

test('Command "link"', () => {
    expect(() => { parseCommand('link') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('link /a') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('link /a /a') }).not.toThrow()
    expect(() => { parseCommand('link /a /b /c') }).toThrow(InvalidParamCount)
});

test('Command "change"', () => {
    expect(() => { parseCommand('change') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('change /a') }).toThrow(InvalidParamCount)
    expect(() => { parseCommand('change /a a') }).not.toThrow()
    expect(() => { parseCommand('change /a b c') }).toThrow(InvalidParamCount)
});
