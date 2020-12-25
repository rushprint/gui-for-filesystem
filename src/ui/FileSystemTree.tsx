import { Component } from "react"
import { FileEntry, FileSystem, FileType } from "../vfs/FileSystem"

interface EntryProperties {
    entry: FileEntry|null
}

export class Entry extends Component<EntryProperties> {

    render() {
        const entry = this.props.entry
        if(entry) {
            const tags = []
            for(const child of entry.children()) {
                tags.push(<Entry entry={child} />)
            }

            switch (entry.type()) {
                case FileType.Directory:
                    tags.unshift(
                        <div style={{ paddingLeft: entry.depth() * 10 }}>
                            {entry.name()} 'dir'
                        </div>
                    )
                    break;
                case FileType.File:
                    tags.unshift(
                        <div style={{ paddingLeft: entry.depth() * 10 }}>
                            {entry.name()} 'file'
                        </div>
                    )
                    break;
                case FileType.Link:
                    tags.unshift(
                        <div style={{ paddingLeft: entry.depth() * 10 }}>
                            {entry.name()} 'link'
                        </div>
                    )
                    break;
            }
            return tags
        }
    }
}

interface FileSystemTreeProperties {
    fs: FileSystem
}

export class FileSystemTree extends Component<FileSystemTreeProperties> {

    render() {
        return (
            <div>
                <Entry entry={this.props.fs.getDirectory('/')} />
            </div>
        )
    }
}

export default FileSystemTree
