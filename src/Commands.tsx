import { InvalidParamCount, NotEnoughParams, UnknownCommand } from "./AppErrors"

export enum Command {
    Unknown,
    AddDir,
    AddFile,
    Link,
    Move,
    Change
}

export interface CommandAndParams {
    command: Command
    params: string[]
}

export function parseCommand(input: string): CommandAndParams {
    //  limitations
    //  - no support spaces in file or directory names.

    const splitted = input.split(' ')
    // console.log(splitted)

    if (splitted.length < 1) {
        throw new NotEnoughParams()
    }

    const commandAndParams: CommandAndParams = {
        command: Command.Unknown,
        params: []
    }

    //  get command.
    const command = splitted[0].toLowerCase()
    splitted.shift()    //  remove command.

    switch (command) {
        case "add":
            if (splitted.length < 1) {
                throw new InvalidParamCount();
            }
            const command = splitted[0].toLowerCase()
            splitted.shift()
            switch (command) {
                case "file":
                    commandAndParams.command = Command.AddFile
                    if (splitted.length < 1) {
                        throw new InvalidParamCount();
                    }
                    break
                case "directory":
                    if (splitted.length < 1) {
                        throw new InvalidParamCount();
                    }
                    commandAndParams.command = Command.AddDir
                    break
                default:
                    throw new UnknownCommand()
            }
            break
        case "link":
            commandAndParams.command = Command.Link
            if (splitted.length !== 2) {
                throw new InvalidParamCount();
            }
            break
        case "move":
            if (splitted.length < 2) {
                throw new InvalidParamCount();
            }
            commandAndParams.command = Command.Move
            break
        case "change":
            if (splitted.length < 2) {
                throw new InvalidParamCount();
            }
            commandAndParams.command = Command.Change
            break
        default:
            throw new UnknownCommand()
    }

    //  get params.
    commandAndParams.params = splitted

    return commandAndParams
}
