import React from 'react';
import { CommandInput, CommandInputHandler } from "./ui/CommandInput"
import './App.css';
import { Command, CommandAndParams, parseCommand } from './Commands';
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
        <h1>GUI for file system</h1>

        <h2>Commands</h2>

        <CommandInput handler={this} command="add directory /a" />
        <CommandInput handler={this} command="add directory /b/a/c" comment="Non-existing directories will be created automatically."/>
        <CommandInput handler={this} command="add file /b/b/k" comment="Non-existing directories will be created automatically."/>
        <CommandInput handler={this} command="add file /b/b/m" />
        <CommandInput handler={this} command="link /a /b/a/c/a" />
        <CommandInput handler={this} command="move /b/b/m /a/" comment="Moving directory is not supported."/>
        <CommandInput handler={this} command="change /b/b hide" comment="Toggle properties, apply children recursively."/>
        <CommandInput handler={this} command="" comment="Custom command input"/>

        <button onClick={this.reset}>Reset</button>

        <h2>File System Tree</h2>
        <FileSystemTree entry={this.state.root}></FileSystemTree>

        <h2>Assumptions & Limitations</h2>

        <li>path delimiter is '/'</li>
        <li>root directory is '/'</li>
        <li>all path parameters must be full-path. (start from /)</li>
        <li>all file and directory names must not have any space characters</li>
        <li>add file command will fail if target already exist</li>
        <li>properties are toggle values. change property twice will turn on and off.</li>
        <li>move operation does not support moving directories.</li>
        <li>move operation will replace file if target already exist.</li>

        <h2>Exceptions</h2>

        <h4>Create directory</h4>
        <li>InvalidPath: Invalid path format</li>
        <li>AlreadyExist: A Non-directory exists in the path</li>

        <h4>Create File</h4>
        <li>InvalidPath: Invalid path format</li>
        <li>AlreadyExist: A Non-directory exists in the path or destination file already exist</li>

        <h4>Move</h4>
        <li>InvalidPath: Invalid path format</li>
        <li>AlreadyExist: Source and Destination are same</li>
        <li>DirectoryNotFound: Invalid source or destination directory path</li>
        <li>FileNotFound: Source file not found</li>

        <h4>Link</h4>
        <li>InvalidPath: Invalid path format</li>
        <li>AlreadyExist: Destination file already exist</li>
        <li>DirectoryNotFound: Invalid source or destination directory path</li>
        <li>FileNotFound: Source file not found</li>
        <li>LoopLinkIsNotAllowed: Linking parent directory into under it's subdirectory</li>

        <h4>Change</h4>
        <li>DirectoryNotFound: Target directory not found</li>
        <li>FileNotFound: Target file not found</li>

        <h2>Test Result</h2>
        <pre>
          $ yarn test -- --verbose
        </pre>
        <img src="test_result.jpg"/>
      </div>
    );
  }

  reset(e: any) {
    e.preventDefault();
    window.location.reload()
  }

  onCommand(input: string): void {
    console.log(input)
    try {
      const parsed = parseCommand(input)

      this.handleCommand(parsed)

      this.setState({
        root: this.fileSystem.getEntry('/')
      })

    } catch (e) {
      window.alert(e)
    }
  }

  private handleCommand(parsed: CommandAndParams) {
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
  }
}

export default App;
