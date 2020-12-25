import React from 'react';
import { CommandInput, CommandInputHandler } from "./ui/CommandInput"
import './App.css';
import { Command, parseCommand } from './Commands';
import { VirtualFileSystem } from './vfs/VirtualFileSystem';
import { FileEntry, FileSystem } from './vfs/FileSystem';
import { FileSystemTree } from './ui/FileSystemTree';

interface AppProperties {

}

interface AppState {
  root: FileEntry
}

class App extends React.Component<AppProperties, AppState> implements CommandInputHandler {

  /////////////////////////////////////////////////////////////////

  private readonly fileSystem: FileSystem = new VirtualFileSystem()

  constructor(props: AppProperties) {
    super(props)
    this.state = {
      root: this.fileSystem.getEntry('/')
    }
  }

  render() {
    return (
      <div>
        <h3>GUI for file system</h3>

        <p>Commands</p>
        <CommandInput handler={this} command="add directory /a" />
        <CommandInput handler={this} command="add directory /b/a/c" />
        <CommandInput handler={this} command="add file /b/b/k" />
        <CommandInput handler={this} command="add file /b/b/m" />
        <CommandInput handler={this} command="link /a /b/a/c/a" />
        <CommandInput handler={this} command="move /b/b/m /a/" />
        <CommandInput handler={this} command="change /b/b hide" />
        <CommandInput handler={this} command="" />

        <p>File System Tree</p>
        <FileSystemTree entry={this.state.root}></FileSystemTree>
      </div>
    );
  }

  onCommand(input: string): void {
    console.log(input)
    try {
      const parsed = parseCommand(input)

      //  handle commands.
      switch (parsed.command) {
        case Command.AddDir:
          this.fileSystem.createDirectories(parsed.params);
          break;
        case Command.AddFile:
          this.fileSystem.createFiles(parsed.params);
          break;
        case Command.Link:
          this.fileSystem.link(parsed.params[0], parsed.params[1]);
          break;
        case Command.Move:
          this.fileSystem.move(parsed.params[0], parsed.params[1]);
          break;
        case Command.Change:
          this.fileSystem.change(parsed.params[0], parsed.params[1]);
          break;
      }

      this.setState({
        root: this.fileSystem.getEntry('/')
      })

    } catch (e) {
      window.alert(e)
    }
  }
}

export default App;
