import { Component } from "react"
import { FileSystem } from "../vfs/FileSystem"

interface FileSystemTreeProperties {
    fs: FileSystem
}

export class FileSystemTree extends Component<FileSystemTreeProperties> {

    render() {
        return (
            <div>
                tree
            </div>
        )
    }
}

export default FileSystemTree
