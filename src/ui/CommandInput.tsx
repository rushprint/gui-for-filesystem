import { Component } from "react";

export interface CommandInputHandler {
    onCommand(command: string): void
}

interface CommandInputProperties {
    command: string
    handler: CommandInputHandler
    comment?: string
}

export class CommandInput extends Component<CommandInputProperties> {

    private userInput: string

    constructor(public props: CommandInputProperties) {
        super(props)
        this.userInput = props.command
    }

    render() {
        return (
            <div>
                <input defaultValue={this.props.command} onChange={this.onInputChange}></input>
                <button onClick={this.onClick}>Run</button> {this.props.comment}
            </div>
        )
    }

    onInputChange = (e: any) => {
        this.userInput = e.target.value
    }

    onClick = () => {
        if (this.props.handler) {
            this.props.handler.onCommand(this.userInput)
        }
    }
}

// export default CommandInput
